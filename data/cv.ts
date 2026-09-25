/**
 * ============================================================================
 *  ✏️  ARCHIVO EDITABLE DE LA HOJA DE VIDA
 * ============================================================================
 *
 *  Contenido INICIAL y DE RESPALDO del portafolio.
 *
 *  La forma recomendada de editar la hoja de vida es el editor de la app:
 *  /portafolio/editar (botón «Editar» del sitio; pide iniciar sesión). Guarda en
 *  Supabase (tablas cv_perfil, cv_conocimientos, cv_educacion y cv_proyectos)
 *  y el sitio se actualiza al instante.
 *
 *  Este archivo se usa:
 *   1. Como respaldo si Supabase no está configurado, no responde o una tabla
 *      está vacía (el sitio nunca se cae por la base de datos).
 *   2. Como contenido inicial: supabase/portafolio_cv.sql inserta estos mismos
 *      datos la primera vez.
 *
 *  Si editas desde la app, no necesitas tocar este archivo. Marcadores que
 *  conviene reemplazar (en el editor o aquí): foto, correo, teléfono, enlaces
 *  de GitHub y LinkedIn, porcentajes de idiomas y lenguajes, e institución y
 *  fechas de cada entrada de educación.
 * ============================================================================
 */
import type { EducationEntry, Knowledge, Profile, Project } from '@/lib/portafolio/types'

// Marcadores: cámbialos por tus datos reales.
const EMAIL = 'tu-correo@ejemplo.com'
const PHONE_DISPLAY = '+57 300 000 0000'
const PHONE_LINK = 'tel:+573000000000'
const GITHUB_URL = 'https://github.com/tu-usuario'
const LINKEDIN_URL = 'https://www.linkedin.com/in/tu-usuario'

export const profile: Profile = {
  fullName: 'Julián De Jesús Tobón Botero',
  displayName: 'Julián Tobón',
  title: 'Arquitecto de datos · Desarrollador fullstack',
  roles: ['Arquitecto de datos', 'Desarrollador fullstack', 'Consultor de core bancario'],
  summary:
    'Más de 6 años creando soluciones de datos y software para banca y empresas. Conecto el core bancario, las bases de datos y la web para que la información llegue completa, confiable y a tiempo.',
  about: [
    'Me muevo en la intersección entre los datos, los sistemas bancarios y el desarrollo web. Actualmente colaboro con Banco Actinver (México), donde diseño mapeos de datos entre Oracle FLEXCUBE y los reportes regulatorios de la CNBV y Banxico.',
    'También construyo productos web de punta a punta con Next.js, TypeScript y Supabase, y automatizo tareas de bases de datos con Python y PL/SQL. Vivo en Medellín y estudio Ingeniería de Sistemas.',
  ],
  // Reemplaza por tu foto (idealmente con fondo blanco o transparente), p. ej. '/portafolio/perfil.jpg'
  photo: '/portafolio/perfil.svg',
  availability: { available: true, label: 'Abierto a nuevos retos' },
  contact: [
    { label: 'Ciudad', value: 'Medellín, Colombia', icon: 'map-pin' },
    { label: 'Correo', value: EMAIL, icon: 'mail', href: `mailto:${EMAIL}` },
    { label: 'Teléfono', value: PHONE_DISPLAY, icon: 'phone', href: PHONE_LINK },
    { label: 'Experiencia', value: '6+ años', icon: 'briefcase' },
  ],
  languages: [
    { name: 'Español', level: 100, note: 'Nativo' },
    { name: 'Inglés', level: 70, note: 'Intermedio' },
  ],
  programmingLanguages: [
    { name: 'SQL · PL/SQL', level: 95 },
    { name: 'Python', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'Java', level: 80 },
    { name: 'TypeScript', level: 75 },
  ],
  extraSkills: [
    'Power BI y DAX',
    'Oracle FLEXCUBE',
    'Supabase y PostgreSQL',
    'ETL y PySpark',
    'Git, Jira y metodologías ágiles',
    'Vercel, Railway y Cloudflare',
    'Comunicación clara y trabajo en equipo',
  ],
  socials: [
    { name: 'GitHub', url: GITHUB_URL, icon: 'github' },
    { name: 'LinkedIn', url: LINKEDIN_URL, icon: 'linkedin' },
    { name: 'Correo', url: `mailto:${EMAIL}`, icon: 'mail' },
  ],
  companies: [
    'Banco Actinver',
    'GFT Technologies',
    'Stefanini',
    'Sophos Solutions',
    'Tata Consultancy Services',
    'Michael Page',
    'Universidad de Antioquia',
  ],
  yearsOfExperience: 6,
  email: EMAIL,
}

/** Respaldo local de la tabla cv_conocimientos. */
export const knowledge: Knowledge[] = [
  {
    id: 'arquitectura-datos',
    title: 'Arquitectura de datos',
    description: 'Modelado, ETL, cargas incrementales y gobierno de datos.',
    icon: 'pipeline',
  },
  {
    id: 'core-bancario',
    title: 'Core bancario',
    description: 'Oracle FLEXCUBE: cuentas, préstamos, depósitos y pagos.',
    icon: 'bank',
  },
  {
    id: 'reportes-regulatorios',
    title: 'Reportes regulatorios',
    description: 'Mapeos de datos para la CNBV, Banxico y el IPAB.',
    icon: 'shield',
  },
  {
    id: 'desarrollo-fullstack',
    title: 'Desarrollo fullstack',
    description: 'Next.js, React, TypeScript, Java y Python.',
    icon: 'code',
  },
  {
    id: 'inteligencia-negocios',
    title: 'Inteligencia de negocios',
    description: 'Power BI, DAX y modelos en estrella.',
    icon: 'chart',
  },
  {
    id: 'cloud-bases-datos',
    title: 'Cloud y bases de datos',
    description: 'Supabase, PostgreSQL, Oracle, Vercel y Railway.',
    icon: 'cloud',
  },
]

/** Respaldo local de la tabla cv_educacion. */
export const education: EducationEntry[] = [
  {
    id: 'ingenieria-sistemas',
    institution: 'Tu universidad',
    degree: 'Ingeniería de Sistemas',
    status: 'En curso',
    period: 'Año de inicio – Actualidad',
    description:
      'Arquitectura de software (hexagonal, por capas y microservicios), bases de datos y PostgreSQL, redes, gobierno de datos e inteligencia de negocios con Power BI.',
  },
  {
    id: 'formacion-complementaria',
    institution: 'Plataforma o institución',
    degree: 'Curso o certificación',
    status: 'Certificado',
    period: 'Año',
    description:
      'Describe aquí un curso o una certificación relevante, por ejemplo de Oracle, Power BI o servicios en la nube.',
  },
  {
    id: 'bachillerato',
    institution: 'Tu colegio',
    degree: 'Bachiller académico',
    status: 'Graduado',
    period: 'Año de grado',
    description: 'Formación secundaria. Puedes mencionar aquí el énfasis o un logro destacado.',
  },
]

/** Respaldo local de la tabla cv_proyectos. */
export const projects: Project[] = [
  {
    id: 'prestamosv',
    title: 'Prestamosv',
    summary: 'Sistema web para gestionar clientes, préstamos, pagos y liquidaciones.',
    description:
      'Plataforma para prestamistas que centraliza toda la cartera: clientes con sus documentos, préstamos con cálculo automático de intereses y cuotas, pagos con recibo, refinanciaciones, reportes y liquidación por prestamista, con acceso protegido por inicio de sesión.',
    image: '/portafolio/proyectos/prestamosv.png',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    highlights: [
      'Autenticación con roles (administrador, prestamista y operador) y políticas RLS.',
      'Cálculo automático de intereses y cuotas, y saldos actualizados con disparadores (triggers) de PostgreSQL.',
      'Reportes exportables a CSV y PDF, y liquidación por prestamista.',
      'Recibos imprimibles e indicadores de cartera en el panel principal.',
    ],
    // El repositorio es privado: solo se enlaza la demo en producción.
    demoUrl: 'https://prestamosv.vercel.app/login',
  },
  {
    id: 'antares-portal',
    title: 'Antares Portal',
    summary: 'Portal de gestión logística y de talento humano para una empresa de transporte.',
    description:
      'Sistema web para una empresa de transporte en Colombia con nómina, directorio de empleados, módulos de recursos humanos y flujos de aprobación. Diseñé la arquitectura y el modelo de datos, y reorganicé el código base en módulos a lo largo de 25 fases.',
    image: '/portafolio/proyectos/antares.svg',
    technologies: ['JavaScript (ES Modules)', 'HTML y CSS', 'PostgreSQL', 'Supabase', 'Render'],
    highlights: [
      'Reorganización en módulos de más de 48\u00A0000 líneas de JavaScript, en 25 fases.',
      'Rediseño de la nómina, el directorio de empleados y los módulos de RR. HH.',
      'Arquitectura, modelo entidad-relación y flujos de aprobación.',
      'Conexión estable a PostgreSQL desde Render mediante Session Pooler.',
    ],
    privateNote: 'Proyecto para un cliente: el código es privado.',
  },
  {
    id: 'mapeo-regulatorio',
    title: 'Mapeo regulatorio FLEXCUBE',
    summary: 'Mapeos de datos del core bancario hacia reportes de la CNBV, Banxico y el IPAB.',
    description:
      'Mapeos campo a campo entre Oracle FLEXCUBE Universal Banking v14, con el esquema personalizado del banco, y los reportes regulatorios mexicanos. Cada campo se documenta con su origen, su transformación y su nivel de confianza, y se valida contra reportes reales ya presentados.',
    image: '/portafolio/proyectos/regulatorio.svg',
    technologies: ['Oracle FLEXCUBE v14', 'SQL · PL/SQL', 'Excel', 'Jira'],
    highlights: [
      'Libros de mapeo con niveles de confianza: confirmado, pendiente y por verificar.',
      'Validaciones cruzadas contra datos reales de producción.',
      'Reportes como el Catálogo Mínimo, IPAB, SISPAGOS y el reporte diario de liquidez de Banxico.',
      'Hallazgos que corrigieron errores de plazo y de moneda en los mapeos hacia Banxico.',
    ],
    privateNote: 'Proyecto corporativo confidencial.',
  },
  {
    id: 'migracion-flexcube-sap',
    title: 'Migración FLEXCUBE → SAP',
    summary: 'Documentación de funciones y mapeo de campos entre FLEXCUBE y SAP.',
    description:
      'Documentación sistemática de pantallas y funciones de FLEXCUBE (cuentas, clientes, préstamos y sucursales) y mapeo de campos transaccionales hacia SAP, sustentado en la documentación oficial de Oracle y en consultas a la base de datos.',
    image: '/portafolio/proyectos/flexcube-sap.svg',
    technologies: ['Oracle FLEXCUBE', 'SQL', 'SAP', 'Excel'],
    highlights: [
      '22 campos transaccionales de cuentas mapeados contra la bitácora diaria.',
      '28 campos de nómina mapeados y validados con consultas reales.',
      'Parametrización de 18 sucursales e identificación de campos que requieren UDF.',
      'Corrección de más de una decena de errores de mapeo heredados.',
    ],
    privateNote: 'Proyecto corporativo confidencial.',
  },
  {
    id: 'despliegues-sql',
    title: 'Generador de despliegues SQL',
    summary: 'Herramienta en Python que ordena scripts SQL y analiza sus dependencias.',
    description:
      'Programa en Python para equipos de bases de datos Oracle que determina el orden correcto de despliegue de los scripts SQL, detecta dependencias entre carpetas y genera un reporte en Excel con tablas planas, fáciles de revisar.',
    image: '/portafolio/proyectos/despliegues-sql.svg',
    technologies: ['Python', 'Oracle', 'SQL', 'Excel'],
    highlights: [
      'Ordenamiento automático de despliegues según sus dependencias.',
      'Análisis de dependencias cruzadas entre carpetas.',
      'Reporte de Excel rediseñado con tablas planas de dependencias.',
    ],
    privateNote: 'Herramienta interna: el código es privado.',
  },
  {
    id: 'mundiales-power-bi',
    title: 'Mundiales 1930–2022',
    summary: 'Tablero en Power BI con la historia de los mundiales de fútbol.',
    description:
      'Proyecto académico en equipo: un modelo en estrella construido con los datos de los mundiales de la FIFA entre 1930 y 2022, con medidas DAX y un informe de 8 páginas con resumen ejecutivo.',
    image: '/portafolio/proyectos/mundiales.svg',
    technologies: ['Power BI', 'DAX', 'Power Query', 'Modelo en estrella'],
    highlights: [
      'Modelo dimensional en estrella con relaciones depuradas.',
      'Corrección de medidas DAX y de la configuración regional en Power Query.',
      'Informe de 8 páginas con resumen ejecutivo.',
    ],
    privateNote: 'Proyecto académico: el archivo .pbix está disponible previa solicitud.',
  },
]
