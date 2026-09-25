'use client'

import { CONTENT_ICON_LABELS, CONTENT_ICON_NAMES, type IconName } from '@/lib/portafolio/icons'
import { Icon } from '../atoms'
import { SelectField } from '../atoms/FormFields'

const OPTIONS = CONTENT_ICON_NAMES.map((name) => ({ value: name as IconName, label: CONTENT_ICON_LABELS[name] }))

interface IconSelectProps {
  label?: string
  value: IconName
  onChange: (icon: IconName) => void
  className?: string
}

/** Molécula: selector de ícono con vista previa. */
export function IconSelect({ label = 'Ícono', value, onChange, className }: IconSelectProps) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      options={OPTIONS}
      className={className}
      adornment={
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cv-accent-soft text-[#9A6B00]">
          <Icon name={value} size={20} />
        </span>
      }
    />
  )
}
