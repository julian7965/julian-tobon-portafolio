'use client'

import { useEffect, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import { cn } from '@/lib/portafolio/cn'
import { IconButton } from '../atoms'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id del título interno, para que los lectores de pantalla anuncien el diálogo. */
  titleId: string
  size?: 'md' | 'lg'
  /** Cuando cambia (p. ej. al pasar al siguiente proyecto), el diálogo vuelve arriba. */
  contentKey?: string
  children: ReactNode
}

/**
 * Molécula de diálogo modal basada en el elemento nativo <dialog>.
 * Ventajas: el navegador maneja la capa superior, el foco y la tecla Escape.
 * Se reutiliza en el diálogo del perfil y en el detalle de cada proyecto.
 */
export function Modal({ open, onClose, titleId, size = 'md', contentKey, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sincroniza el estado de React con la API nativa del <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Al cambiar el contenido se muestra desde el inicio.
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 })
  }, [contentKey])

  useBodyScrollLock(open)

  // Escape dispara el evento "cancel": se cancela el cierre nativo y se avisa a React.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  // Un clic directamente sobre el <dialog> (no sobre su contenido) es un clic en el fondo oscuro.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-xl bg-white p-0 text-left text-cv-ink shadow-2xl',
        'backdrop:bg-cv-ink/60 backdrop:backdrop-blur-sm open:animate-cv-pop motion-reduce:animate-none',
        size === 'lg' ? 'max-w-3xl' : 'max-w-2xl',
      )}
    >
      {open && (
        <div className="relative">
          {/* Barra "pegajosa": el botón de cerrar sigue visible al hacer scroll, sin empujar el contenido */}
          <div className="pointer-events-none sticky top-0 z-10 -mb-16 flex h-16 items-start justify-end p-4">
            <IconButton
              icon="close"
              label="Cerrar diálogo"
              variant="soft"
              size="sm"
              onClick={onClose}
              className="pointer-events-auto shadow-md"
            />
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
