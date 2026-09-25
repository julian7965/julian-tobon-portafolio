import type { ContentSource } from '@/lib/portafolio/types'
import { Badge, Card, Icon } from '../atoms'
import { BackToTopButton } from '../molecules'

interface SiteFooterProps {
  name: string
  source: ContentSource
}

/** Organismo: footer de diseño libre con créditos, origen del contenido y botón para volver arriba. */
export function SiteFooter({ name, source }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <Card
      as="footer"
      data-content-source={source}
      className="flex flex-col items-center gap-4 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left"
    >
      <div>
        <p className="text-sm text-cv-ink">
          © {year} <span className="font-semibold">{name}</span>. Todos los derechos reservados.
        </p>
        <p className="mt-1 text-xs text-cv-muted">Hecho con Next.js, TypeScript y Tailwind CSS · Desplegado en Vercel</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {source !== 'local' && (
          <Badge tone="success">
            <Icon name="database" size={14} />
            Contenido desde Supabase
          </Badge>
        )}
        <BackToTopButton />
      </div>
    </Card>
  )
}
