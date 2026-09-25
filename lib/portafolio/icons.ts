/**
 * Lista única de nombres de íconos válidos.
 *
 * Se usa en dos lugares:
 *  - `atoms/Icon.tsx` los traduce a componentes SVG (lucide-react y SVG propios).
 *  - `cv-repository.ts` valida la columna `icono` que llega desde Supabase.
 */

/** Íconos pensados para contenido (válidos en la columna `icono` de cv_conocimientos). */
export const CONTENT_ICON_NAMES = [
  'bank',
  'briefcase',
  'chart',
  'check',
  'cloud',
  'code',
  'cpu',
  'database',
  'github',
  'globe',
  'graduation',
  'layers',
  'linkedin',
  'mail',
  'map-pin',
  'phone',
  'pipeline',
  'server',
  'shield',
  'sparkles',
  'terminal',
  'user',
  'workflow',
] as const

/** Íconos de interfaz (flechas, cerrar, menú...). */
export const UI_ICON_NAMES = [
  'alert',
  'arrow-right',
  'arrow-up',
  'check-circle',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'copy',
  'edit',
  'external-link',
  'eye',
  'eye-off',
  'image',
  'loader',
  'lock',
  'logout',
  'menu',
  'plus',
  'save',
  'send',
  'share',
  'trash',
  'undo',
  'upload',
] as const

export const ICON_NAMES = [...CONTENT_ICON_NAMES, ...UI_ICON_NAMES] as const

export type IconName = (typeof ICON_NAMES)[number]

/** Verifica si un texto (por ejemplo, una columna de la BD) es un ícono conocido. */
export function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (ICON_NAMES as readonly string[]).includes(value)
}

/** Nombres en español para elegir íconos en el editor. */
export const CONTENT_ICON_LABELS: Record<(typeof CONTENT_ICON_NAMES)[number], string> = {
  bank: 'Banco',
  briefcase: 'Maletín',
  chart: 'Gráfica',
  check: 'Verificación',
  cloud: 'Nube',
  code: 'Código',
  cpu: 'Procesador',
  database: 'Base de datos',
  github: 'GitHub',
  globe: 'Web',
  graduation: 'Graduación',
  layers: 'Capas',
  linkedin: 'LinkedIn',
  mail: 'Correo',
  'map-pin': 'Ubicación',
  phone: 'Teléfono',
  pipeline: 'Flujo de datos',
  server: 'Servidor',
  shield: 'Escudo',
  sparkles: 'Destellos',
  terminal: 'Terminal',
  user: 'Persona',
  workflow: 'Flujo de trabajo',
}
