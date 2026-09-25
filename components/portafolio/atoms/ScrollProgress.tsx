'use client'

import { useEffect, useState } from 'react'

/** Átomo: barra fina en la parte superior que indica cuánto se ha leído de la página. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    // requestAnimationFrame evita recalcular en cada píxel de scroll.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1">
      <div className="h-full bg-cv-accent transition-[width] duration-100" style={{ width: `${progress}%` }} />
    </div>
  )
}
