/**
 * Validaciones de enlaces e imágenes.
 *
 * El contenido se puede editar desde la app y desde Supabase, así que antes de
 * pintar un enlace se verifica que no sea peligroso (por ejemplo `javascript:`).
 */

/** Enlaces permitidos: web, correo, teléfono, rutas internas ("/portafolio/cv.pdf") y anclas ("#perfil"). */
export function isSafeHref(value: string | null | undefined): value is string {
  if (!value) return false
  const href = value.trim()
  if (href.startsWith('/')) return !href.startsWith('//')
  if (href.startsWith('#')) return true
  return /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d][\d\s()-]*)$/i.test(href)
}

/** Imágenes permitidas: archivos de /public ("/portafolio/...") o URLs https (Supabase Storage). */
export function isSafeImageSrc(value: string | null | undefined): value is string {
  if (!value) return false
  const src = value.trim()
  if (src.startsWith('/')) return !src.startsWith('//')
  return /^https:\/\/[^\s]+$/i.test(src)
}
