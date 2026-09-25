import type { Profile } from '@/lib/portafolio/types'
import { Avatar } from '../atoms'
import { CheckItem, InfoRow, SidebarBlock, SkillMeter } from '../molecules'

/**
 * Organismo: menú izquierdo fijo con información personal, contacto,
 * idiomas, lenguajes de programación y habilidades extra.
 */
export function ProfileSidebar({ profile }: { profile: Profile }) {
  return (
    <div className="px-7 pb-8">
      {/* Información personal */}
      <div className="flex flex-col items-center border-b border-cv-line pb-7 pt-12 text-center">
        <Avatar
          src={profile.photo}
          alt={`Foto de ${profile.fullName}`}
          size="xl"
          online={profile.availability.available}
          priority
        />
        <p className="mt-5 text-lg font-semibold text-cv-ink">{profile.displayName}</p>
        <p className="mt-1 text-[15px] leading-snug text-cv-muted">{profile.title}</p>
      </div>

      <SidebarBlock title="Contacto">
        <ul className="space-y-4">
          {profile.contact.map((item) => (
            <InfoRow key={item.label} item={item} />
          ))}
        </ul>
      </SidebarBlock>

      <SidebarBlock title="Idiomas">
        <div className="space-y-4">
          {profile.languages.map((language) => (
            <SkillMeter key={language.name} skill={language} context="Dominio del idioma" />
          ))}
        </div>
      </SidebarBlock>

      <SidebarBlock title="Lenguajes de programación">
        <div className="space-y-4">
          {profile.programmingLanguages.map((language) => (
            <SkillMeter key={language.name} skill={language} context="Dominio del lenguaje" />
          ))}
        </div>
      </SidebarBlock>

      <SidebarBlock title="Habilidades extra">
        <ul className="space-y-3">
          {profile.extraSkills.map((skill) => (
            <CheckItem key={skill}>{skill}</CheckItem>
          ))}
        </ul>
      </SidebarBlock>
    </div>
  )
}
