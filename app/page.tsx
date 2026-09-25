import type { Metadata } from 'next'
import { profile as localProfile } from '@/data/cv'
import { getCvContent } from '@/lib/portafolio/cv-repository'
import { buildProfileStats } from '@/lib/portafolio/stats'
import {
  EducationSection,
  HeroSection,
  KnowledgeSection,
  PortfolioSection,
  ProfileSidebar,
  SiteFooter,
  SocialSidebar,
} from '@/components/portafolio/organisms'
import { PortfolioTemplate } from '@/components/portafolio/templates'

/**
 * Regeneración incremental (ISR): la página es estática y rápida, pero se
 * reconstruye como máximo cada 60 s para reflejar los cambios hechos en Supabase.
 */
export const revalidate = 60

export const metadata: Metadata = {
  title: `${localProfile.displayName} | Hoja de vida`,
  description: localProfile.summary,
  openGraph: {
    title: `${localProfile.displayName} | Hoja de vida`,
    description: localProfile.summary,
    type: 'profile',
    locale: 'es_CO',
  },
}

/**
 * Página principal "/": portafolio / hoja de vida (Proyecto 1 - Ingeniería Web).
 * Es un Server Component: obtiene los datos en el servidor y arma la página
 * con la plantilla y los organismos.
 */
export default async function PortfolioPage() {
  const { profile, knowledge, education, projects, source } = await getCvContent()
  const stats = buildProfileStats(profile, projects)

  return (
    <PortfolioTemplate
      displayName={profile.displayName}
      photo={profile.photo}
      profileSidebar={<ProfileSidebar profile={profile} />}
      socialSidebar={<SocialSidebar socials={profile.socials} />}
      footer={<SiteFooter name={profile.displayName} source={source} />}
    >
      <HeroSection profile={profile} stats={stats} />
      <KnowledgeSection items={knowledge} />
      <EducationSection entries={education} />
      <PortfolioSection projects={projects} />
    </PortfolioTemplate>
  )
}
