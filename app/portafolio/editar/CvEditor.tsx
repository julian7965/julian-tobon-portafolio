'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CvDraft } from '@/lib/portafolio/types'
import type { IconName } from '@/lib/portafolio/icons'
import { cvDraftSchema, describeIssues, type CvIssue } from '@/lib/portafolio/cv-schema'
import { Button, Icon } from '@/components/portafolio/atoms'
import { EditorTemplate } from '@/components/portafolio/templates'
import {
  ContactForm,
  EducationForm,
  KnowledgeForm,
  ProfileForm,
  ProjectsForm,
  SkillsForm,
  toCvDraft,
  toEditorDraft,
  type EditorDraft,
  type EditorProfile,
  type FieldErrors,
} from '@/components/portafolio/organisms/editor'
import { saveCv } from './actions'
import { SignOutButton } from './SignOutButton'

type TabId = 'perfil' | 'contacto' | 'habilidades' | 'conocimientos' | 'educacion' | 'proyectos'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'perfil', label: 'Perfil y foto', icon: 'user' },
  { id: 'contacto', label: 'Contacto y redes', icon: 'mail' },
  { id: 'habilidades', label: 'Habilidades y trayectoria', icon: 'chart' },
  { id: 'conocimientos', label: 'Conocimientos', icon: 'layers' },
  { id: 'educacion', label: 'Educación', icon: 'graduation' },
  { id: 'proyectos', label: 'Proyectos', icon: 'briefcase' },
]

const PROFILE_SKILL_FIELDS = new Set(['languages', 'programmingLanguages', 'extraSkills', 'companies'])

/** Pestaña del editor a la que pertenece un error, según la ruta del campo. */
function tabForPath(path: (string | number)[]): TabId {
  const [section, field] = path
  if (section === 'knowledge') return 'conocimientos'
  if (section === 'education') return 'educacion'
  if (section === 'projects') return 'proyectos'
  if (field === 'contact' || field === 'socials') return 'contacto'
  if (typeof field === 'string' && PROFILE_SKILL_FIELDS.has(field)) return 'habilidades'
  return 'perfil'
}

/** Valida el borrador con las mismas reglas que usa el servidor. */
function validate(draft: CvDraft): CvIssue[] {
  const result = cvDraftSchema.safeParse(draft)
  return result.success ? [] : describeIssues(result.error)
}

type SaveStatus =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; message: string }
  | { kind: 'error'; message: string }

interface CvEditorProps {
  initialDraft: CvDraft
  userEmail: string
}

/**
 * Editor completo del CV (nivel "página" de atomic design, del lado del cliente).
 * Mantiene el borrador en memoria, valida con zod, avisa si hay cambios sin
 * guardar y guarda todo con la acción del servidor `saveCv`.
 */
export function CvEditor({ initialDraft, userEmail }: CvEditorProps) {
  const [draft, setDraft] = useState<EditorDraft>(() => toEditorDraft(initialDraft))
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(toCvDraft(toEditorDraft(initialDraft))))
  const [activeTab, setActiveTab] = useState<TabId>('perfil')
  const [status, setStatus] = useState<SaveStatus>({ kind: 'idle' })
  // Los errores se muestran después del primer intento de guardar y se actualizan en vivo.
  const [showErrors, setShowErrors] = useState(false)

  const payload = useMemo(() => toCvDraft(draft), [draft])
  const currentJson = useMemo(() => JSON.stringify(payload), [payload])
  const dirty = currentJson !== savedJson
  const saving = status.kind === 'saving'

  const issues = useMemo(() => (showErrors ? validate(payload) : []), [payload, showErrors])

  /** Errores por ruta ("projects.2.title") para mostrarlos junto a cada campo. */
  const fieldErrors: FieldErrors = useMemo(() => {
    const map: FieldErrors = new Map()
    issues.forEach((issue) => {
      const key = issue.path.join('.')
      if (!map.has(key)) map.set(key, issue.detail)
    })
    return map
  }, [issues])

  const errorsByTab = useMemo(() => {
    const counts = new Map<TabId, number>()
    issues.forEach((issue) => {
      const tab = tabForPath(issue.path)
      counts.set(tab, (counts.get(tab) ?? 0) + 1)
    })
    return counts
  }, [issues])

  const updateProfile = (patch: Partial<EditorProfile>) =>
    setDraft((current) => ({ ...current, profile: { ...current.profile, ...patch } }))

  const save = useCallback(async () => {
    const found = validate(payload)
    if (found.length > 0) {
      // Los errores se muestran en vivo: desaparecen a medida que se corrigen.
      setShowErrors(true)
      setActiveTab(tabForPath(found[0].path))
      setStatus({ kind: 'idle' })
      return
    }

    setStatus({ kind: 'saving' })
    try {
      const result = await saveCv(payload)
      if (result.ok) {
        setSavedJson(JSON.stringify(payload))
        setShowErrors(false)
        setStatus({ kind: 'saved', message: result.message })
      } else {
        if (result.issues?.length) setShowErrors(true)
        setStatus({ kind: 'error', message: result.message })
      }
    } catch {
      setStatus({ kind: 'error', message: 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.' })
    }
  }, [payload])

  const discard = () => {
    setDraft(toEditorDraft(JSON.parse(savedJson) as CvDraft))
    setShowErrors(false)
    setStatus({ kind: 'idle' })
  }

  // Aviso del navegador si se intenta salir con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Atajo de teclado: Ctrl + S (o ⌘ + S) guarda.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (dirty && !saving) void save()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dirty, saving, save])

  const notice = (
    <EditorStatus
      status={status}
      dirty={dirty}
      issues={issues}
      onGoToIssue={(issue) => setActiveTab(tabForPath(issue.path))}
    />
  )

  return (
    <EditorTemplate
      heading={
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight">Editor de hoja de vida</p>
          <p className="truncate text-xs text-cv-muted">Sesión: {userEmail}</p>
        </div>
      }
      actions={
        <>
          <SignOutButton
            compact
            confirmMessage={dirty ? 'Tienes cambios sin guardar. ¿Quieres cerrar sesión de todos modos?' : undefined}
          />
          <Button
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
            icon="external-link"
            compactOnMobile
            aria-label="Ver sitio (se abre en otra pestaña)"
          >
            Ver sitio
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="undo"
            iconPosition="left"
            compactOnMobile
            aria-label="Descartar cambios"
            onClick={discard}
            disabled={!dirty || saving}
          >
            Descartar
          </Button>
          <Button size="sm" icon={saving ? 'loader' : 'save'} iconPosition="left" onClick={() => void save()} disabled={!dirty || saving}>
            {saving ? (
              'Guardando…'
            ) : (
              <>
                <span className="sm:hidden">Guardar</span>
                <span className="hidden sm:inline">Guardar cambios</span>
              </>
            )}
          </Button>
        </>
      }
      tabs={TABS.map((tab) => ({ ...tab, errorCount: errorsByTab.get(tab.id) }))}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as TabId)}
      notice={notice}
    >
      {activeTab === 'perfil' && <ProfileForm profile={draft.profile} onChange={updateProfile} errors={fieldErrors} />}
      {activeTab === 'contacto' && <ContactForm profile={draft.profile} onChange={updateProfile} errors={fieldErrors} />}
      {activeTab === 'habilidades' && <SkillsForm profile={draft.profile} onChange={updateProfile} errors={fieldErrors} />}
      {activeTab === 'conocimientos' && (
        <KnowledgeForm
          items={draft.knowledge}
          onChange={(knowledge) => setDraft((current) => ({ ...current, knowledge }))}
          errors={fieldErrors}
        />
      )}
      {activeTab === 'educacion' && (
        <EducationForm
          items={draft.education}
          onChange={(education) => setDraft((current) => ({ ...current, education }))}
          errors={fieldErrors}
        />
      )}
      {activeTab === 'proyectos' && (
        <ProjectsForm
          items={draft.projects}
          onChange={(projects) => setDraft((current) => ({ ...current, projects }))}
          errors={fieldErrors}
        />
      )}
    </EditorTemplate>
  )
}

interface EditorStatusProps {
  status: SaveStatus
  dirty: boolean
  issues: CvIssue[]
  onGoToIssue: (issue: CvIssue) => void
}

const MAX_VISIBLE_ISSUES = 8

/** Franja de estado: cambios pendientes, guardado correcto o errores por corregir. */
function EditorStatus({ status, dirty, issues, onGoToIssue }: EditorStatusProps) {
  if (status.kind === 'saving') {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-cv-canvas px-4 py-3 text-sm text-cv-ink" role="status">
        <Icon name="loader" size={16} className="animate-spin" /> Guardando cambios…
      </p>
    )
  }

  // Errores de validación (en vivo): se listan con enlace a la pestaña de cada uno.
  if (issues.length > 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
        <p className="flex items-center gap-2 font-semibold">
          <Icon name="alert" size={16} /> Hay campos por corregir antes de guardar.
        </p>
        <ul className="mt-2 space-y-1">
          {issues.slice(0, MAX_VISIBLE_ISSUES).map((issue) => (
            <li key={`${issue.path.join('.')}-${issue.message}`}>
              <button type="button" onClick={() => onGoToIssue(issue)} className="text-left underline-offset-2 hover:underline">
                {issue.message}
              </button>
            </li>
          ))}
          {issues.length > MAX_VISIBLE_ISSUES && <li>…y {issues.length - MAX_VISIBLE_ISSUES} más.</li>}
        </ul>
      </div>
    )
  }

  // Error del servidor (permisos, sesión vencida, conexión).
  if (status.kind === 'error') {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
        <Icon name="alert" size={16} /> {status.message}
      </p>
    )
  }

  if (dirty) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-cv-accent-soft px-4 py-3 text-sm text-cv-ink" role="status">
        <Icon name="edit" size={16} /> Tienes cambios sin guardar. Usa «Guardar cambios» o Ctrl + S.
      </p>
    )
  }

  if (status.kind === 'saved') {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-[#EAF5E1] px-4 py-3 text-sm text-cv-success-text" role="status">
        <Icon name="check-circle" size={16} /> {status.message}
      </p>
    )
  }

  return (
    <p className="rounded-lg bg-cv-canvas px-4 py-3 text-sm text-cv-muted">
      Edita cualquier sección y guarda: el sitio público se actualiza al instante.
    </p>
  )
}
