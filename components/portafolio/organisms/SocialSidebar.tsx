'use client'

import type { MouseEvent } from 'react'
import type { SocialLink } from '@/lib/portafolio/types'
import { SECTIONS } from '@/lib/portafolio/sections'
import { IconButton } from '../atoms'
import { EditShortcut, SocialLinks } from '../molecules'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTION_IDS = SECTIONS.map((section) => section.id)

/**
 * Organismo: menú derecho fijo. Arriba, el botón «Editar» que lleva al editor del CV;
 * luego las redes sociales (requisito del proyecto) y, al final, accesos rápidos a
 * cada sección con la sección actual resaltada (scroll spy).
 */
export function SocialSidebar({ socials }: { socials: SocialLink[] }) {
  const activeId = useActiveSection(SECTION_IDS)

  // Desplazamiento suave hacia la sección, manteniendo el #hash en la URL.
  const goToSection = (event: MouseEvent<HTMLElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    // En pantallas bajas el espaciado se reduce para que todo el menú quepa sin scroll.
    <div className="flex min-h-full flex-col items-center gap-5 py-6 [@media(min-height:760px)]:gap-8 [@media(min-height:760px)]:py-12">
      {/* En móvil y tablet el botón «Editar» está en la barra superior. */}
      <EditShortcut className="hidden lg:flex" />
      <span aria-hidden="true" className="hidden h-px w-8 bg-cv-line lg:block" />

      <div className="flex flex-col items-center gap-5">
        <p className="text-sm font-semibold text-cv-ink">Redes</p>
        <SocialLinks links={socials} tooltip="left" />
      </div>

      <span aria-hidden="true" className="h-px w-8 bg-cv-line" />

      <nav aria-label="Secciones de la página">
        <ul className="flex flex-col items-center gap-3">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <IconButton
                href={`#${section.id}`}
                icon={section.icon}
                label={section.label}
                variant="ghost"
                tooltip="left"
                active={activeId === section.id}
                onClick={(event) => goToSection(event, section.id)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
