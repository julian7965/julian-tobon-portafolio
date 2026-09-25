import type {
  ContactItem,
  CvDraft,
  EditableEducation,
  EditableKnowledge,
  EditableProject,
  Profile,
  Skill,
  SocialLink,
} from '@/lib/portafolio/types'
import { withKeys, type Keyed } from '../../molecules/ListEditor'

/**
 * Estado interno del editor: igual al CvDraft, pero cada elemento de las listas
 * lleva una clave `_key` para que React no confunda los elementos al reordenarlos.
 */
export interface EditorProfile extends Omit<Profile, 'contact' | 'socials' | 'languages' | 'programmingLanguages'> {
  contact: Keyed<ContactItem>[]
  socials: Keyed<SocialLink>[]
  languages: Keyed<Skill>[]
  programmingLanguages: Keyed<Skill>[]
}

export interface EditorDraft {
  profile: EditorProfile
  knowledge: Keyed<EditableKnowledge>[]
  education: Keyed<EditableEducation>[]
  projects: Keyed<EditableProject>[]
}

/** Errores de validación indexados por ruta: "projects.2.title" → mensaje. */
export type FieldErrors = Map<string, string>

/** CvDraft (datos) → EditorDraft (con claves internas). */
export function toEditorDraft(draft: CvDraft): EditorDraft {
  return {
    profile: {
      ...draft.profile,
      contact: withKeys(draft.profile.contact),
      socials: withKeys(draft.profile.socials),
      languages: withKeys(draft.profile.languages),
      programmingLanguages: withKeys(draft.profile.programmingLanguages),
    },
    knowledge: withKeys(draft.knowledge),
    education: withKeys(draft.education),
    projects: withKeys(draft.projects),
  }
}

/** Quita la clave interna `_key` de cada elemento. */
const stripKeys = <T extends { _key: string }>(items: T[]): Omit<T, '_key'>[] =>
  items.map(({ _key, ...item }) => {
    void _key
    return item
  })

/** EditorDraft → CvDraft (lo que se valida y se envía al servidor). */
export function toCvDraft(draft: EditorDraft): CvDraft {
  return {
    profile: {
      ...draft.profile,
      contact: stripKeys(draft.profile.contact),
      socials: stripKeys(draft.profile.socials),
      languages: stripKeys(draft.profile.languages),
      programmingLanguages: stripKeys(draft.profile.programmingLanguages),
    },
    knowledge: stripKeys(draft.knowledge),
    education: stripKeys(draft.education),
    projects: stripKeys(draft.projects),
  }
}

/** Índices de una lista que tienen algún error (para resaltarlos en ListEditor). */
export function errorIndexesFor(errors: FieldErrors, prefix: string): Set<number> {
  const indexes = new Set<number>()
  errors.forEach((_, path) => {
    if (path.startsWith(`${prefix}.`)) {
      const index = Number(path.slice(prefix.length + 1).split('.')[0])
      if (Number.isInteger(index)) indexes.add(index)
    }
  })
  return indexes
}
