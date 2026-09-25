import Image from 'next/image'
import { cn } from '@/lib/portafolio/cn'
import { shouldSkipOptimization } from '@/lib/portafolio/images'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_PX: Record<AvatarSize, number> = { sm: 40, md: 72, lg: 112, xl: 150 }

interface AvatarProps {
  src: string
  alt: string
  size?: AvatarSize
  /** Muestra el punto verde de "disponible". */
  online?: boolean
  priority?: boolean
  className?: string
}

/** Átomo de foto circular con indicador opcional de disponibilidad. */
export function Avatar({ src, alt, size = 'md', online = false, priority = false, className }: AvatarProps) {
  const px = SIZE_PX[size]

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: px, height: px }}>
      <div className="relative h-full w-full overflow-hidden rounded-full bg-cv-canvas">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${px}px`}
          priority={priority}
          unoptimized={shouldSkipOptimization(src)}
          className="object-cover"
        />
      </div>
      {online && (
        <span
          aria-hidden="true"
          className="absolute bottom-[6%] right-[6%] rounded-full border-2 border-white bg-cv-success"
          style={{ width: Math.max(10, px * 0.14), height: Math.max(10, px * 0.14) }}
        />
      )}
    </div>
  )
}
