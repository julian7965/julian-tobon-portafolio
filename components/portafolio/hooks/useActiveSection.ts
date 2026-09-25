'use client'

import { useEffect, useState } from 'react'

/**
 * "Scroll spy": devuelve el id de la sección que ocupa el centro de la pantalla.
 * Lo usa el menú derecho para resaltar la sección actual.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)
  const idsKey = sectionIds.join('|')

  useEffect(() => {
    const ids = idsKey.split('|').filter(Boolean)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      // Solo cuenta como "activa" la sección que cruza la franja central de la pantalla.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}
