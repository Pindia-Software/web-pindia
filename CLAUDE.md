# CLAUDE.md — web-pindia

Guía de trabajo para Claude Code en este repositorio. Léelo antes de tocar HTML.

---

## Resumen del proyecto

Sitio web corporativo de **Pindia Software** (https://pindia.es).

- **Stack:** HTML5 + CSS3 + JavaScript vanilla. Sin framework, sin bundler frontend.
- **Build:** Node scripts (Markdown → HTML para el blog, partials → HTML para páginas, minificación CSS/JS).
- **Despliegue:** GitHub Pages, automático en push a `main` (`.github/workflows/`).
- **Idioma de la web y de los commits:** español.

---

## Comandos

```bash
# Desarrollo local (servidor estático en raíz)
python3 -m http.server 8080

# Builds
npm run build:pages   # src/**/*.html  → raíz (resuelve partials)
npm run build:blog    # blog/src/posts/*.md → blog/{posts,page,tag,index.html,rss.xml} + sitemap.xml
npm run minify        # css/styles.css → styles.min.css ; js/main.js → main.min.js
npm run build         # los tres anteriores en orden

# Solo CSS o solo JS
npm run minify:css
npm run minify:js
```

No abrir las páginas con `file://` — algunos recursos relativos fallan; usar siempre `http://localhost:8080`.

---

## Estructura — qué editar y qué NO

```
web-pindia/
├── src/                          ← FUENTE de las páginas (editar aquí)
│   ├── index.html
│   ├── aviso-legal.html
│   ├── politica-cookies.html
│   ├── politica-privacidad.html
│   ├── contacto/index.html
│   ├── productos/trowelapp.html
│   ├── proyectos/index.html
│   ├── servicios/{index,diseno-web,desarrollo-software,apps-mobile-api}.html
│   └── partials/                 ← componentes reutilizables
│       ├── head-base.html        (charset + viewport)
│       ├── head-assets.html      (favicons, fuentes, GA, CSS principal)
│       ├── navbar.html           (acepta {{active_*}})
│       ├── footer.html
│       ├── cookie-banner.html
│       ├── cta-blog.html
│       └── scripts.html
│
├── blog/
│   ├── src/
│   │   ├── posts/*.md            ← FUENTE de los posts (editar aquí)
│   │   └── assets/               (imágenes específicas del blog)
│   ├── index.html                ← GENERADO — no editar
│   ├── posts/<slug>/index.html   ← GENERADO — no editar
│   ├── page/<n>/index.html       ← GENERADO — no editar
│   ├── tag/<slug>/...            ← GENERADO — no editar
│   └── rss.xml                   ← GENERADO — no editar
│
├── index.html                    ← GENERADO desde src/index.html
├── aviso-legal.html              ← GENERADO
├── politica-*.html               ← GENERADO
├── {servicios,productos,proyectos,contacto}/  ← GENERADOS
├── sitemap.xml                   ← GENERADO por build-blog.mjs
│
├── css/
│   ├── styles.css                ← FUENTE (editar aquí)
│   ├── scroll-video.css          ← FUENTE
│   └── *.min.css                 ← GENERADOS, gitignored
├── js/
│   ├── main.js                   ← FUENTE (editar aquí)
│   └── main.min.js               ← GENERADO, gitignored
├── assets/                       (imágenes, iconos, fuentes, vídeos — fuente directa)
├── scripts/
│   ├── build-pages.mjs
│   ├── build-blog.mjs
│   └── update-tags.mjs           (utilidad puntual: renombra tags en frontmatter)
├── _headers                      (headers de seguridad para Cloudflare/Netlify)
├── robots.txt
├── manifest.webmanifest
└── .github/workflows/            (CI: build + deploy a Pages)
```

**Regla absoluta:** los HTML de la raíz, los de `/servicios|/productos|/proyectos|/contacto/` y todo lo que cuelga de `/blog/` (excepto `/blog/src/`) son **artefactos de build**. Si los editas a mano, el siguiente `npm run build:pages` o `build:blog` los pisa.

- ¿Cambio en una página? → edita `src/<ruta>.html` y corre `npm run build:pages`.
- ¿Cambio en navbar / footer / head / CTA / cookie banner? → edita `src/partials/<nombre>.html` y corre `npm run build:pages` **y** `npm run build:blog` (los partials también los consume el blog).
- ¿Post nuevo o editado? → edita `blog/src/posts/<slug>.md` y corre `npm run build:blog`.
- ¿CSS o JS? → edita `css/styles.css` o `js/main.js` y corre `npm run minify` (en CI ya se hace; en local solo si quieres validar el bundle minificado).

---

## Sistema de partials (build-pages.mjs)

Sintaxis dentro de cualquier `src/**/*.html` o de otro partial:

```html
<!-- @include nombre -->
<!-- @include nombre clave="valor" otra="x" -->
```

- Lee `src/partials/<nombre>.html`.
- Sustituye `{{clave}}` → valor; placeholders sin valor → `""`.
- La indentación del comentario `<!-- @include ... -->` se aplica a **todas** las líneas del partial expandido.
- Soporta anidación recursiva hasta profundidad 10.
- Si quedan `{{...}}` sin sustituir tras el build, el script avisa por consola — revisa el aviso, suele ser una clave mal escrita.

**Convención `active`:** cuando un include pasa `active="X"`, el builder expone automáticamente `{{active_X}}` con el valor `' aria-current="page"'`. Por eso `navbar.html` lleva placeholders como `{{active_servicios}}` y se invoca así desde una página:

```html
<!-- @include navbar active="servicios" -->
```

Valores usados hoy: `servicios`, `proyectos`, `blog`. Para una página fuera del menú principal, omite el atributo (`<!-- @include navbar -->`).

**Compartido con el blog:** `build-blog.mjs` reutiliza `navbar`, `footer`, `cookie-banner`, `head-base`, `head-assets` y `cta-blog` con la misma convención. Si tocas un partial, regenera **ambos** builds.

---

## Blog (build-blog.mjs)

Frontmatter YAML soportado en `blog/src/posts/<slug>.md`:

```yaml
---
title: 'Título del post'                  # requerido
description: 'Resumen para SEO/OG'         # recomendado
date: 2026-04-09                           # requerido (YYYY-MM-DD)
author: 'Nombre Apellido'                  # opcional, por defecto 'Pindia Software'
tags:                                      # opcional
  - Diseño & Desarrollo Web
  - SEO & Crecimiento
cover: /assets/img/blog/<slug>/cover.webp  # opcional pero usado para hero, listado y og:image
coverAlt: 'Texto alternativo del cover'    # opcional
images:                                    # opcional, galería al final del post
  - { src: /…/foto.webp, alt: '…', caption: '…' }
draft: false                               # true = no se publica
---
```

Lo que genera el script (todo bajo `/blog/`):
- `index.html` y `page/<n>/index.html` (paginación, 6 posts por página).
- `posts/<slug>/index.html` por post.
- `tag/<slug>/index.html` y subpaginación por etiqueta.
- `rss.xml`.
- Reescribe `sitemap.xml` en la raíz (incluye URLs estáticas + posts + páginas + tags).

Convenciones:
- Slug del archivo `.md` = slug de la URL.
- Tags actuales (5 categorías): **Diseño & Desarrollo Web · SEO & Crecimiento · Negocio & Estrategia Digital · Cumplimiento & Accesibilidad · General**. Mantén estas categorías; si añades una nueva, justifícalo y actualiza también `scripts/update-tags.mjs` si procede.
- Cada post toma 220 palabras/min para calcular tiempo de lectura.
- Markdown extendido: imágenes con `![alt](/ruta)` se renderizan como `<figure>` con lazy + decoding async; los headings reciben `id` automático con anchor.

---

## CSS y JS

- `css/styles.css` es **el** stylesheet (tokens + base + componentes + responsive). Sin `@import`.
- `css/scroll-video.css` es la animación scroll-driven de la home — se carga non-blocking.
- `js/main.js` controla cookie banner, drawer móvil, reveal animations, etc.
- Las versiones `.min.*` están en `.gitignore` y las regenera CI con `csso-cli` y `terser`.
- Cache-busting: las páginas referencian los assets con `?v=YYYYMMDDx` (`v=20260426b` actualmente). Si subes un cambio crítico de CSS/JS, sube la query (busca el valor en `head-assets.html`, `scripts.html`, `cta-blog.html` y `build-blog.mjs` → constante `ASSET_VER`).

---

## Despliegue (GitHub Pages)

- Workflow en `.github/workflows/` se dispara en `push` a `main`.
- Pasos: `npm install` → `build:blog` → `minify` → `rsync` a `_site/` → reescritura de paths absolutos para prefijar la base del repo (project page) → upload artifact → deploy.
- `build:pages` **no** se ejecuta en CI explícitamente porque las páginas compiladas se commitean (los artefactos del blog y los `.min.*` se generan en cada deploy). Si añades una página nueva en `src/`, ejecuta `npm run build:pages` localmente y commitea el resultado.

---

## Reglas de oro al trabajar aquí

1. **Nunca edites a mano** los HTML compilados (raíz, `/servicios/...`, `/blog/...`). Edita la fuente y ejecuta el build correspondiente.
2. **Cualquier cambio en `src/partials/`** afecta a páginas estáticas y al blog: corre `build:pages` **y** `build:blog`.
3. **Conserva la indentación** del comentario `@include` — el builder la propaga al partial expandido.
4. **No mezcles** clases o convenciones nuevas sin antes mirar `styles.css`. La paleta y los tokens ya están definidos (variables CSS `--sp-*`, `--text-*`, `--w-*`, `--r-*`, `--bg-*`, etc.).
5. **Imágenes:** WebP siempre que se pueda, `loading="lazy"` salvo el cover above-the-fold (`fetchpriority="high"`).
6. **Accesibilidad:** mantén `skip-link`, `aria-current`, `aria-label`, jerarquía de headings y foco visible. La auditoría WCAG es parte del producto.
7. **SEO:** cada página de `src/` define su propio `<title>`, `<meta description>`, `canonical`, OG y Twitter Cards. Cuando crees una nueva, copia el patrón de `src/index.html` o de una página de servicios.
8. **Commits:** español, imperativo, conciso (mira `git log` reciente).
