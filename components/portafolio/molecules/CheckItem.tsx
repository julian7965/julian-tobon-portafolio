import type { ReactNode } from 'react'
import { Icon } from '../atoms'

/** Molécula: ícono de verificación + texto. Se usa en Habilidades extra y en los logros de cada proyecto. */
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[15px] leading-snug text-cv-muted">
      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-cv-accent" />
      <span>{children}</span>
    </li>
  )
}
