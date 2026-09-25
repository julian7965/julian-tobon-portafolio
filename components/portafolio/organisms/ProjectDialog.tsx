'use client'

import Image from 'next/image'
import type { Project } from '@/lib/portafolio/types'
import { shouldSkipOptimization } from '@/lib/portafolio/images'
import { Button, Icon, IconButton } from '../atoms'
import { CheckItem, Modal, TagList } from '../molecules'

interface ProjectDialogProps {
  project: Project | null
  /** Posición del proyecto (1..total) para el texto "2 de 6". */
  position: number
  total: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

/**
 * Organismo: diálogo "Saber más" con la información detallada de un proyecto,
 * sus logros, tecnologías y enlaces. Permite pasar al proyecto anterior o siguiente.
 */
export function ProjectDialog({ project, position, total, onClose, onPrevious, onNext }: ProjectDialogProps) {
  return (
    <Modal open={project !== null} onClose={onClose} titleId="dialogo-proyecto-titulo" size="lg" contentKey={project?.id}>
      {project && (
        <>
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-cv-canvas">
            <Image
              src={project.image}
              alt={`Vista previa del proyecto ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={shouldSkipOptimization(project.image)}
              className="object-cover"
            />
          </div>

          <div className="space-y-7 px-6 py-8 sm:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cv-muted">
                Proyecto {position} de {total}
              </p>
              <h2 id="dialogo-proyecto-titulo" className="mt-1 text-2xl font-bold text-cv-ink sm:text-3xl">
                {project.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-cv-muted">{project.description}</p>
            </div>

            <TagList tags={project.technologies} />

            {project.highlights.length > 0 && (
              <section aria-labelledby="dialogo-proyecto-logros">
                <h3 id="dialogo-proyecto-logros" className="text-sm font-semibold uppercase tracking-widest text-cv-ink">
                  Logros principales
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {project.highlights.map((highlight) => (
                    <CheckItem key={highlight}>{highlight}</CheckItem>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex flex-col gap-4 border-t border-cv-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {project.repoUrl && (
                  <Button href={project.repoUrl} icon="github" iconPosition="left">
                    Ver código
                  </Button>
                )}
                {project.demoUrl && (
                  <Button href={project.demoUrl} variant="outline" icon="external-link">
                    Ver demo
                  </Button>
                )}
                {project.privateNote && (
                  <p className="flex items-center gap-2 text-sm text-cv-muted">
                    <Icon name="lock" size={16} />
                    {project.privateNote}
                  </p>
                )}
              </div>

              {total > 1 && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <IconButton icon="chevron-left" label="Proyecto anterior" variant="soft" onClick={onPrevious} />
                  <IconButton icon="chevron-right" label="Proyecto siguiente" variant="soft" onClick={onNext} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
