import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Julián Tobón | Hoja de vida',
  description: 'Hoja de vida y portafolio de Julián Tobón, arquitecto de datos y desarrollador fullstack.',
}

/**
 * Layout raíz: idioma, tipografía Inter y estilos globales.
 * Cada página (portafolio, inicio de sesión y editor) define su propia estructura.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
