/**
 * Convierte un título en un identificador para URLs: "Migración FLEXCUBE → SAP" → "migracion-flexcube-sap".
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Devuelve un slug que no esté en `taken`, agregando -2, -3... si hace falta. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base) || 'proyecto'
  let candidate = root
  let counter = 2
  while (taken.has(candidate)) {
    candidate = `${root}-${counter}`
    counter += 1
  }
  return candidate
}
