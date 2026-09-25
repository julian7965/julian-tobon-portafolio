'use client'

import { cn } from '@/lib/portafolio/cn'
import { Button, IconButton } from '../atoms'

interface StringListEditorProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  addLabel: string
  placeholder?: string
  hint?: string
  error?: string
  max?: number
  /** Usa áreas de texto (para párrafos) en lugar de campos de una línea. */
  multiline?: boolean
  /** Error de un elemento concreto (por ejemplo, un texto vacío). */
  itemError?: (index: number) => string | undefined
}

/**
 * Molécula para listas de textos (roles, párrafos, habilidades, empresas,
 * tecnologías, logros): agregar, quitar y reordenar.
 */
export function StringListEditor({
  label,
  items,
  onChange,
  addLabel,
  placeholder,
  hint,
  error,
  max,
  multiline = false,
  itemError,
}: StringListEditorProps) {
  const update = (index: number, value: string) => onChange(items.map((item, current) => (current === index ? value : item)))
  const remove = (index: number) => onChange(items.filter((_, current) => current !== index))
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const controlClasses =
    'w-full rounded-md border border-cv-line bg-white px-3 py-2 text-[15px] text-cv-ink placeholder:text-cv-muted/70 transition focus:border-cv-accent focus:outline-none focus:ring-2 focus:ring-cv-accent/40'

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-cv-ink">{label}</legend>
      {hint && <p className="-mt-1 mb-2 text-xs text-cv-muted">{hint}</p>}

      <ol className="space-y-2">
        {items.map((item, index) => {
          const rowError = itemError?.(index)
          return (
          <li key={index} className="flex items-start gap-1.5">
            <span className="mt-2.5 w-5 shrink-0 text-right text-xs tabular-nums text-cv-muted">{index + 1}.</span>
            <div className="min-w-0 flex-1">
              {multiline ? (
                <textarea
                  rows={3}
                  value={item}
                  placeholder={placeholder}
                  aria-label={`${label} ${index + 1}`}
                  aria-invalid={rowError ? true : undefined}
                  onChange={(event) => update(index, event.target.value)}
                  className={cn(controlClasses, 'resize-y leading-relaxed', rowError && 'border-red-400')}
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  placeholder={placeholder}
                  aria-label={`${label} ${index + 1}`}
                  aria-invalid={rowError ? true : undefined}
                  onChange={(event) => update(index, event.target.value)}
                  className={cn(controlClasses, rowError && 'border-red-400')}
                />
              )}
              {rowError && <p className="mt-1 text-xs font-medium text-red-700">{rowError}</p>}
            </div>
            <span className="flex shrink-0 items-center">
              <IconButton
                icon="chevron-up"
                label={`Subir ${label.toLowerCase()} ${index + 1}`}
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              />
              <IconButton
                icon="chevron-down"
                label={`Bajar ${label.toLowerCase()} ${index + 1}`}
                variant="ghost"
                size="sm"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              />
              <IconButton
                icon="trash"
                label={`Quitar ${label.toLowerCase()} ${index + 1}`}
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              />
            </span>
          </li>
          )
        })}
      </ol>

      <Button
        variant="outline"
        size="sm"
        icon="plus"
        iconPosition="left"
        onClick={() => onChange([...items, ''])}
        disabled={max !== undefined && items.length >= max}
        className="mt-2"
      >
        {addLabel}
      </Button>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
