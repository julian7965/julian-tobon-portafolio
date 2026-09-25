import { cn } from '@/lib/portafolio/cn'
import { Icon } from '../atoms'

/** Ruta del editor de la hoja de vida (protegida por inicio de sesión). */
export const EDITOR_PATH = '/portafolio/editar'

const FOCUS_CLASSES = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-2'

interface EditShortcutProps {
  /**
   * - `stacked`: círculo con el lápiz y la palabra «Editar» debajo (menú derecho en escritorio).
   * - `pill`: botón compacto con lápiz y texto (barra superior en móvil).
   */
  look?: 'stacked' | 'pill'
  className?: string
}

/**
 * Molécula: acceso visible al editor del portafolio (/portafolio/editar).
 *
 * Lo ve cualquier visitante, pero editar sigue protegido: el editor pide iniciar
 * sesión y solo los correos autorizados pueden guardar (lo validan el servidor y Supabase).
 * Es un enlace normal y no un <Link> de Next.js para no precargar una ruta
 * privada en cada visita al portafolio.
 */
export function EditShortcut({ look = 'stacked', className }: EditShortcutProps) {
  if (look === 'pill') {
    return (
      <a
        href={EDITOR_PATH}
        rel="nofollow"
        aria-label="Editar portafolio"
        className={cn(
          'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-cv-accent px-3 text-sm font-semibold text-cv-ink shadow-sm transition hover:shadow-md',
          FOCUS_CLASSES,
          className,
        )}
      >
        <Icon name="edit" size={16} />
        {/* En pantallas muy angostas queda solo el lápiz para no cortar el nombre. */}
        <span className="hidden min-[390px]:inline">Editar</span>
      </a>
    )
  }

  return (
    <a
      href={EDITOR_PATH}
      rel="nofollow"
      className={cn('group flex flex-col items-center gap-1.5 rounded-lg p-1', FOCUS_CLASSES, className)}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cv-accent text-cv-ink shadow-sm transition duration-200 group-hover:shadow-md motion-safe:group-hover:scale-110">
        <Icon name="edit" size={18} />
      </span>
      <span className="text-xs font-semibold text-cv-ink">
        Editar<span className="sr-only"> portafolio</span>
      </span>
    </a>
  )
}
