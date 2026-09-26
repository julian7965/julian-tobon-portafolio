import { Button, Icon } from '@/components/portafolio/atoms'
import { SignOutButton } from './SignOutButton'

interface EditorNoticeProps {
  kind: 'forbidden' | 'setup' | 'env'
  email?: string
  /** Detalle técnico del error (solo para configuración). */
  detail?: string
  /** Muestra «Cerrar sesión» (no aplica si Supabase ni siquiera está configurado). */
  showSignOut?: boolean
}

const COPY = {
  forbidden: {
    title: 'Tu cuenta no está autorizada para editar',
    text: 'Solo los correos registrados en la tabla cv_editores de Supabase pueden editar la hoja de vida. Para autorizar esta cuenta, ejecuta en el SQL Editor de Supabase:',
  },
  setup: {
    title: 'Falta configurar la base de datos',
    text: 'Ejecuta el script supabase/portafolio_cv.sql en el SQL Editor de Supabase y vuelve a cargar esta página.',
  },
  env: {
    title: 'Faltan las variables de Supabase',
    text: 'Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel (Settings → Environment Variables) o en el archivo .env.local, y vuelve a desplegar el sitio.',
  },
} as const

/** Aviso a pantalla completa cuando el editor no se puede usar (cuenta sin permiso, base de datos o variables sin configurar). */
export function EditorNotice({ kind, email, detail, showSignOut = true }: EditorNoticeProps) {
  const copy = COPY[kind]
  // Correo escapado para mostrarlo dentro de la instrucción SQL.
  const sqlEmail = (email ?? 'tu-correo@ejemplo.com').toLowerCase().replace(/'/g, "''")

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-cv-ink">
      <div className="w-full max-w-md rounded-xl border border-cv-line p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cv-accent-soft text-[#9A6B00]">
          <Icon name={kind === 'forbidden' ? 'lock' : 'alert'} size={26} />
        </span>
        <h1 className="mt-5 text-xl font-bold">{copy.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-cv-muted">{copy.text}</p>
        {kind === 'forbidden' && (
          <p className="mt-3 break-words rounded-md bg-cv-canvas px-3 py-2 text-left font-mono text-xs text-cv-ink">
            insert into public.cv_editores (email) values (&apos;{sqlEmail}&apos;);
          </p>
        )}
        {email && <p className="mt-3 text-sm text-cv-muted">Sesión actual: {email}</p>}
        {detail && (
          <p className="mt-4 break-words rounded-md bg-cv-canvas px-3 py-2 text-left font-mono text-xs text-cv-muted">{detail}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/" size="sm">
            Ir al portafolio
          </Button>
          {showSignOut && <SignOutButton />}
        </div>
      </div>
    </main>
  )
}
