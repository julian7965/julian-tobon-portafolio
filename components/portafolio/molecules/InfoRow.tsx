import type { ContactItem } from '@/lib/portafolio/types'
import { Icon } from '../atoms'

/** Molécula: dato de contacto con ícono, etiqueta y valor (enlazado si aplica). */
export function InfoRow({ item }: { item: ContactItem }) {
  const value = item.href ? (
    <a
      href={item.href}
      className="break-all text-cv-muted underline-offset-4 transition hover:text-cv-ink hover:underline"
    >
      {item.value}
    </a>
  ) : (
    <span className="text-cv-muted">{item.value}</span>
  )

  return (
    <li className="flex items-start gap-3 text-[15px]">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cv-accent-soft text-cv-ink">
        <Icon name={item.icon} size={15} />
      </span>
      <span className="min-w-0 leading-snug">
        <span className="block text-xs font-medium uppercase tracking-wide text-cv-ink">{item.label}</span>
        {value}
      </span>
    </li>
  )
}
