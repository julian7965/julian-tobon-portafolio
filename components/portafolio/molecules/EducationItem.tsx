import type { EducationEntry } from '@/lib/portafolio/types'
import { Badge } from '../atoms'

/**
 * Molécula: fila de educación con dos columnas, igual que en Figma:
 * institución, estado y fechas a la izquierda; título y descripción a la derecha.
 */
export function EducationItem({ entry }: { entry: EducationEntry }) {
  return (
    <li className="grid gap-3 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
      <div>
        <h3 className="text-lg font-semibold text-cv-ink">{entry.institution}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-cv-muted">
          <span>{entry.status}</span>
          <Badge tone="accent">{entry.period}</Badge>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-cv-ink">{entry.degree}</h4>
        <p className="mt-2 text-[15px] leading-relaxed text-cv-muted">{entry.description}</p>
      </div>
    </li>
  )
}
