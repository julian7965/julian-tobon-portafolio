import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/** Bloque del editor con título y descripción, sobre fondo blanco. */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-cv-line bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-cv-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-cv-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}
