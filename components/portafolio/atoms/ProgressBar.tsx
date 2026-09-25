'use client'

import { cn } from '@/lib/portafolio/cn'
import { useInView } from '../hooks/useInView'

interface ProgressBarProps {
  /** Porcentaje entre 0 y 100. */
  value: number
  /** Nombre accesible, por ejemplo "Dominio de Python". */
  label: string
  /** Si es true, la barra se llena al aparecer en pantalla; si es false, refleja el valor al instante. */
  animateOnView?: boolean
  className?: string
}

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)))

/**
 * Átomo de barra de progreso. Reutilizado en idiomas, lenguajes de programación
 * y como indicador de posición del carrusel del portafolio.
 */
export function ProgressBar({ value, label, animateOnView = true, className }: ProgressBarProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.5 })
  const percent = clampPercent(value)
  const visibleWidth = animateOnView && !inView ? 0 : percent

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('h-1 w-full overflow-hidden rounded-full bg-cv-accent-soft', className)}
    >
      <div
        className={cn(
          'h-full rounded-full bg-cv-accent motion-reduce:transition-none',
          animateOnView ? 'transition-[width] duration-1000 ease-out' : 'transition-[width] duration-150',
        )}
        style={{ width: `${visibleWidth}%` }}
      />
    </div>
  )
}
