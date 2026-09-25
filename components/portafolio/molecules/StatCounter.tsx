'use client'

import { useEffect, useState } from 'react'
import type { Stat } from '@/lib/portafolio/types'
import { useInView } from '../hooks/useInView'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const DURATION_MS = 1200

/** Molécula: cifra que cuenta desde 0 hasta su valor cuando aparece en pantalla. */
export function StatCounter({ stat }: { stat: Stat }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 })
  const reducedMotion = usePrefersReducedMotion()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setCurrent(stat.value)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cúbico
      setCurrent(Math.round(stat.value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, stat.value])

  return (
    <div ref={ref} className="h-full rounded-lg bg-cv-canvas px-3 py-4 text-center">
      <p className="text-2xl font-bold tabular-nums text-cv-ink sm:text-3xl">
        {current}
        {stat.suffix}
      </p>
      <p className="mt-1 text-xs leading-snug text-cv-muted">{stat.label}</p>
    </div>
  )
}
