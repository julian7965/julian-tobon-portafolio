import type { ReactNode } from 'react'

interface SidebarBlockProps {
  title?: string
  children: ReactNode
}

/** Molécula: bloque del menú izquierdo con título opcional y separador inferior. */
export function SidebarBlock({ title, children }: SidebarBlockProps) {
  return (
    <section className="border-b border-cv-line py-6 last:border-b-0">
      {title && <h3 className="mb-4 text-base font-semibold text-cv-ink">{title}</h3>}
      {children}
    </section>
  )
}
