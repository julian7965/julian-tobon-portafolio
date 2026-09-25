import type { IconName } from './icons'

/** Secciones del contenido central. El menú derecho las usa para navegar (scroll spy). */
export const SECTIONS: ReadonlyArray<{ id: string; label: string; icon: IconName }> = [
  { id: 'perfil', label: 'Perfil', icon: 'user' },
  { id: 'conocimientos', label: 'Conocimientos', icon: 'layers' },
  { id: 'educacion', label: 'Educación', icon: 'graduation' },
  { id: 'portafolio', label: 'Portafolio', icon: 'briefcase' },
]
