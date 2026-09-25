/**
 * Reglas de validación del CV (zod). Las usa el editor para avisar errores antes
 * de guardar y la acción del servidor para no confiar en lo que llega del navegador.
 */
import { z } from 'zod'
import { ICON_NAMES, type IconName } from './icons'
import { isSafeHref, isSafeImageSrc } from './safe-url'

type Gender = 'm' | 'f'

const required = (label: string, gender: Gender) => `${label} es obligatori${gender === 'f' ? 'a' : 'o'}`

/** Texto obligatorio con límite de caracteres. */
const requiredText = (label: string, max: number, gender: Gender = 'm') =>
  z
    .string({ required_error: required(label, gender), invalid_type_error: `${label} debe ser texto` })
    .trim()
    .min(1, required(label, gender))
    .max(max, `${label} admite máximo ${max} caracteres`)

/** Texto opcional: si queda vacío se guarda como "sin valor". */
const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} admite máximo ${max} caracteres`)
    .optional()
    .transform((value) => (value ? value : undefined))

const HREF_HINT = 'usa https://, mailto:, tel: o una ruta que empiece por /'

const optionalHref = (label: string) =>
  z
    .string()
    .trim()
    .max(500, `${label} admite máximo 500 caracteres`)
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => value === undefined || isSafeHref(value), `${label} no es válido: ${HREF_HINT}`)

const requiredHref = (label: string) =>
  requiredText(label, 500, 'f').refine((value) => isSafeHref(value), `${label} no es válida: ${HREF_HINT}`)

const imageSrc = (label: string) =>
  requiredText(label, 1000, 'f').refine(
    (value) => isSafeImageSrc(value),
    `${label} debe ser una URL https o una ruta que empiece por /`,
  )

const iconSchema = z.enum(ICON_NAMES as unknown as [IconName, ...IconName[]], {
  errorMap: () => ({ message: 'Elige un ícono de la lista' }),
})

const levelSchema = z
  .number({ invalid_type_error: 'El nivel debe ser un número' })
  .int('El nivel debe ser un número entero')
  .min(0, 'El nivel mínimo es 0')
  .max(100, 'El nivel máximo es 100')

const skillSchema = z.object({
  name: requiredText('El nombre', 60),
  level: levelSchema,
  note: optionalText('La nota', 40),
})

const contactSchema = z.object({
  label: requiredText('La etiqueta', 40, 'f'),
  value: requiredText('El valor', 120),
  icon: iconSchema,
  href: optionalHref('El enlace'),
})

const socialSchema = z.object({
  name: requiredText('El nombre', 40),
  url: requiredHref('La URL'),
  icon: iconSchema,
})

export const profileSchema = z.object({
  fullName: requiredText('El nombre completo', 120),
  displayName: requiredText('El nombre corto', 60),
  title: requiredText('El título', 120),
  roles: z.array(requiredText('Cada rol', 60)).min(1, 'Agrega al menos un rol').max(8, 'Máximo 8 roles'),
  summary: requiredText('El resumen', 600),
  about: z.array(requiredText('Cada párrafo', 1200)).max(6, 'Máximo 6 párrafos'),
  photo: imageSrc('La foto'),
  availability: z.object({
    available: z.boolean(),
    label: z.string().trim().max(60, 'El texto de disponibilidad admite máximo 60 caracteres'),
  }),
  contact: z.array(contactSchema).max(10, 'Máximo 10 datos de contacto'),
  languages: z.array(skillSchema).max(10, 'Máximo 10 idiomas'),
  programmingLanguages: z.array(skillSchema).max(15, 'Máximo 15 lenguajes'),
  extraSkills: z.array(requiredText('Cada habilidad', 80, 'f')).max(20, 'Máximo 20 habilidades'),
  socials: z.array(socialSchema).max(8, 'Máximo 8 redes'),
  companies: z.array(requiredText('Cada empresa', 80, 'f')).max(20, 'Máximo 20 empresas'),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Los años de experiencia deben ser un número' })
    .int('Los años de experiencia deben ser un número entero')
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(60, 'Revisa los años de experiencia'),
  email: z.string().trim().email('El correo no es válido').max(120, 'El correo admite máximo 120 caracteres'),
})

const knowledgeSchema = z.object({
  id: z.string(),
  title: requiredText('El título', 80),
  description: requiredText('La descripción', 300, 'f'),
  icon: iconSchema,
  visible: z.boolean(),
})

const educationSchema = z.object({
  id: z.string(),
  institution: requiredText('La institución', 120, 'f'),
  degree: requiredText('El título', 120),
  status: requiredText('El estado', 40),
  period: requiredText('El periodo', 60),
  description: z.string().trim().max(800, 'La descripción admite máximo 800 caracteres'),
  visible: z.boolean(),
})

const projectSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, 'El identificador es obligatorio')
    .max(60, 'El identificador admite máximo 60 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El identificador solo admite minúsculas, números y guiones'),
  title: requiredText('El título', 80),
  summary: requiredText('El resumen', 240),
  description: requiredText('La descripción', 2000, 'f'),
  image: imageSrc('La imagen'),
  technologies: z.array(requiredText('Cada tecnología', 40, 'f')).max(12, 'Máximo 12 tecnologías'),
  highlights: z.array(requiredText('Cada logro', 200)).max(10, 'Máximo 10 logros'),
  repoUrl: optionalHref('El enlace al código'),
  demoUrl: optionalHref('El enlace a la demo'),
  privateNote: optionalText('La nota', 160),
  visible: z.boolean(),
})

export const cvDraftSchema = z
  .object({
    profile: profileSchema,
    knowledge: z.array(knowledgeSchema).min(1, 'Agrega al menos un conocimiento').max(20, 'Máximo 20 conocimientos'),
    education: z.array(educationSchema).min(1, 'Agrega al menos una entrada de educación').max(15, 'Máximo 15 entradas'),
    projects: z.array(projectSchema).min(1, 'Agrega al menos un proyecto').max(20, 'Máximo 20 proyectos'),
  })
  .superRefine((draft, context) => {
    // Los identificadores de proyecto deben ser únicos (se usan en la base de datos).
    const seen = new Set<string>()
    draft.projects.forEach((project, index) => {
      if (seen.has(project.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['projects', index, 'id'],
          message: 'Ya existe otro proyecto con este identificador',
        })
      }
      seen.add(project.id)
    })
  })

export type ValidCvDraft = z.infer<typeof cvDraftSchema>

/* ---------- Mensajes legibles ---------- */

const PATH_LABELS: Record<string, string> = {
  profile: 'Perfil',
  knowledge: 'Conocimientos',
  education: 'Educación',
  projects: 'Proyectos',
  contact: 'Contacto',
  languages: 'Idiomas',
  programmingLanguages: 'Lenguajes',
  extraSkills: 'Habilidades extra',
  socials: 'Redes',
  companies: 'Trayectoria',
  roles: 'Roles',
  about: 'Sobre mí',
  technologies: 'Tecnologías',
  highlights: 'Logros',
}

export interface CvIssue {
  /** Ruta del campo, por ejemplo ['projects', 2, 'title']. */
  path: (string | number)[]
  /** Mensaje con la ubicación: "Proyectos › #3: El título es obligatorio". */
  message: string
  /** Mensaje corto para mostrar junto al campo: "El título es obligatorio". */
  detail: string
}

/** Convierte los errores de zod en mensajes en español con la ubicación del campo. */
export function describeIssues(error: z.ZodError): CvIssue[] {
  return error.issues.map((issue) => {
    const location = issue.path
      .map((segment) => (typeof segment === 'number' ? `#${segment + 1}` : PATH_LABELS[segment]))
      .filter(Boolean)
      .join(' › ')
    return { path: issue.path, message: location ? `${location}: ${issue.message}` : issue.message, detail: issue.message }
  })
}
