import type { Metadata } from 'next'
import { isSupabaseConfigured } from '@/lib/supabase'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión | Editor del portafolio',
  robots: { index: false, follow: false },
}

/**
 * /login — Inicio de sesión del editor de la hoja de vida.
 * Si ya hay una sesión activa, el middleware lleva directo a /portafolio/editar.
 */
export default function LoginPage() {
  return <LoginForm configured={isSupabaseConfigured} />
}
