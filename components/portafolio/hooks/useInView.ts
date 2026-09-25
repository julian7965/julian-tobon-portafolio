'use client'

import { useEffect, useRef, useState } from 'react'

interface InViewOptions {
  /** Si es true, deja de observar después de la primera vez que el elemento aparece. */
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Indica si un elemento está visible en pantalla usando IntersectionObserver.
 * Se usa para disparar animaciones (Reveal, ProgressBar, StatCounter) solo cuando
 * el usuario llega a ellas.
 */
export function useInView<T extends Element>({ once = true, rootMargin = '0px', threshold = 0.15 }: InViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Navegadores sin soporte: se muestra todo de inmediato.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView] as const
}
