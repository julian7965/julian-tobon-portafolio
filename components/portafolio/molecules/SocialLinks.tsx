import type { SocialLink } from '@/lib/portafolio/types'
import { cn } from '@/lib/portafolio/cn'
import { IconButton } from '../atoms'

interface SocialLinksProps {
  links: SocialLink[]
  direction?: 'vertical' | 'horizontal'
  /** Posición del tooltip con el nombre de la red. */
  tooltip?: 'left' | 'top' | 'none'
  className?: string
}

/**
 * Molécula: lista de íconos de redes sociales. Se reutiliza en el menú derecho
 * (vertical) y en el diálogo del perfil (horizontal).
 */
export function SocialLinks({ links, direction = 'vertical', tooltip = 'none', className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-4', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap', className)}>
      {links.map((link) => (
        <li key={link.name}>
          <IconButton
            href={link.url}
            icon={link.icon}
            label={link.name}
            tooltip={tooltip}
            size="sm"
          />
        </li>
      ))}
    </ul>
  )
}
