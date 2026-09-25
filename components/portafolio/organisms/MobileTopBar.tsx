'use client'

import { Avatar, IconButton } from '../atoms'
import { EditShortcut } from '../molecules'

interface MobileTopBarProps {
  displayName: string
  photo: string
  profileOpen: boolean
  linksOpen: boolean
  onOpenProfile: () => void
  onOpenLinks: () => void
}

/**
 * Organismo: barra superior que solo aparece en pantallas pequeñas.
 * Sus botones abren el menú izquierdo (perfil) y el derecho (redes) como paneles laterales;
 * el botón «Editar» lleva al editor del CV.
 */
export function MobileTopBar({ displayName, photo, profileOpen, linksOpen, onOpenProfile, onOpenLinks }: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cv-line bg-white/90 px-4 py-2.5 backdrop-blur lg:hidden">
      <IconButton
        icon="menu"
        label="Abrir información personal"
        variant="soft"
        onClick={onOpenProfile}
        aria-expanded={profileOpen}
        aria-controls="menu-perfil"
      />
      <a href="#perfil" className="flex min-w-0 items-center gap-2.5 rounded-full pr-2">
        <Avatar src={photo} alt="" size="sm" />
        <span className="truncate font-semibold text-cv-ink">{displayName}</span>
      </a>
      <div className="flex shrink-0 items-center gap-2">
        <EditShortcut look="pill" />
        <IconButton
          icon="share"
          label="Abrir redes sociales y secciones"
          variant="soft"
          onClick={onOpenLinks}
          aria-expanded={linksOpen}
          aria-controls="menu-redes"
        />
      </div>
    </header>
  )
}
