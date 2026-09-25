'use client'

import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/portafolio/cn'

/**
 * Átomos de formulario del editor del portafolio.
 * Todos son "controlados": reciben `value` y avisan cada cambio con `onChange`.
 */

const CONTROL_CLASSES =
  'w-full rounded-md border border-cv-line bg-white px-3 py-2 text-[15px] text-cv-ink placeholder:text-cv-muted/70 ' +
  'transition focus:border-cv-accent focus:outline-none focus:ring-2 focus:ring-cv-accent/40 disabled:bg-cv-canvas'

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/** Estructura común: etiqueta, control, ayuda y error. */
function FieldShell({ id, label, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cv-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-cv-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface BaseFieldProps {
  label: string
  hint?: string
  error?: string
  className?: string
}

interface TextFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'url' | 'password'
  placeholder?: string
  maxLength?: number
  /** Ayuda al navegador a autocompletar (por ejemplo "email" o "current-password"). */
  autoComplete?: string
  required?: boolean
}

/** Campo de texto de una línea. */
export function TextField({
  label,
  hint,
  error,
  className,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  autoComplete,
  required,
}: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_CLASSES, error && 'border-red-400')}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  maxLength?: number
}

/** Campo de texto de varias líneas con contador de caracteres. */
export function TextAreaField({ label, hint, error, className, value, onChange, rows = 3, placeholder, maxLength }: TextAreaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_CLASSES, 'resize-y leading-relaxed', error && 'border-red-400')}
      />
      {maxLength && (
        <p className="mt-1 text-right text-xs tabular-nums text-cv-muted">
          {value.length}/{maxLength}
        </p>
      )}
    </FieldShell>
  )
}

interface NumberFieldProps extends BaseFieldProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

/** Campo numérico entero. */
export function NumberField({ label, hint, error, className, value, onChange, min, max }: NumberFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value === '' ? 0 : Math.round(Number(event.target.value)))}
        className={cn(CONTROL_CLASSES, 'tabular-nums', error && 'border-red-400')}
      />
    </FieldShell>
  )
}

interface RangeFieldProps extends BaseFieldProps {
  value: number
  onChange: (value: number) => void
}

/** Deslizador de 0 a 100 % para el nivel de dominio. */
export function RangeField({ label, hint, error, className, value, onChange }: RangeFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-[#FFB400]"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-cv-ink">{value}%</span>
      </div>
    </FieldShell>
  )
}

interface SelectFieldProps<T extends string> extends BaseFieldProps {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
  /** Contenido a la izquierda del select (por ejemplo, la vista previa de un ícono). */
  adornment?: ReactNode
}

/** Lista desplegable. */
export function SelectField<T extends string>({ label, hint, error, className, value, onChange, options, adornment }: SelectFieldProps<T>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="flex items-center gap-2">
        {adornment}
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={cn(CONTROL_CLASSES, 'cursor-pointer', error && 'border-red-400')}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </FieldShell>
  )
}

interface SwitchFieldProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

/** Interruptor de sí/no (por ejemplo "Visible en el sitio"). */
export function SwitchField({ label, description, checked, onChange, className }: SwitchFieldProps) {
  const id = useId()
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-2',
          checked ? 'bg-cv-success' : 'bg-cv-line',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-0.5')}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="block font-medium text-cv-ink">{label}</span>
        {description && <span className="block text-xs text-cv-muted">{description}</span>}
      </label>
    </div>
  )
}
