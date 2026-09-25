'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/portafolio/atoms'

interface SignOutButtonProps {
  /** Si se pasa, se pide confirmación antes de salir (por ejemplo, con cambios sin guardar). */
  confirmMessage?: string
  /** En pantallas pequeñas muestra solo el ícono. */
  compact?: boolean
}

/** Cierra la sesión del editor y vuelve al portafolio público. */
export function SignOutButton({ confirmMessage, compact = false }: SignOutButtonProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const signOut = async () => {
    if (confirmMessage && !window.confirm(confirmMessage)) return
    setPending(true)
    await getSupabaseBrowserClient().auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      icon={pending ? 'loader' : 'logout'}
      iconPosition="left"
      onClick={() => void signOut()}
      disabled={pending}
      compactOnMobile={compact}
      aria-label={compact ? 'Cerrar sesión' : undefined}
    >
      Cerrar sesión
    </Button>
  )
}
