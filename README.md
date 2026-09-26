# Portafolio / Hoja de vida — Julián Tobón

Proyecto evaluativo 1 de **Ingeniería Web** (profesor Juan Pablo Arango): hoja de vida personal construida con **Next.js, React, TypeScript y Tailwind CSS**, maquetada a partir del diseño de Figma entregado en clase y desplegada en **Vercel**.

- **Sitio en producción:** [julian-tobon.vercel.app](https://julian-tobon.vercel.app)
- **Repositorio:** [github.com/julian7965/julian-tobon-portafolio](https://github.com/julian7965/julian-tobon-portafolio)

---

## Tabla de contenido

1. [Qué incluye](#qué-incluye)
2. [Tecnologías](#tecnologías)
3. [Cómo ejecutarlo](#cómo-ejecutarlo)
4. [Editor de la hoja de vida](#editor-de-la-hoja-de-vida)
5. [Contenido en Supabase](#contenido-en-supabase)
6. [Estructura del código (atomic design)](#estructura-del-código-atomic-design)
7. [Rutas](#rutas)
8. [Despliegue en Vercel](#despliegue-en-vercel)
9. [Decisiones de diseño](#decisiones-de-diseño)
10. [Checklist de requisitos del proyecto](#checklist-de-requisitos-del-proyecto)

---

## Qué incluye

| Zona | Contenido |
| --- | --- |
| **Menú izquierdo (fijo)** | Foto, nombre y título; datos de contacto; idiomas y lenguajes de programación con porcentaje de dominio (barras animadas); habilidades extra. |
| **Contenido central (scroll vertical)** | **Perfil** con foto sobre fondo blanco y botón que abre el diálogo "Conóceme" · **Conocimientos** en tarjetas con ícono, título y descripción · **Educación** con institución, fechas, título y descripción · **Portafolio** con scroll horizontal y diálogo "Saber más" por proyecto · **Footer**. |
| **Menú derecho (fijo)** | Botón **Editar** (lleva al editor del CV), íconos de redes sociales (GitHub, LinkedIn y correo) con tooltip, y accesos rápidos a cada sección con la sección actual resaltada. |

**Extras (innovación):**

- Diálogo "Conóceme" con cifras animadas, trayectoria profesional, botón para copiar el correo y redes.
- Efecto de máquina de escribir con los roles profesionales.
- Carrusel del portafolio con flechas, _scroll-snap_ y navegación entre proyectos dentro del diálogo.
- Animaciones al hacer scroll, barra de progreso de lectura y menú con _scroll spy_.
- **Editor dentro de la app** (`/portafolio/editar`): se edita todo el CV con formularios, se sube la foto a Supabase Storage y el sitio se actualiza al instante.
- Contenido guardado en **Supabase** con regeneración automática (ISR) y respaldo local si la base de datos no responde.
- Accesible: HTML semántico, textos para lectores de pantalla, navegación con teclado, `prefers-reduced-motion` y contraste AA.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [Next.js 14](https://nextjs.org/) (App Router) | Páginas, Server Components, acciones del servidor, middleware e ISR. |
| React 18 + TypeScript | Componentes tipados. |
| [Tailwind CSS 3](https://tailwindcss.com/) | Todos los estilos (paleta `cv` en `tailwind.config.js`). |
| Íconos | [lucide-react](https://lucide.dev/) (SVG) y un ícono SVG propio (`pipeline`) en `components/portafolio/atoms/Icon.tsx`. |
| [Supabase](https://supabase.com/) | PostgreSQL (perfil, conocimientos, educación y proyectos), Auth (inicio de sesión del editor) y Storage (fotos). |
| [zod](https://zod.dev/) | Validación del CV en el editor y en el servidor. |
| [Vercel](https://vercel.com/) | Despliegue continuo desde la rama `main`. |

## Cómo ejecutarlo

**Requisitos:** Node.js 18.17 o superior y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno (opcionales para ver el portafolio, obligatorias para el editor)
#    Copia .env.example como .env.local y completa:
#    NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# 3. Servidor de desarrollo → http://localhost:3000
npm run dev
```

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compilación de producción (incluye verificación de tipos y ESLint). |
| `npm start` | Sirve la compilación de producción. |
| `npm run lint` | Revisión de código con ESLint. |

> Sin las variables de Supabase el portafolio funciona igual: usa el contenido de `data/cv.ts`.

## Editor de la hoja de vida

Todo el CV se edita desde la propia aplicación, sin tocar código:

1. Ejecuta una vez [`supabase/portafolio_cv.sql`](supabase/portafolio_cv.sql) en Supabase (ver la sección siguiente).
2. Si aún no tienes cuenta, créala en `/login` → **Crear cuenta** (correo y contraseña). Si Supabase pide confirmar el correo, abre el enlace que llega por email. También puedes crearla en Supabase → **Authentication** → **Users** → **Add user**.
3. Autoriza ese correo en el **SQL Editor**:
   ```sql
   insert into public.cv_editores (email) values ('tu-correo@ejemplo.com');
   ```
4. En el portafolio pulsa el botón amarillo **Editar** (arriba del menú derecho en escritorio; en la barra superior en móvil) e inicia sesión.
5. Edita y pulsa **Guardar cambios** (o `Ctrl + S`). El sitio público se regenera al instante. Al terminar, usa **Cerrar sesión**.

| Pestaña | Qué se edita |
| --- | --- |
| Perfil y foto | Nombre completo y corto, título, correo, años de experiencia, foto (se sube a Storage), roles animados, resumen, párrafos de «Sobre mí» y disponibilidad. |
| Contacto y redes | Datos de contacto del menú izquierdo y redes sociales del menú derecho (con ícono). |
| Habilidades y trayectoria | Idiomas y lenguajes con porcentaje (deslizador), habilidades extra y empresas. |
| Conocimientos · Educación · Proyectos | Agregar, editar, reordenar, ocultar o eliminar elementos; imagen, tecnologías, logros y enlaces de cada proyecto. |

**Seguridad:**

- `middleware.ts` exige sesión para `/portafolio/editar` (sin sesión, redirige a `/login`), y la página confirma el permiso con la función SQL `cv_puede_editar()`, que revisa la tabla `cv_editores`.
- Al guardar, una acción del servidor valida todo con zod (textos obligatorios, límites, URLs seguras) y llama a la función `cv_guardar()`, que vuelve a verificar el permiso y guarda **todo en una sola transacción**.
- Los visitantes pueden ver el botón **Editar** y crear una cuenta, pero registrarse **no** da permiso de edición: sin su correo en `cv_editores` no pueden leer ni cambiar nada que no sea público.
- Para que el enlace de confirmación del correo vuelva al sitio, agrega `https://tu-dominio/auth/callback` en Supabase → **Authentication** → **URL Configuration** → **Redirect URLs**.
- Si inicias sesión con un correo no autorizado, el editor muestra la instrucción SQL exacta para autorizarlo.

## Contenido en Supabase

1. Abre tu proyecto en Supabase → **SQL Editor** → **New query**.
2. Pega y ejecuta [`supabase/portafolio_cv.sql`](supabase/portafolio_cv.sql). Es idempotente (se puede ejecutar varias veces) y:
   - crea las tablas `cv_perfil`, `cv_conocimientos`, `cv_educacion` y `cv_proyectos` (prefijo `cv_`: no toca otras tablas del proyecto);
   - crea la tabla `cv_editores` (correos autorizados para editar) y las funciones `cv_puede_editar()` y `cv_guardar()`;
   - activa **RLS**: los visitantes solo leen lo visible; los editores ven también lo oculto;
   - crea el bucket público **`portafolio`** en Storage (imágenes de hasta 5 MB) con permisos de subida solo para editores;
   - inserta el contenido inicial de `data/cv.ts` si las tablas están vacías.
3. También puedes editar desde **Table Editor**: la columna `orden` define la posición y `visible = false` oculta un elemento. Esos cambios se ven en máximo ~1 minuto (`export const revalidate = 60`).

**¿Y si Supabase falla?** `lib/portafolio/cv-repository.ts` consulta cada tabla con un tiempo máximo de 4 s. Si una tabla no existe, está vacía, no responde o faltan las variables de entorno, esa sección usa el respaldo de [`data/cv.ts`](data/cv.ts). El footer muestra "Contenido desde Supabase" cuando los datos vienen de la base de datos.

Marcadores del contenido inicial que conviene reemplazar desde el editor:

- [ ] Foto de perfil.
- [ ] Correo, teléfono y enlaces de GitHub y LinkedIn.
- [ ] Porcentajes de idiomas y lenguajes de programación.
- [ ] Institución y fechas de cada entrada de educación.

## Estructura del código (atomic design)

```
app/
├── page.tsx                  → Página "/" del portafolio (Server Component + ISR)
├── login/                    → Inicio de sesión y registro del editor: page.tsx y LoginForm.tsx
├── auth/callback/route.ts    → Destino del enlace de confirmación del correo
├── portafolio/editar/        → Editor del CV: page.tsx (servidor), CvEditor.tsx (cliente),
│                               actions.ts (guardar), EditorNotice.tsx, SignOutButton.tsx
├── layout.tsx                → Layout raíz (tipografía Inter)
└── globals.css               → Estilos globales mínimos (el resto es Tailwind)
components/portafolio/
├── atoms/                    → Bloques indivisibles
│   ├── Avatar, Badge, Button, Card, Icon, IconButton
│   ├── ProgressBar, Reveal, ScrollProgress, TypingText
│   └── FormFields            → TextField, TextAreaField, NumberField, RangeField, SelectField, SwitchField
├── molecules/                → Combinaciones de átomos
│   ├── SectionHeader, SidebarBlock, SkillMeter, InfoRow, CheckItem, TagList
│   ├── KnowledgeCard, EducationItem, ProjectCard, SocialLinks, StatCounter, Modal, BackToTopButton
│   ├── EditShortcut          → Botón «Editar» que lleva al editor
│   └── ListEditor, StringListEditor, IconSelect, ImageUploadField   (editor)
├── organisms/                → Secciones completas
│   ├── ProfileSidebar (menú izquierdo), SocialSidebar (menú derecho), MobileTopBar
│   ├── HeroSection + ProfileDialog, KnowledgeSection, EducationSection
│   ├── PortfolioSection + ProjectDialog, SiteFooter
│   └── editor/               → ProfileForm, ContactForm, SkillsForm, KnowledgeForm, EducationForm, ProjectsForm
├── templates/
│   ├── PortfolioTemplate     → Distribución de 3 columnas y paneles móviles
│   └── EditorTemplate        → Barra de acciones, pestañas y formulario del editor
└── hooks/                    → useInView, useActiveSection, useBodyScrollLock, usePrefersReducedMotion
data/cv.ts                    → Contenido inicial y de respaldo de la hoja de vida
lib/portafolio/               → Tipos, repositorio (Supabase + respaldo), mapeos, validación zod, utilidades
lib/supabase.ts               → Cliente de Supabase para el navegador
middleware.ts                 → Sesión del editor (/login y /portafolio/editar)
public/portafolio/            → Foto e imágenes de proyectos por defecto
supabase/portafolio_cv.sql    → Tablas, RLS, funciones, bucket de Storage y datos iniciales
```

**Componentes reutilizados** (requisito: al menos 6):

| Componente | Nivel | Dónde se reutiliza |
| --- | --- | --- |
| `Button` | Átomo | Perfil, diálogo del perfil (Escríbeme, Copiar correo), diálogo del proyecto (Ver código, Ver demo), tarjetas (Saber más), footer, inicio de sesión y editor. |
| `IconButton` | Átomo | Redes sociales, menú de secciones, flechas del carrusel, navegación del diálogo, botones de cerrar, barra móvil. |
| `Card` | Átomo | Perfil, tarjetas de conocimientos, contenedor de educación, tarjetas de proyectos, footer. |
| `Badge` | Átomo | Fechas de educación, tecnologías, disponibilidad, trayectoria, origen del contenido. |
| `ProgressBar` | Átomo | Idiomas y lenguajes de programación (vía `SkillMeter`). |
| `Avatar` | Átomo | Menú izquierdo, barra móvil y diálogo del perfil. |
| `Icon` | Átomo | Todos los componentes con íconos. |
| `Reveal` | Átomo | Animación de entrada de encabezados, tarjetas y educación. |
| `SectionHeader` | Molécula | Conocimientos, Educación y Portafolio. |
| `SkillMeter` | Molécula | Idiomas y Lenguajes de programación. |
| `SidebarBlock` | Molécula | Contacto, Idiomas, Lenguajes y Habilidades extra. |
| `CheckItem` | Molécula | Habilidades extra y logros de cada proyecto. |
| `TagList` | Molécula | Tarjetas y diálogo de proyectos. |
| `SocialLinks` | Molécula | Menú derecho y diálogo del perfil. |
| `Modal` | Molécula | Diálogo del perfil y diálogo de proyectos. |
| `EditShortcut` | Molécula | Botón «Editar» del menú derecho (escritorio) y de la barra superior (móvil). |
| `ListEditor` | Molécula | Editor: contacto, redes, idiomas, lenguajes, conocimientos, educación y proyectos. |
| `StringListEditor` | Molécula | Editor: roles, párrafos, habilidades, empresas, tecnologías y logros. |
| `TextField` y demás `FormFields` | Átomos | Inicio de sesión y todos los formularios del editor. |

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Portafolio / hoja de vida. |
| `/login` | Público | Inicio de sesión y registro del editor (con sesión activa, lleva directo al editor). |
| `/auth/callback` | Público | Confirma el correo de una cuenta nueva y abre el editor. |
| `/portafolio/editar` | Correos autorizados | Editor de la hoja de vida. |

## Despliegue en Vercel

1. Sube el código al repositorio [julian7965/julian-tobon-portafolio](https://github.com/julian7965/julian-tobon-portafolio).
2. En Vercel: **Add New → Project** e importa el repositorio. En **Project Name** escribe `julian-tobon` para obtener el dominio `julian-tobon.vercel.app` (o agrégalo luego en **Settings → Domains**).
3. En **Environment Variables** agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Pulsa **Deploy**. Cada `push` a `main` genera un nuevo despliegue automáticamente.

## Decisiones de diseño

- **Fidelidad al Figma:** misma distribución (menú izquierdo, contenido central, menú derecho), tarjetas blancas sobre fondo `#F0F0F6` y acento amarillo `#FFB400`, con tipografía Inter.
- **Contraste:** el gris de textos se oscureció a `#6B6B75` y el resaltado del rol usa un efecto marcador en lugar de texto amarillo, para cumplir el contraste AA.
- **Diálogos nativos:** se usa `<dialog>` con `showModal()`: el navegador maneja la capa superior, el foco y la tecla Escape. También se cierran con clic en el fondo.
- **Responsive:** en pantallas menores a 1024 px los menús se convierten en paneles laterales que se abren desde una barra superior; el carrusel ocupa el 82 % del ancho en móvil.
- **Rendimiento:** la página es estática con ISR y el middleware solo se ejecuta en `/login` y `/portafolio/editar`; los componentes interactivos (`'use client'`) son solo los que lo necesitan.
- **Convenciones:** código en inglés; textos de la interfaz, comentarios y tablas de la base de datos en español.

## Checklist de requisitos del proyecto

- [x] Next.js, Tailwind CSS, TypeScript e íconos.
- [x] Menú izquierdo fijo: foto, nombre, título, contacto, idiomas (%), lenguajes (%), habilidades extra.
- [x] Contenido central con scroll vertical: Perfil (foto en fondo blanco + botón con diálogo), Conocimientos, Educación, Portafolio (scroll horizontal + "Saber más" con diálogo), Footer.
- [x] Menú derecho fijo con redes sociales (GitHub y LinkedIn como mínimo).
- [x] Más de 6 componentes reutilizados con atomic design (átomos, moléculas, organismos y plantillas).
- [x] Estilos con Tailwind CSS.
- [x] Diseño responsive (móvil, tablet y escritorio).
- [x] README y comentarios en el código.
- [x] Despliegue en Vercel.

---

**Autor:** Julián De Jesús Tobón Botero · Medellín, Colombia
