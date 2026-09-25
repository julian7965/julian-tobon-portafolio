'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Profile, Stat } from '@/lib/portafolio/types'
import { shouldSkipOptimization } from '@/lib/portafolio/images'
import { Badge, Button, Card, TypingText } from '../atoms'
import { ProfileDialog } from './ProfileDialog'

interface HeroSectionProps {
  profile: Profile
  stats: Stat[]
}

/**
 * Organismo: sección "Perfil". Muestra el nombre, los roles con efecto de
 * máquina de escribir, un resumen y la foto sobre fondo blanco.
 * El botón abre el diálogo "Conóceme".
 */
export function HeroSection({ profile, stats }: HeroSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <section id="perfil" aria-labelledby="perfil-titulo" className="scroll-mt-24">
      <Card className="animate-cv-fade overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="self-center px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
            {profile.availability.available && (
              <Badge tone="success" className="mb-5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cv-success" aria-hidden="true" />
                {profile.availability.label}
              </Badge>
            )}
            <h1
              id="perfil-titulo"
              className="text-4xl font-bold leading-tight tracking-tight text-cv-ink sm:text-5xl md:text-4xl min-[1400px]:text-5xl"
            >
              Soy {profile.displayName}
            </h1>
            {/* min-h reserva dos líneas para que el texto animado no mueva el resto del contenido */}
            <p className="mt-2 min-h-[2.6em] text-2xl font-bold leading-tight text-cv-ink sm:text-3xl">
              {/* Resaltado tipo marcador: mantiene el acento amarillo con buen contraste */}
              <TypingText
                words={profile.roles}
                className="bg-[linear-gradient(transparent_62%,#FFD76A_62%)] box-decoration-clone px-0.5"
              />
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cv-muted sm:mt-6">{profile.summary}</p>
            <div className="mt-9">
              <Button icon="arrow-right" onClick={() => setDialogOpen(true)} aria-haspopup="dialog">
                Conóceme más
              </Button>
            </div>
          </div>

          {/* Foto del estudiante sobre fondo blanco */}
          <div className="relative min-h-[300px] bg-white sm:min-h-[380px]">
            <Image
              src={profile.photo}
              alt={`Foto de ${profile.fullName}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              unoptimized={shouldSkipOptimization(profile.photo)}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </Card>

      <ProfileDialog open={dialogOpen} onClose={() => setDialogOpen(false)} profile={profile} stats={stats} />
    </section>
  )
}
