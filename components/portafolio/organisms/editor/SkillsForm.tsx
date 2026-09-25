'use client'

import type { Skill } from '@/lib/portafolio/types'
import { RangeField, TextField } from '../../atoms/FormFields'
import { ListEditor, type Keyed } from '../../molecules/ListEditor'
import { StringListEditor } from '../../molecules/StringListEditor'
import { errorIndexesFor, type EditorProfile, type FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface SkillsFormProps {
  profile: EditorProfile
  onChange: (patch: Partial<EditorProfile>) => void
  errors: FieldErrors
}

/** Lista de habilidades con nivel (se reutiliza para idiomas y lenguajes). */
function SkillList({
  items,
  onChange,
  errors,
  errorPrefix,
  nameLabel,
  addLabel,
  max,
}: {
  items: Keyed<Skill>[]
  onChange: (items: Keyed<Skill>[]) => void
  errors: FieldErrors
  errorPrefix: string
  nameLabel: string
  addLabel: string
  max: number
}) {
  return (
    <ListEditor<Skill>
      items={items}
      onChange={(next) => onChange(next as Keyed<Skill>[])}
      createItem={() => ({ name: '', level: 50 })}
      itemTitle={(item) => (item.name ? `${item.name} · ${item.level}%` : 'Nuevo elemento')}
      errorIndexes={errorIndexesFor(errors, errorPrefix)}
      addLabel={addLabel}
      max={max}
      renderItem={(item, update, index) => {
        const error = (field: string) => errors.get(`${errorPrefix}.${index}.${field}`)
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={nameLabel} value={item.name} onChange={(name) => update({ name })} error={error('name')} />
            <TextField
              label="Nota (opcional)"
              value={item.note ?? ''}
              onChange={(note) => update({ note })}
              error={error('note')}
              placeholder="Ej.: Nativo, B2"
            />
            <RangeField
              label="Nivel de dominio"
              value={item.level}
              onChange={(level) => update({ level })}
              error={error('level')}
              className="sm:col-span-2"
            />
          </div>
        )
      }}
    />
  )
}

/** Organismo del editor: idiomas, lenguajes de programación, habilidades extra y trayectoria. */
export function SkillsForm({ profile, onChange, errors }: SkillsFormProps) {
  return (
    <div className="space-y-6">
      <FormSection title="Idiomas" description="Cada idioma con su porcentaje de dominio.">
        <SkillList
          items={profile.languages}
          onChange={(languages) => onChange({ languages })}
          errors={errors}
          errorPrefix="profile.languages"
          nameLabel="Idioma"
          addLabel="Agregar idioma"
          max={10}
        />
      </FormSection>

      <FormSection title="Lenguajes de programación" description="Cada lenguaje con su porcentaje de dominio.">
        <SkillList
          items={profile.programmingLanguages}
          onChange={(programmingLanguages) => onChange({ programmingLanguages })}
          errors={errors}
          errorPrefix="profile.programmingLanguages"
          nameLabel="Lenguaje"
          addLabel="Agregar lenguaje"
          max={15}
        />
      </FormSection>

      <FormSection title="Habilidades extra" description="Habilidades blandas o técnicas del menú izquierdo.">
        <StringListEditor
          label="Habilidades"
          items={profile.extraSkills}
          onChange={(extraSkills) => onChange({ extraSkills })}
          addLabel="Agregar habilidad"
          placeholder="Ej.: Trabajo en equipo"
          max={20}
          error={errors.get('profile.extraSkills')}
          itemError={(index) => errors.get(`profile.extraSkills.${index}`)}
        />
      </FormSection>

      <FormSection title="Trayectoria" description="Empresas del diálogo «Conóceme». La primera se muestra como la actual.">
        <StringListEditor
          label="Empresas"
          items={profile.companies}
          onChange={(companies) => onChange({ companies })}
          addLabel="Agregar empresa"
          max={20}
          error={errors.get('profile.companies')}
          itemError={(index) => errors.get(`profile.companies.${index}`)}
        />
      </FormSection>
    </div>
  )
}
