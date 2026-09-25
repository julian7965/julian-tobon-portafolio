'use client'

import type { ContactItem, SocialLink } from '@/lib/portafolio/types'
import { TextField } from '../../atoms/FormFields'
import { IconSelect } from '../../molecules/IconSelect'
import { ListEditor, type Keyed } from '../../molecules/ListEditor'
import { errorIndexesFor, type EditorProfile, type FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface ContactFormProps {
  profile: EditorProfile
  onChange: (patch: Partial<EditorProfile>) => void
  errors: FieldErrors
}

/** Organismo del editor: datos de contacto (menú izquierdo) y redes sociales (menú derecho). */
export function ContactForm({ profile, onChange, errors }: ContactFormProps) {
  return (
    <div className="space-y-6">
      <FormSection title="Datos de contacto" description="Aparecen en el menú izquierdo: ciudad, correo, teléfono, etc.">
        <ListEditor<ContactItem>
          items={profile.contact}
          onChange={(contact) => onChange({ contact: contact as Keyed<ContactItem>[] })}
          createItem={() => ({ label: '', value: '', icon: 'globe' })}
          itemTitle={(item) => (item.label ? `${item.label}: ${item.value}` : 'Nuevo dato')}
          errorIndexes={errorIndexesFor(errors, 'profile.contact')}
          addLabel="Agregar dato de contacto"
          max={10}
          renderItem={(item, update, index) => {
            const error = (field: string) => errors.get(`profile.contact.${index}.${field}`)
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Etiqueta" value={item.label} onChange={(label) => update({ label })} error={error('label')} placeholder="Ej.: Ciudad" />
                <TextField label="Valor" value={item.value} onChange={(value) => update({ value })} error={error('value')} placeholder="Ej.: Medellín, Colombia" />
                <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
                <TextField
                  label="Enlace (opcional)"
                  hint="mailto:, tel: o https://"
                  value={item.href ?? ''}
                  onChange={(href) => update({ href })}
                  error={error('href')}
                />
              </div>
            )
          }}
        />
      </FormSection>

      <FormSection title="Redes sociales" description="Íconos del menú derecho. El proyecto pide como mínimo GitHub y LinkedIn.">
        <ListEditor<SocialLink>
          items={profile.socials}
          onChange={(socials) => onChange({ socials: socials as Keyed<SocialLink>[] })}
          createItem={() => ({ name: '', url: 'https://', icon: 'globe' })}
          itemTitle={(item) => item.name || 'Nueva red'}
          errorIndexes={errorIndexesFor(errors, 'profile.socials')}
          addLabel="Agregar red social"
          max={8}
          renderItem={(item, update, index) => {
            const error = (field: string) => errors.get(`profile.socials.${index}.${field}`)
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Nombre" value={item.name} onChange={(name) => update({ name })} error={error('name')} placeholder="Ej.: GitHub" />
                <IconSelect value={item.icon} onChange={(icon) => update({ icon })} />
                <TextField
                  label="URL"
                  value={item.url}
                  onChange={(url) => update({ url })}
                  error={error('url')}
                  placeholder="https://github.com/tu-usuario"
                  className="sm:col-span-2"
                />
              </div>
            )
          }}
        />
      </FormSection>
    </div>
  )
}
