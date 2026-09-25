'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { cn } from '@/lib/portafolio/cn'
import { isSafeImageSrc } from '@/lib/portafolio/safe-url'
import { slugify } from '@/lib/portafolio/slug'
import { Button, Icon } from '../atoms'
import { TextField } from '../atoms/FormFields'

/** Bucket público creado por supabase/portafolio_cv.sql. */
const BUCKET = 'portafolio'
const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

type UploadStatus = { kind: 'idle' } | { kind: 'uploading' } | { kind: 'done'; message: string } | { kind: 'error'; message: string }

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  /** Carpeta dentro del bucket: una para la foto y otra para los proyectos. */
  folder: 'perfil' | 'proyectos'
  shape?: 'circle' | 'wide'
  hint?: string
  error?: string
}

/**
 * Molécula para imágenes: vista previa, subida a Supabase Storage y campo para
 * pegar una URL o una ruta de /public. Se usa para la foto y para cada proyecto.
 */
export function ImageUploadField({ label, value, onChange, folder, shape = 'wide', hint, error }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<UploadStatus>({ kind: 'idle' })

  const uploadFile = async (file: File) => {
    const extension = ACCEPTED_TYPES[file.type]
    if (!extension) {
      setStatus({ kind: 'error', message: 'Formato no permitido. Usa JPG, PNG, WebP, GIF o AVIF.' })
      return
    }
    if (file.size > MAX_BYTES) {
      setStatus({ kind: 'error', message: 'La imagen pesa más de 5 MB. Redúcela e inténtalo de nuevo.' })
      return
    }

    setStatus({ kind: 'uploading' })
    // Nombre único: evita reemplazar imágenes anteriores y problemas de caché.
    const baseName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'imagen'
    const path = `${folder}/${Date.now()}-${baseName}.${extension}`

    const { error: uploadError } = await getSupabaseBrowserClient().storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })

    if (uploadError) {
      setStatus({ kind: 'error', message: `No se pudo subir la imagen: ${uploadError.message}` })
      return
    }

    const { data } = getSupabaseBrowserClient().storage.from(BUCKET).getPublicUrl(path)
    onChange(data.publicUrl)
    setStatus({ kind: 'done', message: 'Imagen subida. Recuerda guardar los cambios.' })
  }

  const hasPreview = isSafeImageSrc(value)

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-medium text-cv-ink">{label}</p>
      <div className={cn('flex gap-4', shape === 'circle' ? 'items-center' : 'flex-col sm:flex-row sm:items-start')}>
        {/* Vista previa */}
        <div
          className={cn(
            'relative shrink-0 overflow-hidden border border-cv-line bg-cv-canvas',
            shape === 'circle' ? 'h-24 w-24 rounded-full' : 'aspect-[16/10] w-full rounded-lg sm:w-56',
          )}
        >
          {hasPreview ? (
            <Image src={value} alt={`Vista previa: ${label}`} fill unoptimized sizes="224px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-cv-muted">
              <Icon name="image" size={28} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={Object.keys(ACCEPTED_TYPES).join(',')}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void uploadFile(file)
              event.target.value = '' // permite volver a elegir el mismo archivo
            }}
          />
          <Button
            variant="outline"
            size="sm"
            icon={status.kind === 'uploading' ? 'loader' : 'upload'}
            iconPosition="left"
            onClick={() => fileInputRef.current?.click()}
            disabled={status.kind === 'uploading'}
          >
            {status.kind === 'uploading' ? 'Subiendo…' : 'Subir imagen'}
          </Button>
          <TextField
            label="O pega una URL o ruta"
            value={value}
            onChange={onChange}
            placeholder="https://… o /portafolio/…"
            hint={hint}
            error={error}
          />
          {status.kind === 'done' && <p className="text-xs font-medium text-cv-success-text">{status.message}</p>}
          {status.kind === 'error' && (
            <p className="text-xs font-medium text-red-700" role="alert">
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
