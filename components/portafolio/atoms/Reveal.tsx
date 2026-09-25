'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  /** Retraso en milisegundos, útil para animar tarjetas en cascada. */
  delay?: number
  className?: string
}

/**
 * Átomo de animación: el contenido aparece deslizándose hacia arriba cuando
 * entra en pantalla. Respeta "reducir movimiento" del sistema operativo.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -8% 0px', threshold: 0.1 })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
