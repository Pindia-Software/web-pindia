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

### 1. Instalar dependencias (solo la primera vez)

```bash
npm install gray-matter marked
```

### 2. Crear el archivo Markdown

Crea un nuevo archivo en `/blog/src/posts/` con el nombre del slug, por ejemplo `mi-post.md`:

```markdown
---
title: "Título del post"
description: "Descripción SEO de 120-155 caracteres que resume el contenido del artículo"
date: 2024-04-24
author: "Borja García"
tags: ["diseño web", "software"]
cover: "/blog/src/assets/imagen.webp"
coverAlt: "Descripción accesible de la imagen de portada"
draft: false
---

Contenido del post en Markdown...

## Subtítulo

Más contenido, listas, código, etc.
```

> Pon `draft: true` para que el post no aparezca en el listado ni en el sitemap hasta que esté listo.

### 3. Compilar el blog

```bash
node scripts/build-blog.mjs
```

El script generará:
- `/blog/posts/[slug]/index.html` — página HTML del post
- `/blog/index.html` — listado actualizado
- `/blog/rss.xml` — feed RSS actualizado
- `/sitemap.xml` — sitemap regenerado con la nueva URL

### 4. Publicar

```bash
git add .
git commit -m "blog: añadir post 'mi-post'"
git push
```

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
