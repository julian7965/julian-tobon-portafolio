'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/portafolio/types'
import { cn } from '@/lib/portafolio/cn'
import { IconButton, Reveal } from '../atoms'
import { ProjectCard, SectionHeader } from '../molecules'
import { ProjectDialog } from './ProjectDialog'

/** Separación entre tarjetas en píxeles (coincide con la clase gap-6). */
const CARD_GAP_PX = 24

/**
 * Organismo: sección "Portafolio" con scroll horizontal (carrusel con flechas y
 * scroll-snap) y el diálogo "Saber más" de cada proyecto.
 */
export function PortfolioSection({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  // Detecta si el carrusel está al inicio o al final para habilitar/deshabilitar las flechas.
  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const maxScroll = track.scrollWidth - track.clientWidth
    setEdges({ atStart: track.scrollLeft <= 4, atEnd: track.scrollLeft >= maxScroll - 4 })
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  // Avanza o retrocede exactamente una tarjeta.
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector('li')
    const step = firstCard ? firstCard.getBoundingClientRect().width + CARD_GAP_PX : track.clientWidth * 0.8
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  // Navegación circular entre proyectos dentro del diálogo.
  const showSibling = (direction: 1 | -1) =>
    setSelectedIndex((index) => (index === null ? null : (index + direction + projects.length) % projects.length))

  return (
    <section id="portafolio" aria-labelledby="portafolio-titulo" className="scroll-mt-24">
      <SectionHeader
        id="portafolio-titulo"
        title="Portafolio"
        description="Una selección de proyectos de banca, datos y desarrollo web en los que he participado. Desliza para verlos todos y abre cada uno para conocer el detalle."
      />

      <ul
        ref={trackRef}
        onScroll={updateEdges}
        tabIndex={0}
        aria-label="Proyectos: desplázate horizontalmente para ver más"
        className={cn(
          'flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth rounded-lg pb-5 pt-1',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-4 focus-visible:ring-offset-cv-canvas',
          // Barra de scroll delgada con los colores del portafolio
          '[scrollbar-color:#FFB400_#FFF4D9] [scrollbar-width:thin]',
          '[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cv-accent [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-cv-accent-soft',
          // Desvanecido en el borde derecho mientras haya más tarjetas por ver
          !edges.atEnd && '[mask-image:linear-gradient(to_right,black_92%,transparent)]',
        )}
      >
        {projects.map((project, index) => (
          <li key={project.id} className="w-[82%] shrink-0 snap-start sm:w-[300px]">
            <Reveal delay={Math.min(index, 3) * 110} className="h-full">
              <ProjectCard project={project} onLearnMore={() => setSelectedIndex(index)} />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-cv-muted">
          {projects.length} proyectos · desliza o usa las flechas
        </p>
        <div className="flex gap-2">
          <IconButton
            icon="chevron-left"
            label="Ver proyectos anteriores"
            variant="soft"
            onClick={() => scrollByCard(-1)}
            disabled={edges.atStart}
          />
          <IconButton
            icon="chevron-right"
            label="Ver más proyectos"
            variant="soft"
            onClick={() => scrollByCard(1)}
            disabled={edges.atEnd}
          />
        </div>
      </div>

      <ProjectDialog
        project={selectedIndex === null ? null : projects[selectedIndex]}
        position={(selectedIndex ?? 0) + 1}
        total={projects.length}
        onClose={() => setSelectedIndex(null)}
        onPrevious={() => showSibling(-1)}
        onNext={() => showSibling(1)}
      />
    </section>
  )
}
