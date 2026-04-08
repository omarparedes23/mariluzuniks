# Análisis del Proyecto: Unik's Salon Spa

## Tecnologías Principales
- **Framework:** Next.js 15.1.0 (App Router)
- **Librería UI:** React 19.0.0
- **Estilos:** Tailwind CSS v4.0.0 (con PostCSS)
- **Animaciones:** Framer Motion 11.15.0
- **Iconos:** Lucide React
- **Lenguaje:** TypeScript

## Estructura del Proyecto
El proyecto sigue la estructura típica de un proyecto moderno de Next.js con el App Router:
- `/app`: Contiene las páginas principales (`page.tsx`, `layout.tsx`) y los estilos globales (`globals.css`). Probablemente sea una Landing Page o sitio de tipo "Single Page" dada la estructura de componentes.
- `/components`: Contiene los bloques principales de la interfaz. 
  - **Estructura visual:** `Navbar.tsx`, `Hero.tsx`, `Footer.tsx`
  - **Secciones de contenido:** `Servicios.tsx`, `Nosotros.tsx`, `Galeria.tsx`, `Marcas.tsx`, `Testimonios.tsx`, `Contacto.tsx`, `ValoresStrip.tsx`
  - **Interacciones:** `CustomCursor.tsx` (indica que hay un cursor personalizado).
  - `/components/ui`: Reservado probablemente para componentes base reutilizables (como botones, tarjetas, etc.).

## Configuraciones Importantes
- **next.config.ts:** Tiene configurados varios dominios de imágenes remotos permitidos (`picsum.photos`, `upload.wikimedia.org`, `via.placeholder.com`, `images.unsplash.com`, `cdninstagram.com`). Esto indica que la galería o las imágenes de demostración se están cargando desde fuentes externas o se planea integrar con Instagram en el futuro.

## Resumen del Negocio
Se trata de una aplicación web (probablemente una Landing Page informativa) para un salón de belleza y spa ("Unik's Salon Spa"). Contiene secciones fundamentales para este tipo de negocios: presentación (Hero, Nosotros), catálogo de servicios, galería de trabajos, marcas utilizadas/asociadas, testimonios de clientes y una sección de contacto.

## Comandos Disponibles
* `npm run dev`: Iniciar el servidor de desarrollo local.
* `npm run build`: Construir la aplicación para producción.
* `npm start`: Iniciar la aplicación construida.
* `npm run lint`: Ejecutar linter para revisar el código fuente.
