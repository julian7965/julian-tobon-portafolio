import { Reveal } from '../atoms'

interface SectionHeaderProps {
  /** id del título: la sección lo usa en aria-labelledby. */
  id: string
  title: string
  description: string
}

/** Molécula: título y descripción centrados que encabezan cada sección del contenido. */
export function SectionHeader({ id, title, description }: SectionHeaderProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-xl text-center">
      <h2 id={id} className="text-3xl font-bold tracking-tight text-cv-ink sm:text-[32px]">
        {title}
      </h2>
      <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-12 rounded-full bg-cv-accent" />
      <p className="mt-4 text-[15px] leading-relaxed text-cv-muted">{description}</p>
    </Reveal>
  )
}
