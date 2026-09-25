import type { ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'
import type { IconName } from '@/lib/portafolio/icons'
import { Icon } from '../atoms'

export interface EditorTab {
  id: string
  label: string
  icon: IconName
  /** Cantidad de errores de la pestaña (se muestra como un contador rojo). */
  errorCount?: number
}

interface EditorTemplateProps {
  /** Título y datos de la sesión. */
  heading: ReactNode
  /** Botones de la barra superior (guardar, descartar, ver sitio). */
  actions: ReactNode
  tabs: EditorTab[]
  activeTab: string
  onTabChange: (id: string) => void
  /** Mensajes de estado (guardado, errores). */
  notice?: ReactNode
  children: ReactNode
}

/**
 * Plantilla del editor: barra superior fija con acciones, pestañas a la izquierda
 * (arriba en móvil) y el formulario de la pestaña activa. Fondo blanco y limpio.
 */
export function EditorTemplate({ heading, actions, tabs, activeTab, onTabChange, notice, children }: EditorTemplateProps) {
  return (
    <div className="min-h-screen bg-white text-cv-ink">
      <header className="sticky top-0 z-30 border-b border-cv-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {heading}
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav aria-label="Secciones del editor" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {tabs.map((tab) => {
              const active = tab.id === activeTab
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent',
                      active ? 'bg-cv-accent-soft text-cv-ink' : 'text-cv-muted hover:bg-cv-canvas hover:text-cv-ink',
                    )}
                  >
                    <Icon name={tab.icon} size={18} className={active ? 'text-[#9A6B00]' : undefined} />
                    <span className="flex-1">{tab.label}</span>
                    {tab.errorCount ? (
                      <span className="rounded-full bg-red-600 px-1.5 text-xs font-semibold leading-5 text-white">
                        {tab.errorCount}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <main id="contenido-editor" className="min-w-0 space-y-6">
          {notice}
          {children}
        </main>
      </div>
    </div>
  )
}
