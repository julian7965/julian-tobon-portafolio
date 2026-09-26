'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Button, Icon } from '@/components/portafolio/atoms'
import { TextField } from '@/components/portafolio/atoms/FormFields'

type Mode = 'login' | 'register'

type AuthErrorLike = { message?: string; name?: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

const NETWORK_ERROR = 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'

const isNetworkError = (error: AuthErrorLike) =>
  error.name === 'AuthRetryableFetchError' || (error.message ?? '').toLowerCase().includes('fetch')

/** Traduce los errores de inicio de sesión de Supabase Auth a mensajes claros en español. */
function loginErrorMessage(error: AuthErrorLike): string {
  const message = (error.message ?? '').toLowerCase()
  if (message.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (message.includes('email not confirmed')) return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.'
  if (isNetworkError(error)) return NETWORK_ERROR
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.'
}

/** Traduce los errores de registro de Supabase Auth a mensajes claros en español. */
function registerErrorMessage(error: AuthErrorLike): string {
  const message = (error.message ?? '').toLowerCase()
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Ese correo ya tiene una cuenta. Inicia sesión.'
  }
  if (/signups? (are |is )?(not allowed|disabled)/.test(message)) {
    return 'El registro de cuentas está desactivado en Supabase.'
  }
  if (message.includes('rate limit')) return 'Se enviaron demasiados correos. Espera unos minutos e inténtalo de nuevo.'
  if (message.includes('password')) return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  if (message.includes('email')) return 'El correo no es válido.'
  if (isNetworkError(error)) return NETWORK_ERROR
  return 'No se pudo crear la cuenta. Inténtalo de nuevo.'
}

/** Mensaje para el error que Supabase agrega a la URL (#error=…) cuando el enlace del correo falla. */
function linkErrorMessage(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  if (!params.get('error')) return ''
  return params.get('error_code') === 'otp_expired'
    ? 'El enlace de confirmación expiró. Crea la cuenta de nuevo para recibir otro correo.'
    : 'El enlace de confirmación no es válido. Intenta iniciar sesión o crea la cuenta de nuevo.'
}

const COPY = {
  login: {
    title: 'Editar portafolio',
    text: 'Inicia sesión con la cuenta autorizada para editar la hoja de vida.',
    submit: 'Iniciar sesión',
    loading: 'Ingresando…',
    switchText: '¿No tienes cuenta?',
    switchAction: 'Crear cuenta',
  },
  register: {
    title: 'Crear cuenta',
    text: 'Regístrate con tu correo. Solo los correos autorizados pueden editar la hoja de vida.',
    submit: 'Crear cuenta',
    loading: 'Creando cuenta…',
    switchText: '¿Ya tienes cuenta?',
    switchAction: 'Inicia sesión',
  },
} as const

interface LoginFormProps {
  /** false si faltan las variables de entorno de Supabase. */
  configured: boolean
}

/**
 * Inicio de sesión y registro del editor (nivel "página" de atomic design).
 * Usa los mismos átomos del portafolio (TextField, Button, Icon):
 *  - Iniciar sesión lleva al editor /portafolio/editar.
 *  - Crear cuenta registra el correo en Supabase Auth; si el proyecto pide confirmar
 *    el correo, el enlace del mensaje vuelve por /auth/callback.
 * Registrarse no da permiso de edición: el correo debe estar en la tabla cv_editores.
 */
export function LoginForm({ configured }: LoginFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Avisos que llegan en la URL: correo confirmado (?confirmado=1) o enlace vencido (#error=…).
  useEffect(() => {
    const { search, hash } = window.location
    if (new URLSearchParams(search).get('confirmado') === '1') {
      setNotice('Tu correo quedó confirmado. Inicia sesión para continuar.')
    }
    const hashError = linkErrorMessage(hash)
    if (hashError) setError(hashError)
    if (search || hash) window.history.replaceState(null, '', '/login')
  }, [])

  const copy = COPY[mode]

  const switchMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError('')
    setNotice('')
    setPassword('')
    setConfirmPassword('')
  }

  const signIn = async (normalizedEmail: string) => {
    const { error: authError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: normalizedEmail,
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
  }

  const signUp = async (normalizedEmail: string) => {
    const { data, error: authError } = await getSupabaseBrowserClient().auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (authError) {
      setError(registerErrorMessage(authError))
      setLoading(false)
      return
    }
    // Sin confirmación por correo, Supabase inicia la sesión de una vez.
    if (data.session) {
      router.replace('/portafolio/editar')
      router.refresh()
      return
    }
    // Supabase responde sin identidades cuando el correo ya estaba registrado.
    if (data.user && data.user.identities?.length === 0) {
      setError('Ese correo ya tiene una cuenta. Inicia sesión.')
      setLoading(false)
      return
    }
    setMode('login')
    setPassword('')
    setConfirmPassword('')
    setNotice(`Te enviamos un correo a ${normalizedEmail}. Abre el enlace para confirmar la cuenta y luego inicia sesión.`)
    setLoading(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      setError('Escribe tu correo y tu contraseña.')
      return
    }
    if (mode === 'register') {
      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        setError('Escribe un correo válido.')
        return
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`)
        return
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'login') await signIn(normalizedEmail)
      else await signUp(normalizedEmail)
    } catch (caught) {
      setError(mode === 'login' ? loginErrorMessage(caught as Error) : registerErrorMessage(caught as Error))
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
          <h1 className="mt-5 text-center text-2xl font-bold">{copy.title}</h1>
          <p className="mt-2 text-center text-[15px] leading-relaxed text-cv-muted">{copy.text}</p>

          {configured ? (
            <>
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
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  hint={mode === 'register' ? `Mínimo ${MIN_PASSWORD_LENGTH} caracteres.` : undefined}
                  required
                />
                {mode === 'register' && (
                  <TextField
                    label="Confirmar contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    required
                  />
                )}

                {notice && (
                  <p className="flex items-start gap-2 rounded-lg bg-[#EAF5E1] px-3 py-2 text-sm text-cv-success-text" role="status">
                    <Icon name="check-circle" size={16} className="mt-0.5 shrink-0" />
                    {notice}
                  </p>
                )}
                {error && (
                  <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                    <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading} icon={loading ? 'loader' : 'arrow-right'}>
                  {loading ? copy.loading : copy.submit}
                </Button>
              </form>

              <p className="mt-6 border-t border-cv-line pt-5 text-center text-sm text-cv-muted">
                {copy.switchText}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="rounded font-semibold text-cv-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent"
                >
                  {copy.switchAction}
                </button>
              </p>
            </>
          ) : (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              El editor no está configurado: agrega las variables NEXT_PUBLIC_SUPABASE_URL y
              NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel (o en .env.local) y vuelve a desplegar el sitio.
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
