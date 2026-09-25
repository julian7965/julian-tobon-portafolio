import type { Profile, Project, Stat } from './types'

/**
 * Calcula las cifras del diálogo "Conóceme" a partir de los datos,
 * para que nunca queden desactualizadas al agregar proyectos o empresas.
 */
export function buildProfileStats(profile: Profile, projects: Project[]): Stat[] {
  const technologies = new Set(projects.flatMap((project) => project.technologies.map((tech) => tech.toLowerCase())))

  return [
    { value: profile.yearsOfExperience, suffix: '+', label: 'años de experiencia' },
    { value: profile.companies.length, label: 'organizaciones' },
    { value: projects.length, label: 'proyectos destacados' },
    { value: technologies.size, label: 'tecnologías aplicadas' },
  ]
}
