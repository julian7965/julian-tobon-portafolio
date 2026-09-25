/**
 * Tipos del portafolio / hoja de vida.
 *
 * Convención del proyecto:
 *  - El código (tipos, componentes, funciones) está en inglés.
 *  - Las tablas de Supabase usan nombres en español (igual que el resto de la BD),
 *    y `cv-repository.ts` se encarga de traducir filas → tipos.
 */

import type { IconName } from './icons'

export type { IconName }

/** Un dato de contacto del menú izquierdo (ciudad, correo, teléfono, etc.). */
export interface ContactItem {
  label: string
  value: string
  icon: IconName
  /** Enlace opcional (mailto:, tel:, https://). */
  href?: string
}

/** Habilidad con porcentaje de dominio (idiomas y lenguajes de programación). */
export interface Skill {
  name: string
  /** Porcentaje de dominio entre 0 y 100. */
  level: number
  /** Texto opcional junto al nombre, p. ej. "Nativo" o "B2". */
  note?: string
}

/** Red social del menú derecho. */
export interface SocialLink {
  name: string
  url: string
  icon: IconName
}

/** Cifra destacada que se anima en el diálogo del perfil. */
export interface Stat {
  value: number
  suffix?: string
  label: string
}

/** Datos personales: se editan en `data/cv.ts`. */
export interface Profile {
  fullName: string
  displayName: string
  title: string
  /** Roles que rotan con efecto de máquina de escribir en la sección Perfil. */
  roles: string[]
  summary: string
  /** Texto largo para el diálogo "Conóceme". */
  about: string[]
  photo: string
  availability: { available: boolean; label: string }
  contact: ContactItem[]
  languages: Skill[]
  programmingLanguages: Skill[]
  extraSkills: string[]
  socials: SocialLink[]
  /** Empresas y organizaciones de la trayectoria (la primera es la actual). */
  companies: string[]
  yearsOfExperience: number
  /** Correo que usan los botones "Escríbeme" y "Copiar correo". */
  email: string
}

/** Tarjeta de la sección Conocimientos. */
export interface Knowledge {
  id: string
  title: string
  description: string
  icon: IconName
}

/** Entrada de la sección Educación. */
export interface EducationEntry {
  id: string
  institution: string
  degree: string
  /** Ej.: "Graduado", "En curso", "Certificado". */
  status: string
  /** Ej.: "2019 – 2024" o "2022 – Actualidad". */
  period: string
  description: string
}

/** Proyecto de la sección Portafolio. */
export interface Project {
  id: string
  title: string
  /** Resumen corto para la tarjeta. */
  summary: string
  /** Descripción completa para el diálogo "Saber más". */
  description: string
  /** Ruta en /public (ej. /portafolio/proyectos/x.svg) o URL absoluta (Supabase Storage). */
  image: string
  technologies: string[]
  highlights: string[]
  repoUrl?: string
  demoUrl?: string
  /** Nota que reemplaza los enlaces cuando el código es privado/confidencial. */
  privateNote?: string
}

/** Origen del contenido administrable. */
export type ContentSource = 'supabase' | 'local' | 'mixto'

/** Todo lo que necesita la página del portafolio. */
export interface CvContent {
  profile: Profile
  knowledge: Knowledge[]
  education: EducationEntry[]
  projects: Project[]
  source: ContentSource
}

/* ---------- Tipos del editor (/portafolio/editar) ---------- */

/** Los elementos editables agregan `visible` para poder ocultarlos sin borrarlos. */
export interface EditableKnowledge extends Knowledge {
  visible: boolean
}

export interface EditableEducation extends EducationEntry {
  visible: boolean
}

export interface EditableProject extends Project {
  visible: boolean
}

/** Borrador completo que maneja el editor y que se envía al guardar. */
export interface CvDraft {
  profile: Profile
  knowledge: EditableKnowledge[]
  education: EditableEducation[]
  projects: EditableProject[]
}
