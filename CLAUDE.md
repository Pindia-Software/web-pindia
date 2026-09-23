# CLAUDE.md: web-pindia

Guía de trabajo para Claude Code en este repositorio. Léelo antes de tocar HTML.

---

## Resumen del proyecto

Sitio web corporativo de **Pindia Software** (https://pindia.es).

- **Stack:** HTML5 + CSS3 + JavaScript vanilla. Sin framework, sin bundler frontend.
- **Build:** Node scripts (Markdown → HTML para el blog, partials → HTML para páginas, minificación CSS/JS).
- **Despliegue:** Cloudflare Workers (static assets), automático en push a `main` vía Workers Builds. Config en `wrangler.jsonc`. `_headers` y `_redirects` SÍ se aplican (Cloudflare los honra; GitHub Pages los ignoraba).
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

No abrir las páginas con `file://`, porque algunos recursos relativos fallan; usar siempre `http://localhost:8080`.

---

## Estructura: qué editar y qué NO

```
web-pindia/
├── src/                          ← FUENTE de las páginas (editar aquí)
│   ├── index.html
│   ├── 404.html
│   ├── aviso-legal/index.html
│   ├── politica-cookies/index.html
│   ├── politica-privacidad/index.html
│   ├── contacto/index.html
│   ├── trowelapp/index.html      (landing del producto propio)
│   ├── proyectos/
│   │   ├── index.html            (portfolio)
│   │   └── {clinica-ofelia-casanueva,limon-hoteles,el-camino-de-gaudi,
│   │          trowelapp,web-trowelapp,web-pindia,diaryofatoken}.html
│   ├── servicios/
│   │   ├── index.html
│   │   ├── diseno-web.html       (página comercial principal)
│   │   ├── diseno-web-torrelavega.html   (variante local del Besaya)
│   │   ├── desarrollo-software.html
│   │   ├── apps-mobile-api.html
│   │   ├── mantenimiento-web.html
│   │   └── posicionamiento-web.html
│   └── partials/                 ← componentes reutilizables
│       ├── head-base.html        (charset + viewport)
│       ├── head-assets.html      (favicons, fuentes, GA, CSS principal)
│       ├── navbar.html           (acepta {{active_*}})
│       ├── footer.html
│       ├── cookie-banner.html
│       ├── cookie-settings.html
│       ├── cta-blog.html
│       ├── whatsapp.html         (burbuja flotante + filtro de 2 pasos)
│       ├── home-blog-preview.html  ← GENERADO por build-blog.mjs, no editar
│       └── scripts.html
│
├── blog/
│   ├── src/
│   │   ├── posts/*.md            ← FUENTE de los posts (editar aquí)
│   │   └── assets/               (imágenes específicas del blog)
│   ├── index.html                ← GENERADO, no editar
│   ├── posts/<slug>/index.html   ← GENERADO, no editar
│   ├── page/<n>/index.html       ← GENERADO, no editar
│   ├── tag/<slug>/...            ← GENERADO, no editar
│   └── rss.xml                   ← GENERADO, no editar
│
├── index.html                    ← GENERADO desde src/index.html
├── {aviso-legal,politica-cookies,politica-privacidad}/  ← GENERADOS
├── {servicios,proyectos,contacto,trowelapp}/            ← GENERADOS
├── sitemap.xml                   ← GENERADO por build-blog.mjs
│
├── css/
│   ├── styles.css                ← FUENTE (editar aquí)
│   ├── scroll-video.css          ← FUENTE
│   └── *.min.css                 ← GENERADOS, gitignored
├── js/
│   ├── main.js                   ← FUENTE (editar aquí)
│   └── main.min.js               ← GENERADO, gitignored
├── assets/                       (imágenes, iconos, fuentes, vídeos: fuente directa)
├── scripts/
│   ├── build-pages.mjs
│   ├── build-blog.mjs
│   └── update-tags.mjs           (utilidad puntual: renombra tags en frontmatter)
├── _headers                      (cabeceras de seguridad + Link headers, Cloudflare)
├── _redirects                    (301s, Cloudflare)
├── .assetsignore                 (qué NO sube Cloudflare Workers)
├── wrangler.jsonc                (config deploy: Cloudflare Workers static assets)
├── llms.txt                      (mapa del sitio para agentes IA, servido en /llms.txt)
├── robots.txt
└── manifest.webmanifest
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
- Si quedan `{{...}}` sin sustituir tras el build, el script avisa por consola; revisa el aviso, suele ser una clave mal escrita.

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
- `css/scroll-video.css` es la animación scroll-driven de la home y se carga non-blocking.
- `js/main.js` controla cookie banner, drawer móvil, reveal animations, etc.
- Las versiones `.min.*` están en `.gitignore` y las regenera CI con `csso-cli` y `terser`.
- Cache-busting: las páginas referencian los assets con `?v=YYYYMMDDx` (**`v=20260923a` actualmente**). `_headers` sirve el CSS y el JS con caché immutable, así que **cualquier cambio en `css/styles.css` o `js/main.js` obliga a subir la query**, o los navegadores con la web cacheada no verán el cambio. El valor está en cuatro sitios y hay que tocarlos todos: `src/partials/head-assets.html`, `src/partials/scripts.html`, `src/partials/cta-blog.html` y `scripts/build-blog.mjs` (constante `ASSET_VER`).

---

## Despliegue (Cloudflare Workers)

- El sitio se sirve como **Cloudflare Workers static assets** (config en `wrangler.jsonc`, `assets.directory = "."`, **sin script de Worker**). Dominios: `pindia.es` (apex, canónico) y `www.pindia.es`.
- **Auto-deploy:** Workers Builds conectado al repo dispara en `push` a `main`. Build command: `npm install && npm run build`; deploy: `npx wrangler deploy`. (Sin conexión Git, se despliega a mano con `wrangler deploy`.)
- **`_headers` y `_redirects` SÍ se aplican** aquí (Cloudflare los honra). En la antigua GitHub Pages eran no-ops: las cabeceras de seguridad solo existen gracias a este hosting.
- **`.assetsignore`** controla qué NO se sube/sirve (node_modules, fuentes de build, `MANUAL_pindia.pdf`, backups, etc.).
- `build:pages` se commitea (las páginas compiladas viven en el repo); el blog, `sitemap.xml` y los `.min.*` se regeneran en cada build. Si añades una página nueva en `src/`, ejecuta `npm run build:pages` localmente y commitea el resultado.
- **`www` → 301 al apex** vía **Redirect Rule** de Cloudflare (los canonicals apuntan a `pindia.es`; sin la regla habría contenido duplicado).

---

## Reglas de oro al trabajar aquí

1. **Nunca edites a mano** los HTML compilados (raíz, `/servicios/...`, `/blog/...`). Edita la fuente y ejecuta el build correspondiente.
2. **Cualquier cambio en `src/partials/`** afecta a páginas estáticas y al blog: corre `build:pages` **y** `build:blog`.
3. **Conserva la indentación** del comentario `@include`: el builder la propaga al partial expandido.
4. **No mezcles** clases o convenciones nuevas sin antes mirar `styles.css`. La paleta y los tokens ya están definidos (variables CSS `--sp-*`, `--text-*`, `--w-*`, `--r-*`, `--bg-*`, etc.).
5. **Imágenes:** WebP siempre que se pueda, `loading="lazy"` salvo el cover above-the-fold (`fetchpriority="high"`).
6. **Accesibilidad:** mantén `skip-link`, `aria-current`, `aria-label`, jerarquía de headings y foco visible. La auditoría WCAG es parte del producto.
7. **SEO:** cada página de `src/` define su propio `<title>`, `<meta description>`, `canonical`, OG y Twitter Cards. Cuando crees una nueva, copia el patrón de `src/index.html` o de una página de servicios.
8. **Tipografía: nada de signos que delaten texto de IA.** Ver la sección siguiente. Es norma de marca, no una preferencia menor.
9. **Enlazado interno:** cada post enlaza al menos dos veces a su página de servicio con anchor de keyword ("diseño web a medida en Santander", nunca "aquí"), y una sola vez a `/contacto/`, al cierre. El objetivo es que la autoridad vaya a las páginas que tienen que rankear, no al formulario.
10. **Commits:** español, imperativo, conciso (mira `git log` reciente).

---

## Tipografía: signos prohibidos

Norma para **todo el contenido publicado** (páginas, posts, `<title>`, meta, schema, `llms.txt`). Beatriz identifica estos signos como marca de texto generado por IA y no quiere ninguno en la web.

**Fuera, siempre:**

| Signo | Sustituir por |
|---|---|
| `—` em-dash | Inciso con comas dentro → paréntesis. Inciso simple → comas. Explicación que sigue → dos puntos. Separador de título → dos puntos (reescribe el título si ya llevaba uno). |
| `–` en-dash en rangos | "de X a Y". Si la preposición se repite ("frente a 600 a 1.500"), guion ASCII: `600-1.500 €`. |
| `→` al cierre de un CTA | Quitarla. Se queda solo cuando marca una ruta o un flujo real ("Menú → Configuración", "build → minify → deploy"). |
| `✓` como carácter en el texto | Marcador CSS con mask SVG. Patrón de referencia: `.price-card__features` en `css/styles.css`. |
| Emoji decorativos y bullets manuales (`🚀 💡 ✨ • ▪`) | Quitarlos. |

**Se quedan, son diseño de la casa:**

- `·` punto medio como separador de marca ("Caso de éxito · Web corporativa", "99 € al mes · web corporativa").
- `↗` en enlaces externos, que es convención de usabilidad.
- `«»` y `…` en prosa, que es tipografía española correcta.

**Comprobación antes de compilar** (tiene que salir vacío):

```bash
grep -rn '—\|–\|✓' src/ blog/src/posts/ scripts/build-blog.mjs | grep -v 'console\.log'
```

Incluye `scripts/build-blog.mjs`: sus plantillas de `<title>` y de `aria-label` generan texto que no aparece en ninguna fuente y se cuela en las páginas del índice y de las etiquetas.
