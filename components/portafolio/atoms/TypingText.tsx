'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface TypingTextProps {
  /** Frases que se escriben y borran en ciclo. */
  words: string[]
  className?: string
}

const TYPE_MS = 70
const DELETE_MS = 35
const HOLD_MS = 1800

/**
 * Átomo con efecto "máquina de escribir". Arranca mostrando la primera frase
 * completa (buena para SEO y sin saltos de diseño) y luego rota las demás.
 * Los lectores de pantalla reciben todas las frases en texto oculto.
 */
export function TypingText({ words, className }: TypingTextProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState(words[0] ?? '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reducedMotion || words.length < 2) return

    const current = words[wordIndex]
    let delay = deleting ? DELETE_MS : TYPE_MS
    if (!deleting && text === current) delay = HOLD_MS

    const timer = window.setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setWordIndex((index) => (index + 1) % words.length)
      } else {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [text, deleting, wordIndex, words, reducedMotion])

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">
        {text}
        <span className="ml-0.5 inline-block w-[3px] animate-cv-blink bg-cv-accent align-baseline motion-reduce:hidden">
          &nbsp;
        </span>
      </span>
    </span>
  )
}
