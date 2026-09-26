import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { checkEditorAccess, getCvDraftForEditor } from '@/lib/portafolio/cv-repository'
import { isSupabaseConfigured } from '@/lib/supabase'
import { CvEditor } from './CvEditor'
import { EditorNotice } from './EditorNotice'

// Depende de la sesión del usuario: nunca se genera de forma estática.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Editor de hoja de vida',
  robots: { index: false, follow: false },
}

/**
 * /portafolio/editar — Editor de todo el CV.
 *
 * 1. El middleware ya exige sesión; aquí se confirma el usuario con Supabase Auth.
 * 2. cv_puede_editar() (SQL) decide si su correo está autorizado (tabla cv_editores).
 * 3. Se carga el borrador completo (incluidas las filas ocultas) y se entrega al editor.
 */
export default async function EditCvPage() {
  if (!isSupabaseConfigured) {
    return <EditorNotice kind="env" showSignOut={false} />
  }

  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const access = await checkEditorAccess(supabase)
  if (access.status === 'forbidden') return <EditorNotice kind="forbidden" email={user.email} />
  if (access.status === 'setup-required') return <EditorNotice kind="setup" detail={access.detail} />

  const result = await getCvDraftForEditor(supabase)
  if (result.status === 'setup-required') return <EditorNotice kind="setup" detail={result.detail} />

  return <CvEditor initialDraft={result.draft} userEmail={user.email ?? ''} />
}
