import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type BrowserClient = ReturnType<typeof createClientComponentClient>

/** true cuando existen las variables de entorno públicas de Supabase. */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

let browserClient: BrowserClient | null = null

/**
 * Cliente de Supabase para componentes del navegador (App Router).
 * Guarda la sesión en cookies, así el middleware y las páginas del servidor
 * reconocen a quien inició sesión en el editor. Lo usan el inicio de sesión,
 * el botón «Cerrar sesión» y la subida de fotos.
 *
 * Se crea en el primer uso (y no al importar el archivo) para que las páginas
 * se puedan mostrar aunque falten las variables de entorno.
 */
export function getSupabaseBrowserClient(): BrowserClient {
  if (!browserClient) browserClient = createClientComponentClient()
  return browserClient
}
