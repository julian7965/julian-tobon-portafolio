'use client'

import type { EditableEducation } from '@/lib/portafolio/types'
import { Badge } from '../../atoms'
import { SwitchField, TextAreaField, TextField } from '../../atoms/FormFields'
import { ListEditor, type Keyed } from '../../molecules/ListEditor'
import { errorIndexesFor, type FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface EducationFormProps {
  items: Keyed<EditableEducation>[]
  onChange: (items: Keyed<EditableEducation>[]) => void
  errors: FieldErrors
}

/** Organismo del editor: historia educativa. */
export function EducationForm({ items, onChange, errors }: EducationFormProps) {
  return (
    <FormSection
      title="Educación"
      description="Institución, fechas, título obtenido o en curso y una descripción breve."
    >
      <ListEditor<EditableEducation>
        items={items}
        onChange={(next) => onChange(next as Keyed<EditableEducation>[])}
        createItem={() => ({
          id: '',
          institution: '',
          degree: '',
          status: 'En curso',
          period: '',
          description: '',
          visible: true,
        })}
        itemTitle={(item) => (item.degree ? `${item.degree} · ${item.institution}` : 'Nueva entrada')}
        itemBadge={(item) => (item.visible ? null : <Badge>Oculto</Badge>)}
        errorIndexes={errorIndexesFor(errors, 'education')}
        addLabel="Agregar estudio"
        max={15}
        renderItem={(item, update, index) => {
          const error = (field: string) => errors.get(`education.${index}.${field}`)
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Institución"
                value={item.institution}
                onChange={(institution) => update({ institution })}
                error={error('institution')}
              />
              <TextField
                label="Título obtenido o en curso"
                value={item.degree}
                onChange={(degree) => update({ degree })}
                error={error('degree')}
              />
              <TextField
                label="Estado"
                hint="Ej.: Graduado, En curso, Certificado"
                value={item.status}
                onChange={(status) => update({ status })}
                error={error('status')}
              />
              <TextField
                label="Periodo"
                hint="Ej.: 2019 – 2024 o 2022 – Actualidad"
                value={item.period}
                onChange={(period) => update({ period })}
                error={error('period')}
              />
              <TextAreaField
                label="Descripción"
                value={item.description}
                onChange={(description) => update({ description })}
                error={error('description')}
                rows={3}
                maxLength={800}
                className="sm:col-span-2"
              />
              <SwitchField
                label="Visible en el sitio"
                checked={item.visible}
                onChange={(visible) => update({ visible })}
                className="sm:col-span-2"
              />
            </div>
          )
        }}
      />
    </FormSection>
  )
}
