/**
 * Repositorio de contenido del portafolio (solo se usa en el servidor).
 *
 * Estrategia "Supabase primero, archivo local de respaldo":
 *  1. Si existen NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY, se consultan
 *     cv_perfil, cv_conocimientos, cv_educacion y cv_proyectos con la clave anónima
 *     (las políticas RLS solo permiten leer lo público).
 *  2. Cada sección se resuelve por separado: si su tabla responde con datos válidos,
 *     se usan; si falla, tarda demasiado o está vacía, se usa `data/cv.ts`.
 *  3. Así el sitio nunca se cae por la base de datos y el contenido se puede
 *     administrar desde /portafolio/editar o desde el panel de Supabase.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import * as localCv from '@/data/cv'
import {
  EDUCATION_COLUMNS,
  KNOWLEDGE_COLUMNS,
  PROFILE_COLUMNS,
  PROJECT_COLUMNS,
  editableEducationFromRow,
  editableKnowledgeFromRow,
  editableProjectFromRow,
  educationFromRow,
  knowledgeFromRow,
  profileFromRow,
  projectFromRow,
  withVisibility,
  type EducationRow,
  type KnowledgeRow,
  type ProfileRow,
  type ProjectRow,
} from './cv-mappers'
import type { ContentSource, CvContent, CvDraft } from './types'

/** Tiempo máximo de espera por consulta; evita que un build o una visita se quede colgada. */
const REQUEST_TIMEOUT_MS = 4000

/* ---------- Cliente de solo lectura (visitantes) ---------- */

function createReadOnlyClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      // Cada petición se cancela si supera el tiempo máximo.
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }),
    },
  })
}

/**
 * Lee las filas visibles de una tabla ordenadas por la columna `orden`.
 * Devuelve `null` ante cualquier error para que la sección use el respaldo local.
 */
async function fetchVisibleRows<Row>(client: SupabaseClient, table: string, columns: string): Promise<Row[] | null> {
  try {
    const { data, error } = await client
      .from(table)
      .select(columns)
      .eq('visible', true)
      .order('orden', { ascending: true })

    if (error) {
      console.warn(`[portafolio] No se pudo leer "${table}" en Supabase: ${error.message}`)
      return null
    }
    return (data ?? []) as Row[]
  } catch (error) {
    console.warn(`[portafolio] Error de red al leer "${table}":`, error)
    return null
  }
}

/** Lee la única fila de cv_perfil (o null si no existe o hay un error). */
async function fetchProfileRow(client: SupabaseClient): Promise<ProfileRow | null> {
  try {
    const { data, error } = await client.from('cv_perfil').select(PROFILE_COLUMNS).eq('id', 1).maybeSingle()
    if (error) {
      console.warn(`[portafolio] No se pudo leer "cv_perfil" en Supabase: ${error.message}`)
      return null
    }
    return (data as ProfileRow | null) ?? null
  } catch (error) {
    console.warn('[portafolio] Error de red al leer "cv_perfil":', error)
    return null
  }
}

/** Convierte las filas y descarta las inválidas; si no queda ninguna, devuelve null. */
function mapRows<Row, Item>(rows: Row[] | null, mapper: (row: Row) => Item | null): Item[] | null {
  if (!rows) return null
  const items = rows.map(mapper).filter((item): item is Item => item !== null)
  return items.length > 0 ? items : null
}

/* ---------- API pública: contenido del sitio ---------- */

/** Obtiene todo el contenido del portafolio combinando Supabase y el respaldo local. */
export async function getCvContent(): Promise<CvContent> {
  const client = createReadOnlyClient()

  if (!client) {
    return { ...localContent(), source: 'local' }
  }

  const [profileRow, knowledgeRows, educationRows, projectRows] = await Promise.all([
    fetchProfileRow(client),
    fetchVisibleRows<KnowledgeRow>(client, 'cv_conocimientos', KNOWLEDGE_COLUMNS),
    fetchVisibleRows<EducationRow>(client, 'cv_educacion', EDUCATION_COLUMNS),
    fetchVisibleRows<ProjectRow>(client, 'cv_proyectos', PROJECT_COLUMNS),
  ])

  const profile = profileRow ? profileFromRow(profileRow, localCv.profile.photo) : null
  const knowledge = mapRows(knowledgeRows, knowledgeFromRow)
  const education = mapRows(educationRows, educationFromRow)
  const projects = mapRows(projectRows, projectFromRow)

  const sectionsFromDb = [profile, knowledge, education, projects].filter(Boolean).length
  const source: ContentSource = sectionsFromDb === 4 ? 'supabase' : sectionsFromDb === 0 ? 'local' : 'mixto'

  return {
    profile: profile ?? localCv.profile,
    knowledge: knowledge ?? localCv.knowledge,
    education: education ?? localCv.education,
    projects: projects ?? localCv.projects,
    source,
  }
}

function localContent(): Omit<CvContent, 'source'> {
  return {
    profile: localCv.profile,
    knowledge: localCv.knowledge,
    education: localCv.education,
    projects: localCv.projects,
  }
}

/* ---------- API del editor (usa la sesión de quien edita) ---------- */

export type EditorAccess =
  | { status: 'allowed' }
  | { status: 'forbidden' }
  | { status: 'setup-required'; detail: string }

/** Verifica con la función SQL cv_puede_editar() si el usuario actual puede editar. */
export async function checkEditorAccess(client: SupabaseClient): Promise<EditorAccess> {
  const { data, error } = await client.rpc('cv_puede_editar')
  if (error) return { status: 'setup-required', detail: error.message }
  return data === true ? { status: 'allowed' } : { status: 'forbidden' }
}

export type EditorDraftResult = { status: 'ok'; draft: CvDraft } | { status: 'setup-required'; detail: string }

/**
 * Carga el borrador completo para el editor, incluidas las filas ocultas.
 * Las secciones vacías se completan con el contenido local como punto de partida.
 */
export async function getCvDraftForEditor(client: SupabaseClient): Promise<EditorDraftResult> {
  const [profileResult, knowledgeResult, educationResult, projectResult] = await Promise.all([
    client.from('cv_perfil').select(PROFILE_COLUMNS).eq('id', 1).maybeSingle(),
    client.from('cv_conocimientos').select(KNOWLEDGE_COLUMNS).order('orden', { ascending: true }),
    client.from('cv_educacion').select(EDUCATION_COLUMNS).order('orden', { ascending: true }),
    client.from('cv_proyectos').select(PROJECT_COLUMNS).order('orden', { ascending: true }),
  ])

  const failed = [profileResult, knowledgeResult, educationResult, projectResult].find((result) => result.error)
  if (failed?.error) return { status: 'setup-required', detail: failed.error.message }

  const profile = profileResult.data
    ? profileFromRow(profileResult.data as ProfileRow, localCv.profile.photo)
    : null

  return {
    status: 'ok',
    draft: {
      profile: profile ?? localCv.profile,
      knowledge:
        mapRows(knowledgeResult.data as KnowledgeRow[], editableKnowledgeFromRow) ??
        localCv.knowledge.map((item) => withVisibility(item, true)),
      education:
        mapRows(educationResult.data as EducationRow[], editableEducationFromRow) ??
        localCv.education.map((item) => withVisibility(item, true)),
      projects:
        mapRows(projectResult.data as ProjectRow[], editableProjectFromRow) ??
        localCv.projects.map((item) => withVisibility(item, true)),
    },
  }
}
