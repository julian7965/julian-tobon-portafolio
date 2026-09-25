'use client'

import { useEffect } from 'react'

/**
 * Bloquea el scroll de la página mientras un diálogo o menú móvil está abierto,
 * para que el contenido de fondo no se mueva.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [locked])
}
