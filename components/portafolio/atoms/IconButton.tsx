import type { ButtonHTMLAttributes, MouseEventHandler } from 'react'
import { cn } from '@/lib/portafolio/cn'
import type { IconName } from '@/lib/portafolio/icons'
import { Icon } from './Icon'

type IconButtonVariant = 'accent' | 'soft' | 'ghost'
type IconButtonSize = 'sm' | 'md'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  onClick?: MouseEventHandler<HTMLElement>
  icon: IconName
  /** Texto accesible obligatorio: los botones solo con ícono necesitan un nombre. */
  label: string
  /** Si se pasa, se renderiza como enlace. */
  href?: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  /** Muestra el `label` como tooltip al pasar el mouse. */
  tooltip?: 'left' | 'top' | 'none'
  /** Marca visualmente el botón como seleccionado (menú de secciones). */
  active?: boolean
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  accent: 'bg-cv-accent text-cv-ink hover:scale-110 hover:shadow-md',
  soft: 'bg-cv-canvas text-cv-ink hover:bg-cv-accent',
  ghost: 'bg-transparent text-cv-muted hover:bg-cv-canvas hover:text-cv-ink',
}

const SIZE_CLASSES: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: 'h-8 w-8', icon: 16 },
  md: { box: 'h-10 w-10', icon: 18 },
}

const TOOLTIP_CLASSES = {
  left: 'right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0',
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 group-focus-visible:translate-y-0',
}

/**
 * Átomo de botón circular con ícono. Se reutiliza en las redes sociales,
 * el menú de secciones, las flechas del carrusel y el botón de cerrar diálogos.
 */
export function IconButton({
  icon,
  label,
  href,
  variant = 'accent',
  size = 'md',
  tooltip = 'none',
  active = false,
  className,
  type = 'button',
  onClick,
  ...buttonProps
}: IconButtonProps) {
  const classes = cn(
    'group relative inline-flex shrink-0 items-center justify-center rounded-full transition duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    SIZE_CLASSES[size].box,
    active ? 'bg-cv-ink text-white hover:bg-cv-ink' : VARIANT_CLASSES[variant],
    className,
  )

  const inner = (
    <>
      <Icon name={icon} size={SIZE_CLASSES[size].icon} />
      {tooltip !== 'none' && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-cv-ink px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-200',
            'group-hover:opacity-100 group-focus-visible:opacity-100',
            TOOLTIP_CLASSES[tooltip],
          )}
        >
          {label}
        </span>
      )}
    </>
  )

  if (href) {
    const isWeb = /^https?:/i.test(href)
    return (
      <a
        href={href}
        aria-label={label}
        className={classes}
        aria-current={active ? 'location' : undefined}
        onClick={onClick}
        {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type={type} aria-label={label} className={classes} onClick={onClick} {...buttonProps}>
      {inner}
    </button>
  )
}
