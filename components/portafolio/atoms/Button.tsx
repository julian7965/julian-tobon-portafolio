import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'
import type { IconName } from '@/lib/portafolio/icons'
import { Icon } from './Icon'

type ButtonVariant = 'primary' | 'outline' | 'link'
type ButtonSize = 'sm' | 'md'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ícono opcional que acompaña al texto. */
  icon?: IconName
  iconPosition?: 'left' | 'right'
  /**
   * En pantallas pequeñas muestra solo el ícono (útil en barras de acciones).
   * Acompáñalo de `aria-label` para que el botón conserve su nombre accesible.
   */
  compactOnMobile?: boolean
  className?: string
  children: ReactNode
}

type NativeButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: never }
type NativeLinkProps = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string }

export type ButtonProps = NativeButtonProps | NativeLinkProps

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-cv-accent text-cv-ink shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
  outline: 'border border-cv-line bg-white text-cv-ink hover:border-cv-accent hover:bg-cv-accent-soft',
  link: 'text-cv-ink hover:text-black',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 text-xs',
  md: 'h-12 text-sm',
}

/** Relleno horizontal: normal, o reducido en móvil cuando el botón muestra solo el ícono. */
const PADDING_CLASSES: Record<ButtonSize, { normal: string; compact: string }> = {
  sm: { normal: 'px-4', compact: 'px-2.5 sm:px-4' },
  md: { normal: 'px-7', compact: 'px-3 sm:px-7' },
}

/** Enlaces que salen del sitio o abren una app externa (correo, teléfono). */
const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/i.test(href)

/**
 * Átomo de botón. Se renderiza como:
 *  - <button> cuando recibe onClick,
 *  - <Link> de Next.js para rutas internas,
 *  - <a> para enlaces externos (se abren en otra pestaña).
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconPosition = 'right', compactOnMobile = false, className, children, ...rest } = props

  const classes = cn(
    'group/button inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variant === 'link'
      ? 'text-sm'
      : cn(SIZE_CLASSES[size], PADDING_CLASSES[size][compactOnMobile ? 'compact' : 'normal'], 'uppercase tracking-wide'),
    VARIANT_CLASSES[variant],
    className,
  )

  const iconElement = icon ? (
    <Icon
      name={icon}
      size={variant === 'link' ? 16 : 18}
      className={cn(
        'transition-transform duration-200',
        iconPosition === 'right' && 'group-hover/button:translate-x-0.5',
        variant === 'link' && 'text-cv-accent',
      )}
    />
  ) : null

  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      <span className={compactOnMobile ? 'hidden sm:inline' : undefined}>{children}</span>
      {iconPosition === 'right' && iconElement}
    </>
  )

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as NativeLinkProps
    if (isExternalHref(href)) {
      const opensNewTab = /^https?:/i.test(href)
      return (
        <a
          href={href}
          className={classes}
          {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = rest as NativeButtonProps
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
