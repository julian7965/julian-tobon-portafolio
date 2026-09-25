import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Editor de la hoja de vida (requiere sesión). */
const EDITOR_PATH = '/portafolio/editar'
/** Inicio de sesión del editor. */
const LOGIN_PATH = '/login'

/**
 * Middleware de autenticación del editor.
 *  - Mantiene al día la sesión de Supabase (cookies) en /login y /portafolio/editar.
 *  - Sin sesión, /portafolio/editar redirige a /login.
 *  - Con sesión, /login lleva directo al editor.
 * El portafolio público ("/") y sus imágenes (/portafolio/*.svg, etc.) no pasan por aquí
 * (ver `config.matcher`), así la página sigue siendo estática y rápida.
 */
export async function middleware(req: NextRequest) {
  // Sin variables de Supabase no hay sesión que revisar: las páginas muestran el aviso de configuración.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  if (!session && pathname.startsWith(EDITOR_PATH)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url))
  }

  if (session && pathname === LOGIN_PATH) {
    return NextResponse.redirect(new URL(EDITOR_PATH, req.url))
  }

  return res
}

export const config = {
  // '/portafolio/editar/:path*' también incluye '/portafolio/editar'.
  matcher: ['/login', '/portafolio/editar/:path*'],
}
