'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Button, Icon } from '@/components/portafolio/atoms'
import { TextField } from '@/components/portafolio/atoms/FormFields'

/** Traduce los errores de Supabase Auth a mensajes claros en español. */
function loginErrorMessage(error: { message?: string; status?: number; name?: string }): string {
  const message = (error.message ?? '').toLowerCase()
  if (message.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (message.includes('email not confirmed')) return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.'
  if (error.name === 'AuthRetryableFetchError' || message.includes('fetch')) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
  }
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.'
}

interface LoginFormProps {
  /** false si faltan las variables de entorno de Supabase. */
  configured: boolean
}

/**
 * Formulario de inicio de sesión del editor (nivel "página" de atomic design).
 * Usa los mismos átomos del portafolio (TextField, Button, Icon) y, al entrar,
 * lleva al editor /portafolio/editar.
 */
export function LoginForm({ configured }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Escribe tu correo y tu contraseña.')
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await getSupabaseBrowserClient().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (authError) {
        setError(loginErrorMessage(authError))
        setLoading(false)
        return
      }
      // La sesión queda en cookies: el editor la lee en el servidor.
      router.replace('/portafolio/editar')
      router.refresh()
    } catch (caught) {
      setError(loginErrorMessage(caught as Error))
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cv-canvas px-4 py-10 text-cv-ink">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-cv-card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cv-accent text-cv-ink">
            <Icon name="edit" size={24} />
          </span>
          <h1 className="mt-5 text-center text-2xl font-bold">Editar portafolio</h1>
          <p className="mt-2 text-center text-[15px] leading-relaxed text-cv-muted">
            Inicia sesión con la cuenta autorizada para editar la hoja de vida.
          </p>

          {configured ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <TextField
                label="Correo"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder="tu-correo@ejemplo.com"
                required
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                required
              />

              {error && (
                <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading} icon={loading ? 'loader' : 'arrow-right'}>
                {loading ? 'Ingresando…' : 'Iniciar sesión'}
              </Button>
            </form>
          ) : (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              El editor no está configurado: faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL y
              NEXT_PUBLIC_SUPABASE_ANON_KEY.
            </p>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-cv-ink underline-offset-4 hover:underline">
            ← Volver al portafolio
          </Link>
        </p>
      </div>
    </main>
  )
}
