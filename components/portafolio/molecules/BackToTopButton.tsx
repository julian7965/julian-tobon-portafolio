'use client'

import { Button } from '../atoms'

/** Molécula: botón del footer que regresa suavemente al inicio de la página. */
export function BackToTopButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      icon="arrow-up"
      iconPosition="left"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Volver arriba
    </Button>
  )
}
