import type { Knowledge } from '@/lib/portafolio/types'
import { Card, Icon } from '../atoms'

/** Molécula: tarjeta de conocimiento con ícono, título y descripción (diseño de Figma). */
export function KnowledgeCard({ item }: { item: Knowledge }) {
  return (
    <Card
      as="article"
      interactive
      className="group relative flex h-full flex-col items-center overflow-hidden px-6 py-9 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cv-accent-soft text-[#C78C00] transition duration-300 group-hover:rotate-6 group-hover:bg-cv-accent group-hover:text-cv-ink motion-reduce:transform-none">
        <Icon name={item.icon} size={30} strokeWidth={1.5} />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-cv-ink">{item.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-cv-muted">{item.description}</p>
      {/* Línea de acento que crece al pasar el mouse */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-cv-accent transition-transform duration-300 group-hover:scale-x-100"
      />
    </Card>
  )
}
