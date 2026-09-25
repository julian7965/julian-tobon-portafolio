import Image from 'next/image'
import type { Project } from '@/lib/portafolio/types'
import { shouldSkipOptimization } from '@/lib/portafolio/images'
import { Button, Card } from '../atoms'
import { TagList } from './TagList'

interface ProjectCardProps {
  project: Project
  /** Abre el diálogo con el detalle del proyecto. */
  onLearnMore: (project: Project) => void
}

/** Molécula: tarjeta de proyecto con imagen, título, resumen y botón "Saber más" (diseño de Figma). */
export function ProjectCard({ project, onLearnMore }: ProjectCardProps) {
  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-cv-canvas">
        <Image
          src={project.image}
          alt={`Vista previa del proyecto ${project.title}`}
          fill
          sizes="(max-width: 640px) 85vw, 320px"
          unoptimized={shouldSkipOptimization(project.image)}
          className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-cv-ink">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-cv-muted">{project.summary}</p>
        <TagList tags={project.technologies} max={3} className="mt-4" />
        <div className="mt-auto pt-5">
          <Button
            variant="link"
            icon="arrow-right"
            onClick={() => onLearnMore(project)}
            aria-haspopup="dialog"
            aria-label={`Saber más sobre ${project.title}`}
          >
            Saber más
          </Button>
        </div>
      </div>
    </Card>
  )
}
