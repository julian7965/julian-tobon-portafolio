'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cvDraftSchema, describeIssues, type CvIssue } from '@/lib/portafolio/cv-schema'
import { draftToRpcParams } from '@/lib/portafolio/cv-mappers'

export interface SaveCvResult {
  ok: boolean
  message: string
  /** Errores de validación con la ubicación de cada campo. */
  issues?: CvIssue[]
}

/**
 * Acción del servidor que guarda el CV completo.
 *
 * 1. Valida de nuevo todo con zod (no se confía en lo que envía el navegador).
 * 2. Llama a la función SQL cv_guardar() con la sesión del usuario: la base de
 *    datos verifica que el correo esté autorizado y guarda todo en una sola transacción.
 * 3. Regenera la página pública "/" para que los cambios se vean de inmediato.
 */
export async function saveCv(input: unknown): Promise<SaveCvResult> {
  const parsed = cvDraftSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Hay campos por corregir antes de guardar.', issues: describeIssues(parsed.error) }
  }

  const supabase = createServerActionClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, message: 'Tu sesión expiró. Inicia sesión de nuevo para guardar.' }
  }

  const { error } = await supabase.rpc('cv_guardar', draftToRpcParams(parsed.data))
  if (error) {
    if (error.code === '42501') {
      return { ok: false, message: 'Tu usuario no tiene permiso para editar el portafolio.' }
    }
    if (error.code === '23505') {
      return { ok: false, message: 'Hay dos proyectos con el mismo identificador. Cambia uno de ellos.' }
    }
    console.error('[portafolio] Error al guardar el CV:', error)
    return { ok: false, message: `No se pudo guardar: ${error.message}` }
  }

  revalidatePath('/')
  return { ok: true, message: 'Cambios guardados. El sitio público ya muestra la nueva versión.' }
}
