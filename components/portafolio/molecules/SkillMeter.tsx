import type { Skill } from '@/lib/portafolio/types'
import { ProgressBar } from '../atoms'

interface SkillMeterProps {
  skill: Skill
  /** Contexto para el nombre accesible, por ejemplo "Dominio del idioma". */
  context: string
}

/** Molécula: nombre + porcentaje + barra. Se reutiliza en Idiomas y Lenguajes de programación. */
export function SkillMeter({ skill, context }: SkillMeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[15px]">
        <span className="text-cv-muted">
          {skill.name}
          {skill.note && <span className="ml-1.5 text-xs text-cv-muted">· {skill.note}</span>}
        </span>
        <span className="text-sm tabular-nums text-cv-muted">{skill.level}%</span>
      </div>
      <ProgressBar value={skill.level} label={`${context}: ${skill.name}`} />
    </div>
  )
}
