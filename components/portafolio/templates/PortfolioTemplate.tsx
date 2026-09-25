'use client'

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'
import { IconButton, ScrollProgress } from '../atoms'
import { MobileTopBar } from '../organisms/MobileTopBar'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

type MobilePanel = 'profile' | 'links' | null

interface PortfolioTemplateProps {
  displayName: string
  photo: string
  /** Contenido del menú izquierdo (ProfileSidebar). */
  profileSidebar: ReactNode
  /** Contenido del menú derecho (SocialSidebar). */
  socialSidebar: ReactNode
  footer: ReactNode
  /** Secciones del contenido central. */
  children: ReactNode
}

/**
 * Plantilla del portafolio (nivel "template" de atomic design).
 *
 * Distribución:
 *  - Escritorio (≥1024 px): menú izquierdo y menú derecho FIJOS; el contenido
 *    central tiene scroll vertical entre ambos.
 *  - Móvil/tablet: los menús se convierten en paneles laterales que se abren
 *    desde la barra superior (MobileTopBar).
 */
export function PortfolioTemplate({ displayName, photo, profileSidebar, socialSidebar, footer, children }: PortfolioTemplateProps) {
  const [openPanel, setOpenPanel] = useState<MobilePanel>(null)
  const profileCloseRef = useRef<HTMLDivElement>(null)
  const linksCloseRef = useRef<HTMLDivElement>(null)
  const closePanel = useCallback(() => setOpenPanel(null), [])

  useBodyScrollLock(openPanel !== null)

  // Escape cierra el panel abierto.
  useEffect(() => {
    if (!openPanel) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openPanel, closePanel])

  // Al abrir un panel, el foco pasa a su botón de cerrar (accesibilidad con teclado).
  useEffect(() => {
    const container = openPanel === 'profile' ? profileCloseRef.current : openPanel === 'links' ? linksCloseRef.current : null
    container?.querySelector('button')?.focus()
  }, [openPanel])

  // Si la pantalla crece a tamaño escritorio, los paneles móviles se cierran.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = () => desktop.matches && closePanel()
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [closePanel])

  // Tocar cualquier enlace dentro de un panel móvil lo cierra.
  const closeOnLinkClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a')) closePanel()
  }

  return (
    <div className="min-h-screen bg-cv-canvas text-cv-ink">
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-md bg-cv-ink px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>

      <ScrollProgress />

      <MobileTopBar
        displayName={displayName}
        photo={photo}
        profileOpen={openPanel === 'profile'}
        linksOpen={openPanel === 'links'}
        onOpenProfile={() => setOpenPanel('profile')}
        onOpenLinks={() => setOpenPanel('links')}
      />

      {/* Fondo oscuro detrás de los paneles móviles */}
      <div
        aria-hidden="true"
        onClick={closePanel}
        className={cn(
          'fixed inset-0 z-40 bg-cv-ink/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          openPanel ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Menú izquierdo: fijo en escritorio, panel deslizable en móvil */}
      <aside
        id="menu-perfil"
        aria-label="Información personal"
        onClick={closeOnLinkClick}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] overflow-y-auto overscroll-contain bg-white shadow-2xl',
          'transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none',
          'lg:visible lg:z-20 lg:w-[280px] lg:translate-x-0 lg:shadow-none xl:w-[300px]',
          openPanel === 'profile' ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div ref={profileCloseRef} className="absolute right-3 top-3 lg:hidden">
          <IconButton icon="close" label="Cerrar información personal" variant="soft" size="sm" onClick={closePanel} />
        </div>
        {profileSidebar}
      </aside>

      {/* Menú derecho: fijo en escritorio, panel deslizable en móvil */}
      <aside
        id="menu-redes"
        aria-label="Redes sociales y secciones"
        onClick={closeOnLinkClick}
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-24 overflow-y-auto overscroll-contain bg-white shadow-2xl lg:overflow-visible',
          'transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none',
          'lg:visible lg:z-20 lg:translate-x-0 lg:shadow-none',
          openPanel === 'links' ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        <div ref={linksCloseRef} className="flex justify-center pt-4 lg:hidden">
          <IconButton icon="close" label="Cerrar redes sociales" variant="soft" size="sm" onClick={closePanel} />
        </div>
        {socialSidebar}
      </aside>

      {/* Contenido central con scroll vertical */}
      <div className="lg:ml-[280px] lg:mr-24 xl:ml-[300px]">
        <main id="contenido" className="mx-auto w-full max-w-[1080px] space-y-20 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          {children}
        </main>
        <div className="mx-auto w-full max-w-[1080px] px-4 pb-6 sm:px-6 lg:px-8">{footer}</div>
      </div>
    </div>
  )
}
