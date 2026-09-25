/**
 * Traducción entre las filas de Supabase (columnas en español) y los tipos del
 * frontend (en inglés). Se usa al leer el CV público, al cargar el editor y al guardar.
 *
 * Al leer, cada valor se valida: si algo viene incompleto o con un enlace
 * peligroso, se descarta en lugar de romper la página.
 */
import { isIconName } from './icons'
import { isSafeHref, isSafeImageSrc } from './safe-url'
import type {
  ContactItem,
  CvDraft,
  EditableEducation,
  EditableKnowledge,
  EditableProject,
  EducationEntry,
  Knowledge,
  Profile,
  Project,
  Skill,
  SocialLink,
} from './types'

/* ---------- Forma de las filas en Supabase ---------- */

export interface ProfileRow {
  nombre_completo: string
  nombre_corto: string
  titulo: string
  roles: string[] | null
  resumen: string
  sobre_mi: string[] | null
  foto_url: string
  disponible: boolean | null
  disponibilidad_texto: string | null
  correo: string
  anios_experiencia: number | null
  contacto: unknown
  idiomas: unknown
  lenguajes: unknown
  habilidades: string[] | null
  redes: unknown
  empresas: string[] | null
}

export interface KnowledgeRow {
  id: number
  titulo: string
  descripcion: string
  icono: string
  visible?: boolean
}

export interface EducationRow {
  id: number
  institucion: string
  titulo: string
  estado: string
  periodo: string
  descripcion: string
  visible?: boolean
}

export interface ProjectRow {
  id: number
  slug: string
  titulo: string
  resumen: string
  descripcion: string
  imagen_url: string
  tecnologias: string[] | null
  logros: string[] | null
  repo_url: string | null
  demo_url: string | null
  nota_privada: string | null
  visible?: boolean
}

export const PROFILE_COLUMNS =
  'nombre_completo, nombre_corto, titulo, roles, resumen, sobre_mi, foto_url, disponible, disponibilidad_texto, correo, anios_experiencia, contacto, idiomas, lenguajes, habilidades, redes, empresas'
export const KNOWLEDGE_COLUMNS = 'id, titulo, descripcion, icono, visible'
export const EDUCATION_COLUMNS = 'id, institucion, titulo, estado, periodo, descripcion, visible'
export const PROJECT_COLUMNS =
  'id, slug, titulo, resumen, descripcion, imagen_url, tecnologias, logros, repo_url, demo_url, nota_privada, visible'

/* ---------- Utilidades de validación ---------- */

const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Lista de textos sin vacíos. */
const textList = (values: unknown): string[] =>
  Array.isArray(values) ? values.filter(hasText).map((value) => value.trim()) : []

/** Lista de objetos (para las columnas jsonb). */
const recordList = (value: unknown): Record<string, unknown>[] => (Array.isArray(value) ? value.filter(isRecord) : [])

/** Nivel de dominio entre 0 y 100, o null si no es un número. */
const toLevel = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : null

function toSkills(value: unknown): Skill[] {
  return recordList(value).flatMap((item) => {
    const level = toLevel(item.nivel)
    if (!hasText(item.nombre) || level === null) return []
    return [{ name: item.nombre.trim(), level, ...(hasText(item.nota) ? { note: item.nota.trim() } : {}) }]
  })
}

function toContact(value: unknown): ContactItem[] {
  return recordList(value).flatMap((item) => {
    if (!hasText(item.etiqueta) || !hasText(item.valor)) return []
    return [
      {
        label: item.etiqueta.trim(),
        value: item.valor.trim(),
        icon: isIconName(item.icono) ? item.icono : 'globe',
        ...(isSafeHref(item.enlace as string) ? { href: (item.enlace as string).trim() } : {}),
      },
    ]
  })
}

function toSocials(value: unknown): SocialLink[] {
  return recordList(value).flatMap((item) => {
    if (!hasText(item.nombre) || !isSafeHref(item.url as string)) return []
    return [{ name: item.nombre.trim(), url: (item.url as string).trim(), icon: isIconName(item.icono) ? item.icono : 'globe' }]
  })
}

/* ---------- Filas → tipos del frontend ---------- */

/**
 * Convierte la fila de cv_perfil. Devuelve null si faltan datos esenciales.
 * `fallbackPhoto` se usa si la foto guardada no es una URL segura.
 */
export function profileFromRow(row: ProfileRow, fallbackPhoto: string): Profile | null {
  if (!hasText(row.nombre_completo) || !hasText(row.nombre_corto) || !hasText(row.titulo) || !hasText(row.resumen)) {
    return null
  }

  const roles = textList(row.roles)
  return {
    fullName: row.nombre_completo.trim(),
    displayName: row.nombre_corto.trim(),
    title: row.titulo.trim(),
    roles: roles.length > 0 ? roles : [row.titulo.trim()],
    summary: row.resumen.trim(),
    about: textList(row.sobre_mi),
    photo: isSafeImageSrc(row.foto_url) ? row.foto_url.trim() : fallbackPhoto,
    availability: { available: row.disponible !== false, label: (row.disponibilidad_texto ?? '').trim() },
    contact: toContact(row.contacto),
    languages: toSkills(row.idiomas),
    programmingLanguages: toSkills(row.lenguajes),
    extraSkills: textList(row.habilidades),
    socials: toSocials(row.redes),
    companies: textList(row.empresas),
    yearsOfExperience: Math.max(0, Math.round(row.anios_experiencia ?? 0)),
    email: (row.correo ?? '').trim(),
  }
}

export function knowledgeFromRow(row: KnowledgeRow): Knowledge | null {
  if (!hasText(row.titulo) || !hasText(row.descripcion)) return null
  return {
    id: String(row.id),
    title: row.titulo.trim(),
    description: row.descripcion.trim(),
    // Si el ícono escrito en la BD no existe, se usa uno genérico en lugar de romper la página.
    icon: isIconName(row.icono) ? row.icono : 'sparkles',
  }
}

export function educationFromRow(row: EducationRow): EducationEntry | null {
  if (!hasText(row.institucion) || !hasText(row.titulo)) return null
  return {
    id: String(row.id),
    institution: row.institucion.trim(),
    degree: row.titulo.trim(),
    status: (row.estado ?? '').trim(),
    period: (row.periodo ?? '').trim(),
    description: (row.descripcion ?? '').trim(),
  }
}

export function projectFromRow(row: ProjectRow): Project | null {
  if (!hasText(row.titulo) || !hasText(row.resumen) || !isSafeImageSrc(row.imagen_url)) return null
  return {
    id: hasText(row.slug) ? row.slug : String(row.id),
    title: row.titulo.trim(),
    summary: row.resumen.trim(),
    description: hasText(row.descripcion) ? row.descripcion.trim() : row.resumen.trim(),
    image: row.imagen_url.trim(),
    technologies: textList(row.tecnologias),
    highlights: textList(row.logros),
    ...(isSafeHref(row.repo_url) ? { repoUrl: row.repo_url.trim() } : {}),
    ...(isSafeHref(row.demo_url) ? { demoUrl: row.demo_url.trim() } : {}),
    ...(hasText(row.nota_privada) ? { privateNote: row.nota_privada.trim() } : {}),
  }
}

/* ---------- Versiones para el editor (incluyen `visible`) ---------- */

export const withVisibility = <T>(item: T, visible: boolean | undefined): T & { visible: boolean } => ({
  ...item,
  visible: visible !== false,
})

export const editableKnowledgeFromRow = (row: KnowledgeRow): EditableKnowledge | null => {
  const item = knowledgeFromRow(row)
  return item ? withVisibility(item, row.visible) : null
}

export const editableEducationFromRow = (row: EducationRow): EditableEducation | null => {
  const item = educationFromRow(row)
  return item ? withVisibility(item, row.visible) : null
}

export const editableProjectFromRow = (row: ProjectRow): EditableProject | null => {
  const item = projectFromRow(row)
  return item ? withVisibility(item, row.visible) : null
}

/* ---------- Borrador del editor → parámetros de la función cv_guardar ---------- */

const skillToJson = (skill: Skill) => ({ nombre: skill.name, nivel: skill.level, ...(skill.note ? { nota: skill.note } : {}) })

export function draftToRpcParams(draft: CvDraft) {
  const { profile } = draft
  return {
    p_perfil: {
      nombre_completo: profile.fullName,
      nombre_corto: profile.displayName,
      titulo: profile.title,
      roles: profile.roles,
      resumen: profile.summary,
      sobre_mi: profile.about,
      foto_url: profile.photo,
      disponible: profile.availability.available,
      disponibilidad_texto: profile.availability.label,
      correo: profile.email,
      anios_experiencia: profile.yearsOfExperience,
      contacto: profile.contact.map((item) => ({
        etiqueta: item.label,
        valor: item.value,
        icono: item.icon,
        ...(item.href ? { enlace: item.href } : {}),
      })),
      idiomas: profile.languages.map(skillToJson),
      lenguajes: profile.programmingLanguages.map(skillToJson),
      habilidades: profile.extraSkills,
      redes: profile.socials.map((social) => ({ nombre: social.name, url: social.url, icono: social.icon })),
      empresas: profile.companies,
    },
    p_conocimientos: draft.knowledge.map((item) => ({
      titulo: item.title,
      descripcion: item.description,
      icono: item.icon,
      visible: item.visible,
    })),
    p_educacion: draft.education.map((item) => ({
      institucion: item.institution,
      titulo: item.degree,
      estado: item.status,
      periodo: item.period,
      descripcion: item.description,
      visible: item.visible,
    })),
    p_proyectos: draft.projects.map((project) => ({
      slug: project.id,
      titulo: project.title,
      resumen: project.summary,
      descripcion: project.description,
      imagen_url: project.image,
      tecnologias: project.technologies,
      logros: project.highlights,
      repo_url: project.repoUrl ?? null,
      demo_url: project.demoUrl ?? null,
      nota_privada: project.privateNote ?? null,
      visible: project.visible,
    })),
  }
}
