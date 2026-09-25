'use client'

import { NumberField, SwitchField, TextAreaField, TextField } from '../../atoms/FormFields'
import { ImageUploadField } from '../../molecules/ImageUploadField'
import { StringListEditor } from '../../molecules/StringListEditor'
import type { EditorProfile, FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface ProfileFormProps {
  profile: EditorProfile
  onChange: (patch: Partial<EditorProfile>) => void
  errors: FieldErrors
}

/** Organismo del editor: datos personales, foto, sección Perfil y disponibilidad. */
export function ProfileForm({ profile, onChange, errors }: ProfileFormProps) {
  const error = (field: string) => errors.get(`profile.${field}`)

  return (
    <div className="space-y-6">
      <FormSection title="Información personal" description="Se muestra en el menú izquierdo y en el diálogo «Conóceme».">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nombre completo"
            value={profile.fullName}
            onChange={(fullName) => onChange({ fullName })}
            error={error('fullName')}
            maxLength={120}
          />
          <TextField
            label="Nombre corto"
            hint="Aparece en el menú, la sección Perfil y el título de la página."
            value={profile.displayName}
            onChange={(displayName) => onChange({ displayName })}
            error={error('displayName')}
            maxLength={60}
          />
          <TextField
            label="Título profesional"
            hint="Ej.: Ingeniero de sistemas · Desarrollador fullstack"
            value={profile.title}
            onChange={(title) => onChange({ title })}
            error={error('title')}
            maxLength={120}
            className="sm:col-span-2"
          />
          <TextField
            label="Correo de contacto"
            type="email"
            hint="Lo usan los botones «Escríbeme» y «Copiar correo»."
            value={profile.email}
            onChange={(email) => onChange({ email })}
            error={error('email')}
            maxLength={120}
          />
          <NumberField
            label="Años de experiencia"
            value={profile.yearsOfExperience}
            onChange={(yearsOfExperience) => onChange({ yearsOfExperience })}
            error={error('yearsOfExperience')}
            min={0}
            max={60}
          />
        </div>
      </FormSection>

      <FormSection title="Foto" description="Idealmente con fondo blanco o transparente. JPG, PNG o WebP de máximo 5 MB.">
        <ImageUploadField
          label="Foto de perfil"
          value={profile.photo}
          onChange={(photo) => onChange({ photo })}
          folder="perfil"
          shape="circle"
          error={error('photo')}
        />
      </FormSection>

      <FormSection title="Sección Perfil" description="Contenido de la tarjeta principal y del diálogo «Conóceme».">
        <StringListEditor
          label="Roles"
          hint="Se escriben uno tras otro con el efecto de máquina de escribir."
          items={profile.roles}
          onChange={(roles) => onChange({ roles })}
          addLabel="Agregar rol"
          placeholder="Ej.: Desarrollador fullstack"
          max={8}
          error={error('roles')}
          itemError={(index) => error(`roles.${index}`)}
        />
        <TextAreaField
          label="Resumen profesional"
          value={profile.summary}
          onChange={(summary) => onChange({ summary })}
          error={error('summary')}
          rows={4}
          maxLength={600}
        />
        <StringListEditor
          label="Sobre mí"
          hint="Párrafos del diálogo «Conóceme»."
          items={profile.about}
          onChange={(about) => onChange({ about })}
          addLabel="Agregar párrafo"
          max={6}
          multiline
          error={error('about')}
          itemError={(index) => error(`about.${index}`)}
        />
      </FormSection>

      <FormSection title="Disponibilidad">
        <SwitchField
          label="Mostrar como disponible"
          description="Muestra el punto verde y la etiqueta en el perfil."
          checked={profile.availability.available}
          onChange={(available) => onChange({ availability: { ...profile.availability, available } })}
        />
        <TextField
          label="Texto de disponibilidad"
          value={profile.availability.label}
          onChange={(label) => onChange({ availability: { ...profile.availability, label } })}
          error={error('availability.label')}
          placeholder="Ej.: Abierto a nuevos retos"
          maxLength={60}
        />
      </FormSection>
    </div>
  )
}
