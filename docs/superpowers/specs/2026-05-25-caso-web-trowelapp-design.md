# Caso de éxito — Web comercial TrowelApp (trowelapp.com)

**Fecha:** 2026-05-25
**Proyecto:** web-pindia (pindia.es)
**Tipo:** Nueva página de caso de éxito (diseño + desarrollo web)

---

## Contexto

Pindia diseñó y desarrolló la web comercial de TrowelApp (trowelapp.com), el SaaS
de gestión de obra de Holded. La web **anterior solo estaba en castellano**; Pindia
hizo un rediseño + desarrollo completo que la internacionalizó a **9 locales**
(es-ES, es-MX, es-AR, es-UY, es-CO, es-PE, es-CL, en, x-default) y se entregó en
**1 semana**. Stack a medida **HTML + CSS + JS** (sin CMS).

Este caso es **distinto** del existente `trowelapp.html`, que documenta el producto
SaaS. Este cubre el **sitio comercial/marketing**.

## Objetivo

Publicar una página de caso de éxito en pindia.es que muestre el trabajo de diseño
y desarrollo de trowelapp.com, con capturas reales del sitio, métricas verificables
y SEO/schema completos, siguiendo la plantilla de casos existente.

## Datos confirmados (cliente real — no inventar)

- **Cliente:** TrowelApp · **Año:** 2026 · **Rol:** Diseño + desarrollo completo.
- **Plazo:** 1 semana.
- **Internacionalización:** de 1 idioma (castellano) → 9 locales / 8 mercados + EN.
- **Stack:** HTML + CSS + JS a medida (sin CMS), servido tras Cloudflare.
- **Live:** https://trowelapp.com

## Estructura de la página (`src/proyectos/web-trowelapp.html`)

Clona la plantilla de `trowelapp.html` / `diaryofatoken.html`:

1. **Hero** — breadcrumb, título, `case-meta` (cliente TrowelApp · rol Diseño+Desarrollo · año 2026 · stack HTML/CSS/JS · enlace live). Badge "En producción".
2. **Stat-strip** — métricas reales:
   - `9` idiomas y regiones (de 1 → 9)
   - `1 semana` de entrega
   - `8` mercados internacionales
   - (Opcional, solo si se mide) rendimiento Lighthouse.
3. **Reto** — `check-list`: comunicar un SaaS complejo de forma simple, internacionalizar a varios mercados LATAM+EU+EN, optimizar para captar demos, plazo de 1 semana.
4. **Solución** — bloques con **capturas en vivo** de trowelapp.com:
   - Hero + social proof (5/5, 5.000+ profesionales, 16.000+ obras)
   - Mockups conversacionales del problema
   - 3 pilares (gestión / calidad / tiempos)
   - 6 verticales por sector
   - Sección app móvil
   - Testimonios + logos
5. **Stack técnico** — `tech-grid`: HTML5 semántico, CSS a medida, JS vanilla, arquitectura i18n con hreflang (9 locales), Cloudflare, rendimiento/lazy, SEO.
6. **Resultados** — internacionalización 1→9, entrega en 1 semana, web lista para conversión multi-país. `chip-row` de tags.
7. **post-cta** → `/contacto/`.
8. **SEO/Schema** — title, meta description, canonical, OG, Twitter Card, JSON-LD BreadcrumbList + CreativeWork.

## Assets

Capturas en vivo de trowelapp.com (navegador), recortadas y convertidas a **WebP**,
guardadas en `assets/img/` con prefijo `case-trowelweb-*.webp`:
`case-trowelweb-cover.webp` (thumbnail/og), `-hero`, `-problema`, `-pilares`,
`-verticales`, `-app`, `-testimonios`. ~6-8 imágenes. Cover above-the-fold con
`fetchpriority="high"`, resto `loading="lazy"`.

## Cambios en otras páginas

- **`src/proyectos/index.html`** — nueva card categoría `data-cat="web"` enlazando a
  `/proyectos/web-trowelapp.html`, tags (Diseño web, Desarrollo, i18n, Conversión).
- **`src/index.html`** (home) — **reemplaza la card de pindia.es** por "Web TrowelApp".
  Home resultante: TrowelApp SaaS · Web TrowelApp · Diary of a Token.
  Títulos distintos para no confundir las dos entradas TrowelApp.

## Build

1. `npm run build:pages` (regenera HTML de raíz, proyectos, home).
2. Verificar en `http://localhost:8080`.
3. (CI ya minifica; cache-bust solo si toco CSS/JS — este caso no debería).

## Fuera de alcance

- No tocar el caso SaaS `trowelapp.html`.
- No añadir CSS nuevo salvo que la plantilla no cubra algún componente (reutilizar
  clases existentes: `case-meta`, `stat-strip`, `check-list`, `tech-grid`, `chip-row`,
  `post-cta`, etc.).
- No cambiar partials (no afecta al blog).

## Pendiente de confirmar por el usuario

- ¿Métricas adicionales verificables para el stat-strip (tráfico, conversión)?
- ¿Incluyo medición Lighthouse real como stat de rendimiento?
- Visto bueno a dos cards "TrowelApp" en la home (SaaS + Web).
