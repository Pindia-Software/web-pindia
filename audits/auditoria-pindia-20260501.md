# Auditoría web — pindia.es

**Cliente:** Pindia Software S.L. (agencia de software y diseño web, Santa Cruz de Bezana — Cantabria)
**Sector identificado:** B2B servicios técnicos — agencia de desarrollo software y diseño web; clientes finales: pymes, ingenierías, constructoras y empresas locales/nacionales
**Jurisdicción aplicable:** España / UE — RGPD + LOPDGDD + LSSI-CE + criterios AEPD
**Fecha de auditoría:** 1 de mayo de 2026
**Auditor:** Pindia (auto-auditoría)
**Plataforma detectada:** Sitio estático HTML5 + CSS + JS vanilla, sin framework. Build automatizado en Node (build-pages.mjs + build-blog.mjs). Despliegue en GitHub Pages vía CI.
**Ámbito revisado:** Home, /servicios/ y subpáginas, /proyectos/ y casos, /productos/trowelapp.html, /trowelapp/, /contacto/, /blog/ (índice y posts), /aviso-legal.html, /politica-privacidad.html, /politica-cookies.html, /robots.txt, /sitemap.xml, /schema.json, /manifest.webmanifest, /_headers, partials de `src/` y JS de `js/main.js`. Inspección directa del código fuente del repositorio (la fuente compila a producción vía CI sin mutación).

---

## RESUMEN EJECUTIVO

### Puntuación global: **7,8 / 10**

El sitio está claramente por encima del promedio que vemos en webs corporativas de servicios técnicos en España. Stack vanilla bien optimizado, SEO técnico con cuatro JSON-LD por página, banner de cookies con Aceptar / Rechazar / Configurar al mismo nivel y carga condicionada de GA4, tres páginas legales reales con enlaces `<a>` correctos en el footer y formulario con consentimiento RGPD obligatorio. Lo que baja la nota son problemas concretos y arreglables: un `REPLACE_WITH_GSC_CODE` en la verificación de Google Search Console que se ha quedado en producción en 16+ páginas, las cabeceras de seguridad pensadas para Cloudflare/Netlify que no se aplican porque el sitio sirve desde GitHub Pages, un `wa.me/34XXXXXXXXX` roto en la columna lateral de /contacto/, un copyright "© 2024" desfasado, fechas de "abril de 2024" en los textos legales y un self-disclaimer interno publicado por accidente en la política de privacidad. Nada de esto es estructural — son cierres pendientes de un sitio que está al 95 %.

### Puntuación por área

| Área | Nota |
|---|---|
| Diseño visual y branding | 8,5 / 10 |
| UX y arquitectura de información | 8 / 10 |
| Usabilidad técnica y rendimiento | 7,5 / 10 |
| SEO básico on-page | 7,5 / 10 |
| Cumplimiento legal | 7 / 10 |
| Conversión y confianza | 8 / 10 |

### Top 3 fortalezas

1. **Cumplimiento de cookies y RGPD bien resuelto.** Banner con Aceptar / Rechazar / Configurar a igual jerarquía visual, GA4 cargado solo tras consentimiento, panel granular por categorías, tres páginas legales reales en el footer con `<a>` correctos y formulario con checkbox RGPD obligatorio + enlace a la política. Es la implementación más completa que vemos típicamente en webs de pyme.
2. **SEO técnico avanzado y schema markup denso.** Cuatro JSON-LD inline por página (Organization, ProfessionalService, FAQPage, BreadcrumbList) con NAP completo, geo, áreas de servicio y horarios; en blog cada post añade BlogPosting. Meta titles, descriptions, canonical, OG y Twitter cards diferenciados por página. Sitemap.xml, robots.txt y RSS automatizados.
3. **Stack vanilla optimizado para rendimiento.** Sin frameworks ni bundler frontend; CSS y JS minificados con cache-busting, fuentes Inter self-hosted con preload del woff2, hero con secuencia de WebP y preload del primer frame como LCP candidate, lazy loading + decoding async en imágenes, build automatizado por partials. Permite alcanzar Core Web Vitals altos sin esfuerzo.

### Top 3 problemas críticos

1. 🔴 **Verificación de Google Search Console rota en todo el sitio.** El meta `<meta name="google-site-verification" content="REPLACE_WITH_GSC_CODE">` aparece textualmente en 16+ páginas. La verificación con Google falla y, mientras siga así, no se reciben datos de Search Console (queries, impresiones, errores de indexación, cobertura).
2. 🔴 **Cabeceras de seguridad no aplicadas en producción.** El archivo `_headers` define HSTS, CSP, X-Frame-Options, Referrer-Policy y Permissions-Policy, pero solo lo leen Cloudflare Pages / Netlify. Como el sitio se sirve desde GitHub Pages, ninguna de estas cabeceras llega al navegador, dejando al sitio expuesto a clickjacking, MIME sniffing y XSS sin la mitigación que el código ya tiene preparada.
3. 🔴 **Enlace de WhatsApp roto en la página de contacto.** En la columna lateral de /contacto/ el botón "Escribir por WhatsApp" apunta a `https://wa.me/34XXXXXXXXX` (placeholder con la nota TODO en el HTML). Un visitante móvil que llega buscando contactar por WhatsApp aterriza en una pantalla de error de WhatsApp. El footer sí tiene el número real (`34679551518`) — la inconsistencia hace el problema más doloroso.

### Riesgo legal: **Medio**

El sitio cumple los requisitos formales (datos LSSI Art 10, banner de cookies AEPD-style, política de privacidad con derechos RGPD, formulario con consentimiento). El riesgo viene de tres focos: un self-disclaimer interno publicado por accidente en la política de privacidad ("debe ser revisado y validado por un abogado especializado"), la inscripción registral marcada como "pendiente de actualización" y las fechas de "abril de 2024" en las tres políticas dos años después. No son incumplimientos graves, pero degradan la postura defensiva si hay una reclamación.

> **Disclaimer.** No soy abogado. Este apartado es orientativo desde la práctica de auditoría web; para garantías formales se requiere revisión por profesional jurídico.

---

## HALLAZGOS DETALLADOS

### 1. Diseño visual y branding

🟢 **BAJO — Copyright del footer congelado en 2024**
**Problema:** El bloque del copyright muestra "© 2024 PINDIA SOFTWARE S.L. · CIF B67353748" en todas las páginas. Estamos en mayo de 2026 y el partial no se ha actualizado.
**Evidencia:** `src/partials/footer.html` — la cadena `© 2024` aparece literal en index.html, aviso-legal.html, contacto/, servicios/, proyectos/, etc.
**Recomendación:** Cambiar a "© 2024–2026" o, mejor, generar el año dinámicamente en el partial (`<span id="footer-year"></span>` rellenado por `main.js` con `new Date().getFullYear()` y fallback estático). Esto evita el hallazgo cada año.
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — Logo en footer con dimensiones distintas a navbar**
**Problema:** El logo del header se sirve a 140×56 mientras que el del footer es el mismo SVG a 120×48. Es coherente visualmente pero el navegador no aprovecha caching de tamaño concreto del SVG. Detalle menor de pulido.
**Evidencia:** Atributos `width`/`height` en `nav__logo` (140×56) y `footer__logo` (120×48).
**Recomendación:** Mantener ratio (2,5:1) si se cambia. Si se prefiere uniformidad para una versión PNG raster, generar dos tamaños.
**Esfuerzo estimado:** Bajo.

### 2. UX y arquitectura de información

🔴 **CRÍTICO — Enlace WhatsApp roto en la página de contacto**
**Problema:** En la columna lateral de /contacto/ el botón "Escribir por WhatsApp" apunta a `https://wa.me/34XXXXXXXXX` con un comentario `<!-- TODO: reemplazar 34XXXXXXXXX con el número real de WhatsApp Business -->`. El footer de la misma página sí tiene el número real (`34679551518`). Es el canal con mayor probabilidad de clic en móvil para una agencia local — perderlo significa perder leads directos.
**Evidencia:** `src/contacto/index.html` (líneas 363-364 del HTML compilado): `<!-- TODO --> <a href="https://wa.me/34XXXXXXXXX">…</a>`.
**Recomendación:** Reemplazar `34XXXXXXXXX` por `34679551518` (el mismo del footer) o por el número definitivo de WhatsApp Business. Eliminar el comentario TODO. Verificar también que el enlace lleva mensaje pre-poblado opcional (`?text=Hola%20Pindia,%20me%20gustar%C3%ADa%20...`) para reducir fricción.
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — "Apps móviles" y "APIs e integraciones" llevan al mismo destino**
**Problema:** En el footer de toda la web, los enlaces "Apps móviles" y "APIs e integraciones" apuntan ambos a `/servicios/apps-mobile-api.html`. El usuario espera que cada enlace lleve a información distinta. La home también tiene dos cards de servicio que terminan en la misma URL.
**Evidencia:** `src/partials/footer.html` y bloque `.especialidades__grid` en `src/index.html` — dos `<a href="/servicios/apps-mobile-api.html">` en cada uno.
**Recomendación:** Dos opciones limpias: (a) separar en dos páginas reales (`/servicios/apps-mobile.html` y `/servicios/apis-integraciones.html`) cuando haya contenido diferenciado suficiente, o (b) mantener una sola página y usar anclas (`#apps-mobile`, `#apis`) para deep-link distinto desde cada enlace. Cualquiera de las dos elimina la duplicación percibida.
**Esfuerzo estimado:** Medio (opción a) / Bajo (opción b).

🟢 **BAJO — Inconsistencia entre teléfono fijo y WhatsApp**
**Problema:** El teléfono mostrado como contacto principal es `942 18 97 33` (fijo) y el WhatsApp es `679 551 518` (móvil). No se aclara al usuario que son canales distintos para el mismo destinatario, lo que puede generar duda sobre si son personas/equipos diferentes.
**Evidencia:** Footer de toda la web — los dos enlaces aparecen sin etiqueta diferenciadora salvo el icono.
**Recomendación:** Etiqueta clara debajo de cada uno ("Atención telefónica" / "WhatsApp Business") o usar un único número visible. En el copy del banner del WhatsApp añadir "(canal directo, respuesta más rápida)".
**Esfuerzo estimado:** Bajo.

### 3. Usabilidad técnica y rendimiento

🔴 **CRÍTICO — Cabeceras de seguridad no aplicadas en producción**
**Problema:** El archivo `_headers` declara HSTS (`max-age=63072000; includeSubDomains; preload`), CSP completa, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy` con cohorts desactivadas. Pero `_headers` solo lo leen Cloudflare Pages y Netlify; este sitio sirve desde **GitHub Pages**, que ignora ese archivo. Resultado: ninguna de las protecciones llega al navegador. El propio archivo lo reconoce en su comentario inicial.
**Evidencia:** Cabecera de `_headers` ("NOTA: este fichero solo lo leen Cloudflare Pages / Netlify. El sitio actual está en GitHub Pages (no lo lee)").
**Recomendación:** Migrar el frontend a Cloudflare Pages (gratis, conserva el repo de GitHub como fuente y sí lee `_headers`) o, manteniendo GitHub Pages, añadir las cabeceras vía `<meta http-equiv>` para CSP y un service worker o un proxy CDN delante. La opción limpia y bien documentada es Cloudflare Pages: misma URL final, mismo flujo de despliegue, y `_headers` empieza a aplicarse.
**Esfuerzo estimado:** Medio (Cloudflare Pages: 1-2 h con DNS) / Alto (proxy/SW: 2-3 días).

🟡 **MEDIO — Manifest PWA con array de iconos vacío**
**Problema:** `manifest.webmanifest` tiene `"icons": []` y `"display": "browser"`. Esto deshabilita la instalación como PWA y hace fallar el módulo PWA de Lighthouse. Si la intención es no ser PWA, sobra el manifest; si sí lo es, le faltan iconos (192×192 y 512×512 mínimo) y un `display` adecuado (`standalone` / `minimal-ui`).
**Evidencia:** `manifest.webmanifest` línea final — `"icons": []` y `"display": "browser"`.
**Recomendación:** Decidir el rumbo. Recomendado: entregarlo como PWA básica (mejora la percepción de calidad técnica que vendéis). Generar 192×192, 512×512, maskable y any/maskable purpose. Cambiar `display` a `standalone`. Añadir `start_url` con parámetro de seguimiento (`?utm_source=pwa`).
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — `display: browser` en manifest y `theme_color` desligado de la marca**
**Problema:** Aunque hay un manifest, `display: browser` y la ausencia de iconos desactivan toda la promesa PWA. Además `theme_color: #22293E` (navy) puede no encajar con la barra del navegador móvil al cargar; algunos OEM la pintan literal.
**Evidencia:** `manifest.webmanifest`.
**Recomendación:** Tras decidir si la web es PWA o no (ver hallazgo anterior), alinear `theme_color` con el header real visible (suele ser `#0F1420` en este sitio según las CSS vars).
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — Cache busting con cuatro fuentes distintas**
**Problema:** El parámetro `?v=20260428d` aparece para CSS y fuentes, `?v=20260429d` para `main.min.js`. Mantener dos fechas distintas es trabajo manual y propenso a olvidos al editar partials.
**Evidencia:** `src/partials/head-assets.html`, `src/partials/scripts.html` y `src/partials/cta-blog.html` con la constante en distintos sitios; `build-blog.mjs` también la fija como `ASSET_VER`.
**Recomendación:** Centralizar `ASSET_VER` en un único punto (variable de entorno consumida por ambos builders) y, idealmente, generar el sufijo desde el SHA corto del último commit (`git rev-parse --short HEAD`) en CI. Una sola fuente, cero olvidos.
**Esfuerzo estimado:** Bajo.

### 4. SEO básico on-page

🔴 **CRÍTICO — Verificación de Google Search Console publicada con placeholder**
**Problema:** El meta `<meta name="google-site-verification" content="REPLACE_WITH_GSC_CODE">` aparece en index.html, aviso-legal.html, politica-cookies.html, politica-privacidad.html, contacto/index.html, servicios/index.html, servicios/diseno-web.html, servicios/desarrollo-software.html, servicios/apps-mobile-api.html, proyectos/index.html, proyectos/web-pindia.html, proyectos/el-camino-de-gaudi.html, proyectos/clinica-ofelia-casanueva.html, proyectos/construcciones-rotella.html, proyectos/trowelapp.html y trowelapp/index.html. Mientras siga así, GSC no confirma propiedad y no se reciben datos de búsqueda (queries, impresiones, cobertura, rich results).
**Evidencia:** Cualquier `view-source:` de las páginas anteriores; el script `grep -rn REPLACE_WITH_GSC_CODE` devuelve 16 coincidencias.
**Recomendación:** Verificar dominio en GSC con TXT en DNS (preferido sobre meta — verifica todos los subdominios de golpe) y eliminar el meta del partial `head-assets.html`. Ejecutar `npm run build:pages` y `npm run build:blog` para propagar a todo el sitio. Si queréis mantener doble verificación, sustituir el placeholder por el código real.
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — `schema.json` externo redundante y con logo incorrecto**
**Problema:** Cada página enlaza un `<link rel="alternate" type="application/ld+json" href="/schema.json">` además de los JSON-LD inline. El externo dice `"logo": "https://pindia.es/assets/img/og-home.webp"` (la imagen Open Graph, no el logotipo). Los crawlers raramente leen JSON-LD por `link rel="alternate"` y, si lo hacen, hay riesgo de marcado conflictivo con los inline.
**Evidencia:** `schema.json` en raíz; los inline (en `index.html`) usan `logo: /assets/icons/logo-nav.svg`, correcto.
**Recomendación:** Decidir una de las dos formas y consolidar. La más fiable es **borrar `schema.json`** y mantener los inline. Si se quiere reutilizar, corregir el logo y publicarlo via inline también (los crawlers ignoran el alternate).
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — Política de cookies con cookie ID `_ga_XXXXXXXXXX` sin sustituir**
**Problema:** La tabla de cookies analíticas en `politica-cookies.html` lista `_ga_XXXXXXXXXX` como nombre cookie. El ID real, según `window.GA_MEASUREMENT_ID = 'G-KSW7VRFCV6'`, es `_ga_KSW7VRFCV6`. No es un fallo legal grave pero es un placeholder visible al usuario.
**Evidencia:** `politica-cookies.html:332`.
**Recomendación:** Sustituir `_ga_XXXXXXXXXX` por `_ga_KSW7VRFCV6`. Mejor todavía, generar el HTML de la tabla a partir de una variable única.
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — `theme_color` y `og:image` con la misma imagen para todas las páginas excepto blog**
**Problema:** Todas las páginas comparten `og:image: https://pindia.es/assets/img/og-home.webp`. Funciona, pero la previsualización al compartir /servicios/diseno-web.html en LinkedIn o Slack es la misma que la de /contacto/. Los blog posts sí tienen cover propio (bien hecho).
**Evidencia:** `og:image` repetido en `index.html`, `servicios/*.html`, `contacto/index.html`, `proyectos/index.html`, `aviso-legal.html`, etc.
**Recomendación:** Generar una imagen OG por sección clave (servicios, proyectos, contacto, trowelapp) — al menos cinco. Usar el mismo template visual para coherencia.
**Esfuerzo estimado:** Medio.

### 5. Cumplimiento legal **(BLOQUE CRÍTICO)**

🔴 **CRÍTICO — Self-disclaimer publicado en la política de privacidad**
**Problema:** Al final de `politica-privacidad.html` aparece visible al usuario el bloque: "Nota importante: El contenido de esta Política de Privacidad tiene carácter informativo y orientativo. Debe ser revisado y validado por un abogado especializado en protección de datos antes de su publicación en producción". Es una nota interna que se ha quedado en producción. Si un usuario ejerce derechos RGPD o presenta reclamación AEPD, esta nota es prueba de que el responsable reconoce públicamente que el texto no está validado — debilita la postura defensiva.
**Evidencia:** `politica-privacidad.html` líneas 313-315 (`<div class="notice" role="note">…</div>`).
**Recomendación:** Eliminar el bloque. Validar el texto con jurista (RGPD/protección de datos). Mientras tanto, sí mantener internamente la lista de temas a revisar.
**Esfuerzo estimado:** Bajo (eliminar) + Medio (revisión jurídica externa).

🟠 **ALTO — Inscripción registral marcada como "pendiente de actualización"**
**Problema:** En `aviso-legal.html` el bloque "Inscripción registral" dice literalmente "Registro Mercantil de Cantabria (pendiente de actualización)". El Art. 10 LSSI-CE exige incluir los datos de inscripción registral para sociedades obligadas a inscripción (S.L. lo está). Faltan tomo, folio, hoja y fecha.
**Evidencia:** `aviso-legal.html` línea ~232 (`<dd>Registro Mercantil de Cantabria (pendiente de actualización)</dd>`).
**Recomendación:** Localizar los datos de inscripción de PINDIA SOFTWARE S.L. en el Registro Mercantil de Cantabria y publicarlos completos: "Inscrita en el Registro Mercantil de Cantabria, Tomo X, Folio Y, Hoja S-XXXXX, Inscripción Z, fecha de inscripción …". Eliminar el "pendiente".
**Esfuerzo estimado:** Bajo (solo recopilar y pegar).

🟠 **ALTO — Fechas "Última actualización: abril de 2024" en las tres páginas legales**
**Problema:** Aviso legal, política de privacidad y política de cookies marcan abril de 2024. Estamos en mayo de 2026. La AEPD considera que las políticas deben actualizarse y reflejar la fecha real. Mantener una fecha de hace dos años transmite descuido en ojos de un inspector.
**Evidencia:** `aviso-legal.html:205`, `politica-privacidad.html:228`, `politica-cookies.html:270` — todas con `<p class="updated">Última actualización: abril de 2024</p>`.
**Recomendación:** Hacer la revisión que exige el self-disclaimer (ver hallazgo anterior), incorporar lo que cambie y poner la fecha real ("mayo de 2026"). Ajustar texto si entran cambios. Si no cambia nada, fechar como "Revisado en mayo de 2026".
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — Inconsistencia entre nombre de cookie real y declarado**
**Problema:** El panel de configuración (cookie-settings) dice que la cookie técnica de consentimiento se llama `pindia_cookies_v2`, mientras la política de cookies lista `cookie_consent`. Solo una de las dos coincide con la que graba realmente `main.js`.
**Evidencia:** `politica-cookies.html` tabla técnica (sección 2.1) vs `index.html` panel cookie-settings.
**Recomendación:** Decidir el nombre canónico (preferiblemente el que graba el JS), actualizar la otra fuente y verificar con `document.cookie` o `localStorage` que el nombre publicado es exactamente el que se usa.
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — Nota AEPD sobre derecho de reclamación correctamente incluida**
**Problema:** No hay problema — anotación positiva. La política de privacidad incluye la mención al derecho de reclamación ante la AEPD con enlace a www.aepd.es. Es uno de los puntos que más auditorías fallan y este sitio lo cumple.
**Evidencia:** `politica-privacidad.html:306`.
**Recomendación:** Mantener.
**Esfuerzo estimado:** —.

> **Nota legal del auditor.** No soy abogado. Cada recomendación legal de este informe es orientativa basada en el marco general (LSSI-CE, RGPD, LOPDGDD y criterios AEPD publicados). Para garantías formales, los textos legales y la implementación deben revisarse con un profesional jurídico especializado en RGPD/protección de datos.

### 6. Conversión y confianza

🟠 **ALTO — Pérdida de leads por el WhatsApp roto en /contacto/**
**Problema:** Es el mismo hallazgo del bloque UX, pero con impacto comercial directo: la página de contacto es la última pantalla antes del lead. Romper el canal de WhatsApp en esa página es casi peor que no tener WhatsApp, porque crea fricción ("este sitio está roto") justo en el momento de máxima intención.
**Evidencia:** `contacto/index.html` línea 364 — `wa.me/34XXXXXXXXX`.
**Recomendación:** Arreglar en el mismo deploy que el resto de placeholders.
**Esfuerzo estimado:** Bajo.

🟡 **MEDIO — Faltan logos de clientes / "Trabajan con nosotros"**
**Problema:** Hay testimonios reales con nombres y empresas (4Beats Solutions, Expertus Technology, Würth Elektronik) y casos de éxito con cifras ("+5.000 usuarios activos en 6 países") — buen material. Pero no hay un strip visual de logos de clientes en home, que es el patrón más rápido de transmitir credibilidad por encima del fold cuando el visitante no sabe quiénes sois.
**Evidencia:** `index.html` — secciones `.testimonios` y `.proyectos` están bien, pero no hay un bloque tipo "Han confiado en nosotros" con marcas.
**Recomendación:** Añadir un `<section class="logos-clientes">` debajo de Hero o entre Especialidades y Diseño Web Featured. 6-10 logos en escala de grises con hover en color. Pedir permiso de uso a los clientes existentes.
**Esfuerzo estimado:** Medio.

🟡 **MEDIO — Promesa de "Lighthouse 100" sin evidencia visible**
**Problema:** La card del proyecto de pindia.es (en /proyectos/) lleva la etiqueta "Lighthouse 100". Es un claim verificable pero no se ofrece prueba al visitante. Para una agencia técnica que se vende en este criterio, mostrar un screenshot real (o link a un reporte público) tiene más peso que el badge.
**Evidencia:** `index.html` — `<span class="project-card__tag">Lighthouse 100</span>`.
**Recomendación:** Añadir captura de un Lighthouse real con los 4 valores (Performance, Accessibility, Best Practices, SEO) en la página `/proyectos/web-pindia.html`. O un link al reporte de PageSpeed Insights de pindia.es.
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — Tiempo de respuesta prometido pero sin métrica real visible**
**Problema:** Se promete "respuesta en menos de 24 horas" y "presupuesto en 48 horas". Son promesas habituales pero sin métrica retrospectiva (p. ej. "tiempo medio últimos 30 días: 3 h"). Si el equipo cumple, mostrarlo es ventaja.
**Evidencia:** `contacto/index.html` y `index.html` (sección CTA final).
**Recomendación:** Si el equipo lleva métrica de tiempo de respuesta (Helpscout, Intercom, etc.) exhibir el dato real. Si no, mantener como está.
**Esfuerzo estimado:** Bajo (si hay datos) / —.

---

## PLAN DE ACCIÓN SUGERIDO

### Fase 1 — Semana 1-2: Críticos y legales

1. Eliminar el meta `google-site-verification` con el placeholder de todos los partials y páginas; verificar el dominio en Search Console por TXT en DNS y, si se quiere, añadir el código real al partial `head-assets.html`. Rebuild completo (`npm run build:pages` + `build:blog`).
2. Reemplazar `wa.me/34XXXXXXXXX` por el número real (`34679551518`) en `/contacto/` y eliminar el comentario TODO. Rebuild de la página.
3. Eliminar el bloque "Nota importante" de `politica-privacidad.html` (el self-disclaimer que está visible al usuario en producción).
4. Completar los datos de inscripción registral en `aviso-legal.html` (Tomo, Folio, Hoja, Fecha) — eliminar "pendiente de actualización".
5. Sustituir `_ga_XXXXXXXXXX` por `_ga_KSW7VRFCV6` en la tabla de cookies analíticas de `politica-cookies.html`.
6. Actualizar la fecha de "Última actualización" de las tres páginas legales a "mayo de 2026" tras la revisión jurídica externa (recomendada en paralelo).
7. Migrar el frontend de GitHub Pages a Cloudflare Pages para activar el `_headers` ya escrito (HSTS, CSP, X-Frame-Options, Permissions-Policy). DNS apuntando al CNAME de Cloudflare; el flujo de despliegue se mantiene.

### Fase 2 — Mes 1: Altos (mejora de conversión y SEO)

1. Unificar el nombre de cookie técnica entre `main.js`, `politica-cookies.html` y el panel de configuración. Verificar en producción con `document.cookie`.
2. Eliminar `schema.json` externo y mantener solo los JSON-LD inline (corregir referencias en partials).
3. Generar imágenes OG diferenciadas por sección (home, servicios, proyectos, contacto, trowelapp) — mismo template visual.
4. Resolver el caso "Apps móviles" vs "APIs e integraciones": separar en dos páginas o usar anclas para deep-link distinto desde cada enlace.
5. Añadir una sección "Han confiado en nosotros" con 6-10 logos de clientes (escala de grises + hover).
6. Añadir captura/link de un Lighthouse real en `/proyectos/web-pindia.html` para sostener el badge "Lighthouse 100".
7. Centralizar la versión de assets (`ASSET_VER`) en una única fuente y, si es posible, generarla en CI desde el SHA corto del commit.
8. Actualizar el copyright del footer a "© 2024–2026" (o generarlo dinámicamente).

### Fase 3 — Trimestre: Medios y bajos (rediseño de fondo)

1. Decidir el rumbo PWA: si sí, generar iconos 192×192 / 512×512 (any/maskable), poblar el array `icons` del manifest, cambiar `display` a `standalone` y alinear `theme_color`. Si no, eliminar `manifest.webmanifest` y la `<link rel="manifest">`.
2. Etiquetar mejor los canales de contacto duales (teléfono fijo vs WhatsApp Business) para que el usuario entienda el matiz sin pensar.
3. Considerar mostrar tiempo medio de respuesta real si el equipo lleva métrica.
4. Revisar las dimensiones del logo entre header (140×56) y footer (120×48): mantener ratio o servir un `<picture>` con dos rasterizaciones.
5. Añadir un módulo de "Por qué Pindia" arriba del fold de la home para reforzar diferenciación frente a constructores tipo Wix/Hostinger (la propuesta vanilla + senior + Cantabria es buena, pero hoy se intuye más que se afirma).

---

## Por qué este sitio merece un rediseño

El honesto: este sitio **no necesita un rediseño**. Necesita un sprint de cierre. La arquitectura está bien resuelta (HTML5 + CSS + JS vanilla + build en Node + GitHub Pages), el sistema de diseño es coherente, el SEO técnico está por encima del 90 % de webs de servicios técnicos en España, y el cumplimiento de cookies y RGPD es de los más completos que se ven en pyme. Los hallazgos críticos (placeholder GSC en todas las páginas, `_headers` no aplicado por servir desde GitHub Pages, `wa.me/34XXXXXXXXX` en /contacto/, self-disclaimer publicado en la política de privacidad, fechas "abril 2024" en legales) son **deuda de cierre**, no problemas de fondo. Una semana de trabajo enfocado los resuelve todos.

Lo que sí justifica esfuerzo continuado es lo que ya está identificado en la fase 2 (logos de clientes, Lighthouse visible, OG images por sección, separación clara apps/APIs) y la migración a Cloudflare Pages para que las cabeceras de seguridad ya escritas dejen de ser código muerto. Después de esa fase, el sitio quedará en un estado del que cualquier agencia podría presumir.

> **El sitio no necesita rediseño. Necesita el último 5 % que separa "casi terminado" de "publicado con todo encajado".**

---

*Auditoría realizada por Pindia el 1 de mayo de 2026 sobre la rama `main` del repositorio web-pindia (la fuente compila a producción vía GitHub Actions). Las observaciones legales son orientativas y no sustituyen asesoramiento jurídico formal.*
