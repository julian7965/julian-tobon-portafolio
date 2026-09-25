'use client'

import type { EditableKnowledge } from '@/lib/portafolio/types'
import { Badge } from '../../atoms'
import { SwitchField, TextAreaField, TextField } from '../../atoms/FormFields'
import { IconSelect } from '../../molecules/IconSelect'
import { ListEditor, type Keyed } from '../../molecules/ListEditor'
import { errorIndexesFor, type FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface KnowledgeFormProps {
  items: Keyed<EditableKnowledge>[]
  onChange: (items: Keyed<EditableKnowledge>[]) => void
  errors: FieldErrors
}

/** Organismo del editor: tarjetas de la sección Conocimientos. */
export function KnowledgeForm({ items, onChange, errors }: KnowledgeFormProps) {
  return (
    <FormSection
      title="Conocimientos"
      description="Cada tarjeta tiene título, descripción e ícono. El orden de la lista es el orden en el sitio."
    >
      <ListEditor<EditableKnowledge>
        items={items}
        onChange={(next) => onChange(next as Keyed<EditableKnowledge>[])}
        createItem={() => ({ id: '', title: '', description: '', icon: 'sparkles', visible: true })}
        itemTitle={(item) => item.title || 'Nuevo conocimiento'}
        itemBadge={(item) => (item.visible ? null : <Badge>Oculto</Badge>)}
        errorIndexes={errorIndexesFor(errors, 'knowledge')}
        addLabel="Agregar conocimiento"
        max={20}
        renderItem={(item, update, index) => {
          const error = (field: string) => errors.get(`knowledge.${index}.${field}`)
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Título" value={item.title} onChange={(title) => update({ title })} error={error('title')} maxLength={80} />
              <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
              <TextAreaField
                label="Descripción"
                value={item.description}
                onChange={(description) => update({ description })}
                error={error('description')}
                rows={2}
                maxLength={300}
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
