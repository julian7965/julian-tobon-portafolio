import { cn } from '@/lib/portafolio/cn'
import { Badge } from '../atoms'

interface TagListProps {
  tags: string[]
  /** Muestra solo las primeras N etiquetas y un contador "+X" con el resto. */
  max?: number
  className?: string
}

/** Molécula: lista de tecnologías como etiquetas. Se usa en las tarjetas y en el diálogo de proyecto. */
export function TagList({ tags, max, className }: TagListProps) {
  const visible = max ? tags.slice(0, max) : tags
  const hidden = tags.length - visible.length

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Tecnologías">
      {visible.map((tag) => (
        <li key={tag}>
          <Badge>{tag}</Badge>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Badge className="text-cv-muted">+{hidden}</Badge>
        </li>
      )}
    </ul>
  )
}
