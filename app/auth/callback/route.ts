import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'

/** Dominio con el que el visitante abrió el sitio (en Vercel llega en x-forwarded-host). */
function siteOrigin(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!host) return request.nextUrl.origin
  const protocol = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '')
  return `${protocol}://${host}`
}

/**
 * /auth/callback — destino del enlace de confirmación que Supabase envía por correo
 * al crear una cuenta desde /login.
 *
 * Supabase confirma el correo y llega aquí con un código de un solo uso (?code=…),
 * que se cambia por una sesión para entrar directo al editor. Si no se puede (por
 * ejemplo, el enlace se abrió en otro navegador), la cuenta igual quedó confirmada:
 * se envía al inicio de sesión con un aviso.
 */
export async function GET(request: NextRequest) {
  const origin = siteOrigin(request)
  const code = request.nextUrl.searchParams.get('code')

  // Sin código (enlace vencido o inválido): el error viaja en el #hash y lo muestra /login.
  if (!code || !isSupabaseConfigured) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(new URL(error ? '/login?confirmado=1' : '/portafolio/editar', origin))
}
