'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'
import { Button, IconButton } from '../atoms'

/** Cada elemento del editor lleva una clave interna estable para React (no se guarda). */
export type Keyed<T> = T & { _key: string }

/** Genera claves únicas para los elementos nuevos. */
export function createKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `k-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Agrega la clave interna a una lista que viene de la base de datos. */
export const withKeys = <T,>(items: T[]): Keyed<T>[] => items.map((item) => ({ ...item, _key: createKey() }))

interface ListEditorProps<T> {
  items: Keyed<T>[]
  onChange: (items: Keyed<T>[]) => void
  /** Crea un elemento vacío al pulsar "Agregar". */
  createItem: () => T
  /** Formulario de cada elemento. `update` aplica cambios parciales. */
  renderItem: (item: Keyed<T>, update: (patch: Partial<T>) => void, index: number) => ReactNode
  /** Texto de la cabecera de cada elemento. */
  itemTitle: (item: Keyed<T>, index: number) => string
  /** Etiquetas adicionales en la cabecera (por ejemplo "Oculto"). */
  itemBadge?: (item: Keyed<T>) => ReactNode
  /** Índices con errores de validación (se resaltan). */
  errorIndexes?: Set<number>
  addLabel: string
  emptyText?: string
  max?: number
  /** Si es true, cada elemento se puede contraer para ahorrar espacio. */
  collapsible?: boolean
}

/**
 * Molécula genérica para editar listas: agregar, eliminar (con confirmación),
 * reordenar y, opcionalmente, contraer cada elemento. La reutilizan todas las
 * secciones del editor (contacto, redes, idiomas, conocimientos, educación, proyectos).
 */
export function ListEditor<T>({
  items,
  onChange,
  createItem,
  renderItem,
  itemTitle,
  itemBadge,
  errorIndexes,
  addLabel,
  emptyText = 'Todavía no hay elementos.',
  max,
  collapsible = false,
}: ListEditorProps<T>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [confirmingKey, setConfirmingKey] = useState<string | null>(null)

  const update = (index: number, patch: Partial<T>) =>
    onChange(items.map((item, current) => (current === index ? { ...item, ...patch } : item)))

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const remove = (key: string) => {
    onChange(items.filter((item) => item._key !== key))
    setConfirmingKey(null)
  }

  const add = () => {
    const item = { ...createItem(), _key: createKey() } as Keyed<T>
    onChange([...items, item])
    // Los elementos nuevos se muestran abiertos para empezar a llenarlos.
    setExpanded((current) => new Set(current).add(item._key))
  }

  const toggle = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const limitReached = max !== undefined && items.length >= max

  return (
    <div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-cv-line px-4 py-6 text-center text-sm text-cv-muted">{emptyText}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => {
            const isOpen = !collapsible || expanded.has(item._key)
            const title = itemTitle(item, index) || `Elemento ${index + 1}`
            const hasError = errorIndexes?.has(index)

            return (
              <li
                key={item._key}
                className={cn('rounded-lg border bg-white', hasError ? 'border-red-300 ring-1 ring-red-200' : 'border-cv-line')}
              >
                <div className={cn('flex items-center gap-2 px-3 py-2', isOpen && 'border-b border-cv-line')}>
                  <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-cv-muted">#{index + 1}</span>
                  {collapsible ? (
                    <button
                      type="button"
                      onClick={() => toggle(item._key)}
                      aria-expanded={isOpen}
                      className="min-w-0 flex-1 truncate rounded text-left text-sm font-semibold text-cv-ink hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent"
                    >
                      {title}
                    </button>
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-cv-ink">{title}</span>
                  )}
                  {itemBadge?.(item)}
                  {hasError && <span className="text-xs font-medium text-red-700">Revisar</span>}

                  {confirmingKey === item._key ? (
                    <span className="flex items-center gap-1.5 text-xs" role="group" aria-label="Confirmar eliminación">
                      <span className="text-cv-muted">¿Eliminar?</span>
                      <button
                        type="button"
                        onClick={() => remove(item._key)}
                        className="rounded bg-red-600 px-2 py-1 font-semibold text-white hover:bg-red-700"
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingKey(null)}
                        className="rounded bg-cv-canvas px-2 py-1 font-semibold text-cv-ink hover:bg-cv-line"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-0.5">
                      <IconButton
                        icon="chevron-up"
                        label={`Mover ${title} hacia arriba`}
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      />
                      <IconButton
                        icon="chevron-down"
                        label={`Mover ${title} hacia abajo`}
                        variant="ghost"
                        size="sm"
                        disabled={index === items.length - 1}
                        onClick={() => move(index, 1)}
                      />
                      <IconButton
                        icon="trash"
                        label={`Eliminar ${title}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmingKey(item._key)}
                      />
                    </span>
                  )}
                </div>
                {isOpen && <div className="p-4">{renderItem(item, (patch) => update(index, patch), index)}</div>}
              </li>
            )
          })}
        </ol>
      )}

      <Button
        variant="outline"
        size="sm"
        icon="plus"
        iconPosition="left"
        onClick={add}
        disabled={limitReached}
        className="mt-3"
      >
        {addLabel}
      </Button>
      {limitReached && <p className="mt-1 text-xs text-cv-muted">Llegaste al máximo permitido ({max}).</p>}
    </div>
  )
}
