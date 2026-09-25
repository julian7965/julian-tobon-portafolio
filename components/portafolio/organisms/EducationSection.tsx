import type { EducationEntry } from '@/lib/portafolio/types'
import { Card, Reveal } from '../atoms'
import { EducationItem, SectionHeader } from '../molecules'

/** Organismo: sección "Educación" en una tarjeta con filas separadas (diseño de Figma). */
export function EducationSection({ entries }: { entries: EducationEntry[] }) {
  return (
    <section id="educacion" aria-labelledby="educacion-titulo" className="scroll-mt-24">
      <SectionHeader
        id="educacion-titulo"
        title="Educación"
        description="Mi formación académica y complementaria, la base de lo que aplico en cada proyecto."
      />
      <Reveal>
        <Card className="px-6 py-8 sm:px-10 sm:py-10">
          <ul className="divide-y divide-cv-line">
            {entries.map((entry) => (
              <EducationItem key={entry.id} entry={entry} />
            ))}
          </ul>
        </Card>
      </Reveal>
    </section>
  )
}
