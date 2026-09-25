import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'

type CardElement = 'div' | 'article' | 'section' | 'footer' | 'li'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement
  /** Agrega el efecto de elevación al pasar el mouse. */
  interactive?: boolean
  children: ReactNode
}

/**
 * Átomo de superficie blanca: base visual de las tarjetas del diseño de Figma
 * (perfil, conocimientos, educación, proyectos y footer).
 */
export function Card({ as: Element = 'div', interactive = false, className, children, ...rest }: CardProps) {
  return (
    <Element
      className={cn(
        'rounded-lg bg-white shadow-cv-card',
        interactive && 'transition duration-300 hover:-translate-y-1 hover:shadow-cv-lift motion-reduce:transform-none',
        className,
      )}
      {...rest}
    >
      {children}
    </Element>
  )
}
