import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Briefcase,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Globe,
  GraduationCap,
  ImageIcon,
  Landmark,
  Layers,
  Linkedin,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  PencilLine,
  Phone,
  Plus,
  Save,
  Send,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Undo2,
  Upload,
  User,
  Workflow,
  X,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { IconName } from '@/lib/portafolio/icons'

/**
 * Ícono propio "pipeline" (dos fuentes de datos que se integran en un destino),
 * dibujado a mano en SVG. Sigue la misma interfaz que los íconos de lucide
 * (tamaño, color con currentColor y grosor de trazo) para poder intercambiarlos.
 */
function PipelineIcon({ size = 24, strokeWidth = 1.75, className, ...rest }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <rect x="15" y="8.5" width="7" height="7" rx="1.5" />
      <path d="M7.5 5H9.5a2.5 2.5 0 0 1 2.5 2.5V9.5A2.5 2.5 0 0 0 14.5 12H15" />
      <path d="M7.5 19H9.5a2.5 2.5 0 0 0 2.5-2.5V14.5A2.5 2.5 0 0 1 14.5 12" />
      <path d="M17.5 12h2" />
    </svg>
  )
}

/** Tabla de traducción nombre → componente SVG. */
const ICONS: Record<IconName, ComponentType<LucideProps>> = {
  bank: Landmark,
  briefcase: Briefcase,
  chart: BarChart3,
  check: CheckSquare,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  database: Database,
  github: Github,
  globe: Globe,
  graduation: GraduationCap,
  layers: Layers,
  linkedin: Linkedin,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
  server: Server,
  shield: ShieldCheck,
  sparkles: Sparkles,
  terminal: Terminal,
  user: User,
  pipeline: PipelineIcon,
  workflow: Workflow,
  alert: AlertTriangle,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'check-circle': CheckCircle2,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  close: X,
  copy: Copy,
  edit: PencilLine,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  image: ImageIcon,
  loader: Loader2,
  lock: Lock,
  logout: LogOut,
  menu: Menu,
  plus: Plus,
  save: Save,
  send: Send,
  share: Share2,
  trash: Trash2,
  undo: Undo2,
  upload: Upload,
}

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

/**
 * Átomo de ícono: recibe un nombre y dibuja el SVG correspondiente.
 * Es decorativo por defecto (aria-hidden); el texto accesible lo pone el componente padre.
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, ...rest }: IconProps) {
  const SvgIcon = ICONS[name] ?? Sparkles
  return <SvgIcon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />
}
