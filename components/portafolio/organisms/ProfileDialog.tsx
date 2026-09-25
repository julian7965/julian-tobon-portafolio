'use client'

import { useState } from 'react'
import type { Profile, Stat } from '@/lib/portafolio/types'
import { Avatar, Badge, Button } from '../atoms'
import { Modal, SocialLinks, StatCounter } from '../molecules'

interface ProfileDialogProps {
  open: boolean
  onClose: () => void
  profile: Profile
  stats: Stat[]
}

/**
 * Organismo: diálogo "Conóceme" que se abre desde la sección Perfil.
 * Presenta una ficha con cifras animadas, trayectoria y accesos de contacto.
 */
export function ProfileDialog({ open, onClose, profile, stats }: ProfileDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Si el navegador bloquea el portapapeles, se abre el cliente de correo como alternativa.
      window.location.href = `mailto:${profile.email}`
    }
  }

  const [currentCompany, ...previousCompanies] = profile.companies

  return (
    <Modal open={open} onClose={onClose} titleId="dialogo-perfil-titulo">
      {/* Encabezado con patrón de puntos del color de acento */}
      <div className="relative overflow-hidden bg-cv-accent-soft px-6 pb-7 pt-12 sm:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50 [background-image:radial-gradient(#FFB400_1.2px,transparent_1.2px)] [background-size:18px_18px]"
        />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar src={profile.photo} alt={`Foto de ${profile.fullName}`} size="lg" online={profile.availability.available} />
          <div>
            {profile.availability.available && (
              <Badge tone="success">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cv-success" aria-hidden="true" />
                {profile.availability.label}
              </Badge>
            )}
            <h2 id="dialogo-perfil-titulo" className="mt-2 text-2xl font-bold text-cv-ink">
              {profile.fullName}
            </h2>
            <p className="mt-1 text-cv-muted">{profile.title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 sm:px-10">
        <section aria-labelledby="dialogo-perfil-sobre-mi">
          <h3 id="dialogo-perfil-sobre-mi" className="text-sm font-semibold uppercase tracking-widest text-cv-ink">
            Sobre mí
          </h3>
          <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-cv-muted">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Cifras destacadas">
          {stats.map((stat) => (
            <li key={stat.label}>
              <StatCounter stat={stat} />
            </li>
          ))}
        </ul>

        {currentCompany && (
          <section aria-labelledby="dialogo-perfil-trayectoria">
            <h3 id="dialogo-perfil-trayectoria" className="text-sm font-semibold uppercase tracking-widest text-cv-ink">
              Trayectoria
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li>
                <Badge tone="accent" className="px-3 py-1 text-sm">
                  {currentCompany} · Actual
                </Badge>
              </li>
              {previousCompanies.map((company) => (
                <li key={company}>
                  <Badge className="px-3 py-1 text-sm">{company}</Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col gap-4 border-t border-cv-line pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <Button href={`mailto:${profile.email}`} icon="send">
              Escríbeme
            </Button>
            <Button variant="outline" icon={copied ? 'check' : 'copy'} onClick={copyEmail} aria-live="polite">
              {copied ? '¡Copiado!' : 'Copiar correo'}
            </Button>
          </div>
          <SocialLinks links={profile.socials} direction="horizontal" tooltip="top" className="sm:ml-auto" />
        </div>
      </div>
    </Modal>
  )
}
