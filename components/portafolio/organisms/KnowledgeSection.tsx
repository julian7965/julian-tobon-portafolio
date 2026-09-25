import type { Knowledge } from '@/lib/portafolio/types'
import { Reveal } from '../atoms'
import { KnowledgeCard, SectionHeader } from '../molecules'

/** Organismo: sección "Conocimientos" con tarjetas en cuadrícula (diseño de Figma). */
export function KnowledgeSection({ items }: { items: Knowledge[] }) {
  return (
    <section id="conocimientos" aria-labelledby="conocimientos-titulo" className="scroll-mt-24">
      <SectionHeader
        id="conocimientos-titulo"
        title="Conocimientos"
        description="Las áreas en las que trabajo a diario: desde el dato en el core bancario hasta la interfaz web que lo presenta."
      />
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            {/* Retraso escalonado: las tarjetas aparecen en cascada */}
            <Reveal delay={(index % 3) * 110} className="h-full">
              <KnowledgeCard item={item} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
