/**
 * next/image no optimiza SVG por seguridad y necesita configuración extra para
 * dominios externos. Para esos casos se sirve la imagen tal cual (unoptimized).
 */
export function shouldSkipOptimization(src: string): boolean {
  return src.toLowerCase().endsWith('.svg') || /^https?:\/\//i.test(src)
}
