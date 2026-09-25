import type { ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'

type BadgeTone = 'accent' | 'neutral' | 'success'

const TONE_CLASSES: Record<BadgeTone, string> = {
  accent: 'bg-cv-accent text-cv-ink',
  neutral: 'bg-cv-canvas text-cv-ink',
  success: 'bg-[#EAF5E1] text-cv-success-text',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

/**
 * Átomo de etiqueta pequeña. Se usa para fechas de educación, tecnologías de
 * los proyectos, disponibilidad y la empresa actual en la trayectoria.
 */
export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium leading-5',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
