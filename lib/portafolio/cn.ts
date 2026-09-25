/**
 * Une clases de Tailwind ignorando valores vacíos o falsos.
 * Ejemplo: cn('p-4', isActive && 'bg-cv-accent') → 'p-4 bg-cv-accent'
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
