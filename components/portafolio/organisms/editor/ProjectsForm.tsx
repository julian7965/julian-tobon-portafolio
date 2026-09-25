'use client'

import type { EditableProject } from '@/lib/portafolio/types'
import { slugify, uniqueSlug } from '@/lib/portafolio/slug'
import { Badge } from '../../atoms'
import { SwitchField, TextAreaField, TextField } from '../../atoms/FormFields'
import { ImageUploadField } from '../../molecules/ImageUploadField'
import { ListEditor, type Keyed } from '../../molecules/ListEditor'
import { StringListEditor } from '../../molecules/StringListEditor'
import { errorIndexesFor, type FieldErrors } from './editor-draft'
import { FormSection } from './FormSection'

interface ProjectsFormProps {
  items: Keyed<EditableProject>[]
  onChange: (items: Keyed<EditableProject>[]) => void
  errors: FieldErrors
}

/** Organismo del editor: proyectos del portafolio (tarjeta + diálogo «Saber más»). */
export function ProjectsForm({ items, onChange, errors }: ProjectsFormProps) {
  /** Identificadores usados por los demás proyectos (para no repetirlos). */
  const idsExcept = (key: string) => new Set(items.filter((item) => item._key !== key).map((item) => item.id))

  return (
    <FormSection
      title="Proyectos"
      description="Cada proyecto necesita imagen, título y resumen; el detalle aparece en el diálogo «Saber más». Toca un proyecto para abrirlo."
    >
      <ListEditor<EditableProject>
        items={items}
        onChange={(next) => onChange(next as Keyed<EditableProject>[])}
        createItem={() => ({
          id: '',
          title: '',
          summary: '',
          description: '',
          image: '',
          technologies: [],
          highlights: [],
          visible: true,
        })}
        itemTitle={(item) => item.title || 'Proyecto sin título'}
        itemBadge={(item) => (item.visible ? null : <Badge>Oculto</Badge>)}
        errorIndexes={errorIndexesFor(errors, 'projects')}
        addLabel="Agregar proyecto"
        max={20}
        collapsible
        renderItem={(item, update, index) => {
          const error = (field: string) => errors.get(`projects.${index}.${field}`)

          // Mientras el identificador siga "sincronizado" con el título, se actualiza solo.
          const changeTitle = (title: string) => {
            const synced = !item.id || item.id === slugify(item.title)
            update(synced ? { title, id: uniqueSlug(title, idsExcept(item._key)) } : { title })
          }

          return (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Título" value={item.title} onChange={changeTitle} error={error('title')} maxLength={80} />
                <TextField
                  label="Identificador"
                  hint="Solo minúsculas, números y guiones. Se genera con el título."
                  value={item.id}
                  onChange={(id) => update({ id: id.toLowerCase() })}
                  error={error('id')}
                  maxLength={60}
                />
                <TextAreaField
                  label="Resumen (tarjeta)"
                  value={item.summary}
                  onChange={(summary) => update({ summary })}
                  error={error('summary')}
                  rows={2}
                  maxLength={240}
                  className="sm:col-span-2"
                />
                <TextAreaField
                  label="Descripción (diálogo «Saber más»)"
                  value={item.description}
                  onChange={(description) => update({ description })}
                  error={error('description')}
                  rows={4}
                  maxLength={2000}
                  className="sm:col-span-2"
                />
              </div>

              <ImageUploadField
                label="Imagen del proyecto"
                value={item.image}
                onChange={(image) => update({ image })}
                folder="proyectos"
                error={error('image')}
              />

              <div className="space-y-5">
                <StringListEditor
                  label="Tecnologías"
                  items={item.technologies}
                  onChange={(technologies) => update({ technologies })}
                  addLabel="Agregar tecnología"
                  placeholder="Ej.: Next.js"
                  max={12}
                  error={error('technologies')}
                  itemError={(row) => error(`technologies.${row}`)}
                />
                <StringListEditor
                  label="Logros"
                  items={item.highlights}
                  onChange={(highlights) => update({ highlights })}
                  addLabel="Agregar logro"
                  max={10}
                  error={error('highlights')}
                  itemError={(row) => error(`highlights.${row}`)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Enlace al código (opcional)"
                  hint="Ej.: https://github.com/usuario/proyecto"
                  value={item.repoUrl ?? ''}
                  onChange={(repoUrl) => update({ repoUrl })}
                  error={error('repoUrl')}
                />
                <TextField
                  label="Enlace a la demo (opcional)"
                  hint="Una URL https:// o una ruta del sitio que empiece por /"
                  value={item.demoUrl ?? ''}
                  onChange={(demoUrl) => update({ demoUrl })}
                  error={error('demoUrl')}
                />
                <TextField
                  label="Nota si el código es privado (opcional)"
                  value={item.privateNote ?? ''}
                  onChange={(privateNote) => update({ privateNote })}
                  error={error('privateNote')}
                  maxLength={160}
                  className="sm:col-span-2"
                />
              </div>

              <SwitchField label="Visible en el sitio" checked={item.visible} onChange={(visible) => update({ visible })} />
            </div>
          )
        }}
      />
    </FormSection>
  )
}
