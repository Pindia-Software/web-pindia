# Pindia Software — Sitio Web

Sitio web corporativo de [Pindia Software](https://pindia.es), agencia de software a medida y diseño web en Santander (Cantabria). Desarrollado con HTML5, CSS3 y JavaScript vanilla — sin frameworks ni dependencias de build para el frontend.

---

## Previsualizar en local

Desde la raíz del proyecto:

```bash
python3 -m http.server 8080
```

Abre el navegador en: [http://localhost:8080](http://localhost:8080)

> No uses `file://` directamente — algunos navegadores bloquean recursos relativos sin servidor HTTP.

---

## Estructura de archivos

```
web-pindia/
├── index.html                        # Página de inicio
├── robots.txt                        # Directivas para crawlers
├── sitemap.xml                       # Sitemap XML (generado/actualizado por build-blog.mjs)
├── manifest.webmanifest              # Web App Manifest (PWA)
├── _headers                          # Headers de seguridad (Netlify / Cloudflare Pages)
│
├── assets/
│   ├── css/
│   │   └── styles.css                # Hoja de estilos principal
│   ├── js/
│   │   └── main.js                   # JavaScript principal (cookie banner, nav, etc.)
│   ├── img/
│   │   ├── og-home.webp              # Imagen Open Graph (1200×630px)
│   │   └── ...                       # Resto de imágenes
│   └── favicons/
│       ├── favicon.ico               # 32×32
│       ├── apple-touch-icon.png      # 180×180
│       ├── icon-192.png              # 192×192
│       ├── icon-512.png              # 512×512
│       └── icon.svg                  # SVG escalable
│
├── servicios/
│   ├── index.html                    # Página de servicios
│   ├── diseno-web.html               # Servicio: Diseño web
│   ├── desarrollo-software.html      # Servicio: Desarrollo software a medida
│   └── apps-mobile-api.html          # Servicio: Apps móviles y APIs
│
├── productos/
│   └── trowelapp.html                # Producto: Trowel App
│
├── proyectos/
│   └── index.html                    # Portfolio de proyectos
│
├── contacto/
│   └── index.html                    # Página de contacto
│
├── blog/
│   ├── index.html                    # Listado del blog (generado por build-blog.mjs)
│   ├── rss.xml                       # Feed RSS (generado por build-blog.mjs)
│   ├── posts/                        # Posts compilados (generados por build-blog.mjs)
│   │   ├── cana-digital-2021/
│   │   │   └── index.html
│   │   ├── premios-ceoe-cepyme-2021/
│   │   │   └── index.html
│   │   └── finalistas-talento-cantabria/
│   │       └── index.html
│   └── src/
│       ├── posts/                    # Fuente Markdown de los posts
│       │   ├── cana-digital-2021.md
│       │   ├── premios-ceoe-cepyme-2021.md
│       │   └── finalistas-talento-cantabria.md
│       └── assets/                   # Imágenes y recursos específicos del blog
│
├── aviso-legal.html
├── politica-privacidad.html
├── politica-cookies.html
│
└── scripts/
    └── build-blog.mjs                # Script de compilación del blog
```

---

## Configuración antes de publicar

- [ ] Reemplazar `G-XXXXXXXXXX` en `index.html` (y en todas las páginas) con el ID real de GA4 — buscar `window.GA_MEASUREMENT_ID`
- [ ] Añadir el número real de WhatsApp Business en el footer de todas las páginas (buscar `34XXXXXXXXX`)
- [ ] Crear y subir imágenes OG: `/assets/img/og-home.webp` (y variantes por sección), tamaño 1200×630 px
- [ ] Crear el favicon set completo y guardarlo en `/assets/favicons/`:
  - `favicon.ico` (32×32)
  - `apple-touch-icon.png` (180×180)
  - `icon-192.png` (192×192)
  - `icon-512.png` (512×512)
  - `icon.svg` (SVG escalable)
- [ ] Descargar Inter en formato woff2 para self-hosting (requerido por GDPR, evita llamadas a Google Fonts CDN) — instrucciones: <https://fontsource.org/fonts/inter>
- [ ] Añadir proyectos reales en `/proyectos/index.html` (sustituir los placeholders actuales)
- [ ] Reclamar / actualizar el perfil de Google Business Profile con la URL del nuevo dominio `pindia.es`
- [ ] Configurar el endpoint del formulario de contacto (`/api/contact`) — opciones:
  - [Formspree](https://formspree.io) (sin backend propio)
  - [Netlify Forms](https://docs.netlify.com/forms/setup/) (si despliegas en Netlify)
  - Backend propio (Node/Express, serverless function, etc.)
- [ ] Revisar las páginas legales (`aviso-legal.html`, `politica-privacidad.html`, `politica-cookies.html`) con un abogado especializado antes de publicar

---

## Despliegue

### Netlify

Arrastra la carpeta del proyecto a [netlify.com/drop](https://app.netlify.com/drop), o conecta el repositorio Git desde el dashboard de Netlify.

- El archivo `_headers` se aplica automáticamente — no necesitas configuración adicional.
- Para formularios: activa **Netlify Forms** en el dashboard y añade `netlify` como atributo al `<form>`.

### Cloudflare Pages

1. Conecta el repositorio en el dashboard de Cloudflare Pages.
2. **Build command**: dejar vacío (no hay paso de build para el frontend).
3. **Publish directory**: `/` (raíz del repositorio).
4. Los headers del archivo `_headers` son compatibles con Cloudflare Pages de forma nativa.

### Servidor nginx

```nginx
server {
    listen 443 ssl http2;
    server_name pindia.es www.pindia.es;

    root /path/to/web-pindia;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Aplicar los headers de seguridad manualmente (ver sección Headers de seguridad)
}
```

---

## Añadir un post al blog

El blog se genera desde Markdown. Cada post es un archivo `.md` en `/blog/src/posts/` con frontmatter YAML. El script `scripts/build-blog.mjs` compila los `.md` a HTML, regenera el listado paginado, el RSS y el sitemap.

### 1. Instalar dependencias (solo la primera vez)

```bash
npm install
```

Esto instala `gray-matter`, `marked`, `csso-cli` y `terser` (dependencias declaradas en `package.json`).

### 2. Preparar las imágenes

Crea una carpeta para el post en `/assets/img/blog/<slug>/` y guarda dentro las imágenes en formato **WebP** (mejor compresión, soportado universalmente).

Convención de nombres:
- `cover.webp` — imagen principal (obligatoria si quieres cover, se usa en el listado, hero del post y `og:image`).
- `foto-1.webp`, `foto-2.webp`, ... — imágenes de la galería al final del post (opcional).

Conversión a WebP desde JPG/PNG (con `cwebp` de Homebrew: `brew install webp`):

```bash
cwebp -q 82 imagen-original.jpg -o assets/img/blog/<slug>/cover.webp
```

> Calidad recomendada: `82`. Tamaño cover: idealmente 1600×900 px o similar 16:9.

### 3. Crear el archivo Markdown

Crea `/blog/src/posts/<slug>.md` (el nombre del archivo será la URL: `/blog/posts/<slug>/`):

```markdown
---
title: "Título del post"
description: "Descripción SEO de 120-155 caracteres que resume el contenido del artículo."
date: 2026-04-26
author: "Borja García"
tags: ["diseño web", "software"]
cover: "/assets/img/blog/mi-post/cover.webp"
coverAlt: "Descripción accesible de la imagen principal"
images:
  - src: "/assets/img/blog/mi-post/foto-1.webp"
    alt: "Descripción accesible de la primera imagen"
    caption: "Pie de foto opcional que se mostrará bajo la imagen."
  - src: "/assets/img/blog/mi-post/foto-2.webp"
    alt: "Descripción accesible de la segunda imagen"
draft: false
---

Primer párrafo de introducción al post. Soporta **negrita**, *cursiva* e [enlaces](/contacto/).

## Subtítulo de sección

Más contenido. Markdown estándar: listas, código, citas, imágenes inline, etc.

- Punto 1
- Punto 2
- Punto 3

> Bloque de cita destacado.

También se pueden incrustar imágenes en medio del texto:

![Descripción accesible](/assets/img/blog/mi-post/foto-3.webp)
```

#### Campos del frontmatter

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `title` | Sí | Título del post (también se usa en `<title>`, `og:title` y schema.org). |
| `description` | Recomendado | Meta description SEO (120-155 caracteres). |
| `date` | Sí | Fecha de publicación en formato `YYYY-MM-DD`. Determina el orden del listado. |
| `author` | Recomendado | Nombre del autor. |
| `tags` | Recomendado | Lista de etiquetas. Las dos primeras se muestran en la card del listado. |
| `cover` | Recomendado | Ruta absoluta a la imagen principal. Se usa como hero del post, thumbnail del listado y `og:image`. Si se omite, no se renderiza imagen de cabecera. |
| `coverAlt` | Sí (si hay cover) | Texto alternativo accesible del cover. |
| `images` | No | Lista de imágenes para la galería al final del post. Cada item: `{ src, alt, caption? }`. |
| `draft` | No | Si es `true`, el post **no** aparece en el listado, RSS ni sitemap. Útil para borradores. |

### 4. Compilar el blog

```bash
npm run build:blog
```

Genera:
- `/blog/posts/<slug>/index.html` — página individual del post.
- `/blog/index.html` — listado paginado (página 1, 6 posts por página).
- `/blog/page/<n>/index.html` — páginas siguientes si hay más de 6 posts.
- `/blog/rss.xml` — feed RSS.
- `/sitemap.xml` — sitemap regenerado con todas las URLs (estáticas + posts + páginas del listado).

### 5. Verificar y publicar

```bash
npm run build              # build:blog + minify CSS/JS
python3 -m http.server 8080
```

Revisa en local: `http://localhost:8080/blog/`. Cuando esté correcto:

```bash
git add .
git commit -m "blog: añadir post 'mi-post'"
git push
```

GitHub Actions ejecuta automáticamente `npm run build:blog` + `npm run minify` y despliega a GitHub Pages.

---

## Comandos para ejecutar en local

Resumen de los comandos habituales en orden, desde la raíz del proyecto.

```bash
# 1. Instalar dependencias (solo la primera vez o tras un git pull con cambios en package.json)
npm install

# 2. Compilar el blog (Markdown → HTML, regenera listado, RSS y sitemap)
npm run build:blog

# 3. Minificar CSS y JS
npm run minify

# 4. Build completo (blog + minify) — equivalente a hacer 2 + 3
npm run build

# 5. Servidor local de desarrollo (sirve los archivos estáticos)
python3 -m http.server 8080
# Abrir en el navegador: http://localhost:8080
```

> Alternativas al servidor Python si no lo tienes instalado:
> ```bash
> npx serve .          # Node.js
> php -S localhost:8080  # PHP
> ```

### Atajos por flujo de trabajo

| Tarea | Comando |
|-------|---------|
| Solo previsualizar lo ya compilado | `python3 -m http.server 8080` |
| Tras editar `.md` del blog | `npm run build:blog && python3 -m http.server 8080` |
| Tras editar CSS o JS | `npm run minify && python3 -m http.server 8080` |
| Build completo antes de subir | `npm run build` |

---

## Headers de seguridad (hosting no Netlify/Cloudflare)

Si despliegas en un servidor propio, configura manualmente los headers del archivo `_headers` en tu servidor web. Ejemplo para nginx:

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=(), interest-cohort=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests" always;
```

Para verificar la configuración de headers: [securityheaders.com](https://securityheaders.com/?q=https://pindia.es)

---

## Tecnologías

- **HTML5** — semántico, accesible, optimizado para SEO
- **CSS3** — custom properties, grid, flexbox; sin frameworks
- **JavaScript vanilla** — sin dependencias de frontend
- **Node.js** — únicamente para el script de compilación del blog (`scripts/build-blog.mjs`)

---

## Licencia

Copyright © 2024 Pindia Software. Todos los derechos reservados.
