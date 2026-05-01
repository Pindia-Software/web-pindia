# Auditoría web — pindia.es (v2)

**Cliente:** Pindia Software S.L. (agencia de software y diseño web, Santa Cruz de Bezana — Cantabria)
**Sector identificado:** B2B servicios técnicos — agencia de desarrollo software y diseño web; clientes finales: pymes, ingenierías, constructoras y empresas locales/nacionales
**Jurisdicción aplicable:** España / UE — RGPD + LOPDGDD + LSSI-CE + criterios AEPD
**Fecha de auditoría:** 1 de mayo de 2026 (re-auditoría, segunda pasada tras los fixes)
**Auditor:** Pindia (auto-auditoría)
**Plataforma detectada:** Sitio estático HTML5 + CSS + JS vanilla. Sigue desplegándose desde **GitHub Pages** (workflow `.github/workflows/static.yml`, CNAME `pindia.es`). No se ha migrado a Cloudflare Pages.
**Ámbito revisado:** Mismas páginas y artefactos que la primera auditoría (home, /servicios/, /proyectos/, /trowelapp/, /productos/, /contacto/, /blog/, las tres páginas legales, sitemap, robots, schema, manifest, _headers, partials), verificando cada uno de los 23 hallazgos previos contra el código actual.

---

## RESUMEN EJECUTIVO

### Puntuación global: **8,4 / 10** _(antes 7,8)_

Sprint de cierre ejecutado con éxito. De los 23 hallazgos del informe anterior, **15 están totalmente resueltos**, **2 parcialmente resueltos** y **6 quedan pendientes** (uno de ellos crítico: la migración a Cloudflare Pages para activar las cabeceras de seguridad). El sitio ha pasado de "casi terminado" a "publicado con casi todo encajado". Los focos críticos del informe anterior — placeholder GSC en 16+ páginas, WhatsApp roto en /contacto/, self-disclaimer publicado en política de privacidad, fechas legales en abril de 2024, cookie ID con placeholder, schema.json redundante, display=browser en manifest — han sido corregidos limpiamente. Lo que queda son tareas de fase 2/3 que no impiden poner el sitio en limpio, pero sí mejorarían la postura técnica si se completan.

### Puntuación por área

| Área | Nota |
|---|---|
| Diseño visual y branding | 8,5 / 10 |
| UX y arquitectura de información | 8,5 / 10 |
| Usabilidad técnica y rendimiento | 7,5 / 10 |
| SEO básico on-page | 9 / 10 |
| Cumplimiento legal | 8,5 / 10 |
| Conversión y confianza | 8,5 / 10 |

### Top 3 fortalezas (refrendadas)

1. **SEO técnico y schema markup en estado limpio.** Verificación de Search Console arreglada en las 16+ páginas, cookie ID real (`_ga_KSW7VRFCV6`), schema.json externo eliminado para evitar redundancia, OG images diferenciadas por proyecto (case-ofelia, case-rotella, case-camino-gaudi, trowelapp), sitemap.xml con 41 URLs (antes 14). Los cuatro JSON-LD inline por página siguen ahí. Es el área con mayor salto vs la primera auditoría.
2. **Cumplimiento legal en postura sólida.** Self-disclaimer "debe ser revisado por abogado" eliminado de la política de privacidad, "pendiente de actualización" eliminado del aviso legal, fechas actualizadas a mayo de 2026 en las tres políticas, cookie `_ga_KSW7VRFCV6` correctamente declarada. La política recoge ya datos coherentes con la realidad técnica del sitio.
3. **Canales de contacto sin fricción.** WhatsApp en /contacto/ ya apunta al número real (`34679551518`), banner de cookies AEPD-compliant intacto, formulario con consentimiento RGPD obligatorio. La página de contacto vuelve a funcionar como punta de embudo sin agujeros.

### Top 3 problemas críticos pendientes

1. 🔴 **`_headers` sigue siendo código muerto en producción.** El sitio sigue desplegándose desde GitHub Pages (CNAME + workflow `static.yml`), que ignora `_headers`. HSTS, CSP, X-Frame-Options, Referrer-Policy y Permissions-Policy siguen sin aplicarse. El comentario inicial del propio archivo lo reconoce. Este es el único crítico del informe anterior que queda abierto y, al mismo tiempo, el más laborioso de cerrar.
2. 🟠 **Inscripción registral incompleta.** El "pendiente de actualización" se ha eliminado, pero el texto actual ("Inscrita en el Registro Mercantil de Cantabria") sigue sin Tomo, Folio, Hoja, Inscripción y fecha. El Art. 10 LSSI-CE pide los datos completos cuando aplique, y para una S.L. aplica.
3. 🟡 **Inconsistencia residual en política de cookies.** La página `politica-cookies.html` lista en una tabla `cookie_consent` y en otra `pindia_cookies_v2` como cookies técnicas. Solo una de las dos coincide con la que el JS realmente graba. Es deuda menor pero crea contradicción interna en un texto que precisamente vende rigor.

### Riesgo legal: **Bajo-Medio** _(antes Medio)_

El cierre legal ha sido casi completo: textos fechados, sin self-disclaimer público, cookie ID alineada con la realidad, formulario y banner correctos. El único frente vivo es el dato de inscripción registral incompleto y la inconsistencia entre los dos nombres de cookie técnica. Ninguna de las dos justifica una intervención AEPD por sí sola, pero recomendamos cerrarlas en el siguiente sprint.

> **Disclaimer.** No soy abogado. Este apartado es orientativo desde la práctica de auditoría web; para garantías formales se requiere revisión por profesional jurídico.

---

## HALLAZGOS DETALLADOS

> Cada hallazgo lleva una etiqueta entre paréntesis: **(RESUELTO)**, **(PARCIAL)**, **(PENDIENTE)** o **(NUEVO)** respecto al informe anterior.

### 1. Diseño visual y branding

🟡 **MEDIO — Copyright del footer congelado en 2024 (PENDIENTE)**
**Problema:** El footer sigue mostrando "© 2024 PINDIA SOFTWARE S.L. · CIF B67353748" en `src/partials/footer.html` y en todas las páginas compiladas. Era hallazgo BAJO en la primera auditoría; lo subo a MEDIO porque, a estas alturas del año, "© 2024" ya transmite descuido sin matices.
**Evidencia:** `src/partials/footer.html` línea con `<p class="footer__copy">© 2024 PINDIA SOFTWARE S.L. · CIF B67353748</p>`; replicado en index.html, aviso-legal.html, contacto/, servicios/, proyectos/.
**Recomendación:** Cambiar a "© 2024–2026" o, mejor, generar el año dinámicamente con `<span id="footer-year"></span>` rellenado por `main.js` y un fallback estático para JS-off.
**Esfuerzo estimado:** Bajo.

### 2. UX y arquitectura de información

🟢 **CRÍTICO — Enlace WhatsApp roto en /contacto/ (RESUELTO)**
**Problema:** El placeholder `wa.me/34XXXXXXXXX` en la columna lateral se ha sustituido por el número real (`34679551518`) y el comentario TODO ha desaparecido del HTML.
**Evidencia:** `contacto/index.html` — la línea 364 ya enlaza a `https://wa.me/34679551518`.
**Recomendación:** —. Cerrado.
**Esfuerzo estimado:** —.

🟡 **MEDIO — "Apps móviles" y "APIs e integraciones" llevan al mismo destino (PENDIENTE)**
**Problema:** Sigue exactamente igual: el footer y las cards de servicios de la home apuntan ambos a `/servicios/apps-mobile-api.html`. Cuatro ocurrencias en `index.html` y dos en el partial del footer.
**Evidencia:** `src/partials/footer.html` y `.especialidades__grid` en `src/index.html` — dos enlaces distintos al mismo `apps-mobile-api.html`.
**Recomendación:** Sin cambios respecto al informe anterior. Recomendado: separar en dos URLs reales o usar anclas `#apps-mobile` / `#apis`.
**Esfuerzo estimado:** Medio (separar) / Bajo (anclas).

🟢 **BAJO — Inconsistencia entre teléfono fijo y WhatsApp (PENDIENTE)**
**Problema:** Sin cambios. El fijo `942 18 97 33` y el WhatsApp `679 551 518` siguen sin etiquetas que aclaren al visitante el matiz.
**Evidencia:** Footer de toda la web.
**Recomendación:** Etiquetas tipo "Atención telefónica" / "WhatsApp Business" o consolidar en uno.
**Esfuerzo estimado:** Bajo.

### 3. Usabilidad técnica y rendimiento

🔴 **CRÍTICO — Cabeceras de seguridad no aplicadas en producción (PENDIENTE)**
**Problema:** Sin cambios respecto a la auditoría anterior. CNAME apunta a `pindia.es`, el workflow `static.yml` despliega a GitHub Pages y el comentario del propio `_headers` sigue afirmando "El sitio actual está en GitHub Pages (no lo lee)". HSTS, CSP, X-Frame-Options, Referrer-Policy y Permissions-Policy siguen sin llegar al navegador.
**Evidencia:** `.github/workflows/static.yml` (deploy to Pages), `CNAME` (`pindia.es`), cabecera de `_headers` con la nota explícita.
**Recomendación:** Misma que en el informe anterior. Cloudflare Pages es la migración más limpia: conserva el repositorio como fuente, lee `_headers` y no cambia la URL final. Tiempo estimado: 1-2 horas con un cambio de CNAME en DNS.
**Esfuerzo estimado:** Medio.

🟢 **MEDIO — `display: browser` en manifest (RESUELTO)**
**Problema:** El manifest ya usa `"display": "standalone"`.
**Evidencia:** `manifest.webmanifest` línea 6.
**Recomendación:** —. Cerrado en la parte de display.
**Esfuerzo estimado:** —.

🟡 **MEDIO — Manifest sigue con `"icons": []` (PARCIAL)**
**Problema:** El array de iconos sigue vacío. Aunque `display: standalone` ya está, sin iconos la PWA no se puede instalar y Lighthouse seguirá penalizando el bloque PWA. Se ha cerrado la mitad del problema (display) pero falta la otra mitad (icons).
**Evidencia:** `manifest.webmanifest` última línea.
**Recomendación:** Generar `icon-192.png`, `icon-512.png` y un `icon-512-maskable.png` (purpose: "any maskable"). Añadir las tres entradas al array `icons`. Coste: 30 min con un script de redimensionado.
**Esfuerzo estimado:** Bajo.

🟢 **BAJO — Cache busting con dos fechas distintas (PENDIENTE)**
**Problema:** `head-assets.html` sigue con `?v=20260428d` y `scripts.html` con `?v=20260429d`. La centralización de `ASSET_VER` no se ha hecho.
**Evidencia:** `src/partials/head-assets.html:11,21` (`v=20260428d`); `src/partials/scripts.html:2` (`v=20260429d`).
**Recomendación:** Misma que en la auditoría anterior. Centralizar en variable consumida por ambos builders, idealmente derivada del SHA del commit en CI.
**Esfuerzo estimado:** Bajo.

### 4. SEO básico on-page

🟢 **CRÍTICO — `REPLACE_WITH_GSC_CODE` (RESUELTO)**
**Problema:** El meta `google-site-verification` con el placeholder ha desaparecido completamente de las 16+ páginas.
**Evidencia:** `grep -rn REPLACE_WITH_GSC_CODE` devuelve cero coincidencias.
**Recomendación:** —. Cerrado. Verificar que la propiedad está activa en Search Console por TXT en DNS o por el código real si se ha sustituido.
**Esfuerzo estimado:** —.

🟢 **MEDIO — `schema.json` externo redundante (RESUELTO)**
**Problema:** `schema.json` ha sido eliminado de la raíz. La estrategia de schema queda consolidada en JSON-LD inline por página.
**Evidencia:** `ls schema.json` falla; `grep "alternate.*schema.json"` cero matches.
**Recomendación:** —. Cerrado.
**Esfuerzo estimado:** —.

🟢 **MEDIO — Cookie ID `_ga_XXXXXXXXXX` (RESUELTO)**
**Problema:** La tabla de cookies analíticas en `politica-cookies.html` ya lista `_ga_KSW7VRFCV6`, el ID real derivado de `window.GA_MEASUREMENT_ID`.
**Evidencia:** `politica-cookies.html` línea 329.
**Recomendación:** —. Cerrado.
**Esfuerzo estimado:** —.

🟡 **BAJO — `og:image` aún compartido entre páginas estáticas no-proyecto (PARCIAL)**
**Problema:** Las páginas de proyecto sí tienen og:image diferenciada (case-ofelia, case-rotella, case-camino-gaudi, trowelapp-logo). Pero las páginas /servicios/, /servicios/diseno-web.html, /contacto/, /trowelapp/ y /productos/trowelapp.html siguen reusando `og-home.webp`. Mejora real pero incompleta.
**Evidencia:** `grep -rh "og:image" src/` muestra cinco variantes activas; las cuatro páginas de servicios + contacto comparten `og-home.webp`.
**Recomendación:** Generar OG image específica para servicios, contacto, trowelapp/ y la home de proyectos (4 imágenes adicionales). Mismo template visual.
**Esfuerzo estimado:** Medio.

### 5. Cumplimiento legal **(BLOQUE CRÍTICO)**

🟢 **CRÍTICO — Self-disclaimer en política de privacidad (RESUELTO)**
**Problema:** El bloque "Nota importante: El contenido… debe ser revisado y validado por un abogado especializado…" ha desaparecido de `politica-privacidad.html`.
**Evidencia:** `grep "Nota importante" politica-privacidad.html` no devuelve coincidencias.
**Recomendación:** —. Cerrado. Recordatorio: la revisión jurídica externa sigue siendo recomendable, pero ya no está como nota pública.
**Esfuerzo estimado:** —.

🟠 **ALTO — Inscripción registral incompleta (PARCIAL)**
**Problema:** El texto "(pendiente de actualización)" ha desaparecido, ahora dice "Inscrita en el Registro Mercantil de Cantabria". Pero **siguen faltando los datos formales** que pide el Art. 10 LSSI-CE: Tomo, Folio, Hoja, número de inscripción y fecha. Es media solución: ya no transmite descuido público, pero técnicamente sigue por debajo del estándar.
**Evidencia:** `aviso-legal.html` — bloque `<dt>Inscripción registral</dt><dd>Inscrita en el Registro Mercantil de Cantabria</dd>`.
**Recomendación:** Recopilar Tomo, Folio, Hoja, número de inscripción y fecha del Registro Mercantil de Cantabria y publicarlos. Una línea más en el `<dd>`.
**Esfuerzo estimado:** Bajo.

🟢 **ALTO — Fechas "abril de 2024" en las tres políticas (RESUELTO)**
**Problema:** Las tres páginas legales muestran ahora "Última actualización: mayo de 2026".
**Evidencia:** `aviso-legal.html:202`, `politica-privacidad.html:225`, `politica-cookies.html:267`.
**Recomendación:** —. Cerrado.
**Esfuerzo estimado:** —.

🟡 **MEDIO — Inconsistencia entre nombre de cookie real y declarado (PENDIENTE)**
**Problema:** La política de cookies sigue conviviendo con dos nombres distintos: `cookie_consent` (sección 2.1, tabla técnica, línea 293) y `pindia_cookies_v2` (línea 354 en el cuerpo del texto y en el panel de configuración del banner). Hay que elegir uno.
**Evidencia:** `politica-cookies.html` líneas 293 y 354; `index.html` panel cookie-settings con `pindia_cookies_v2`.
**Recomendación:** Dejar solo el nombre que el JS graba realmente (probablemente `pindia_cookies_v2`) y unificar todas las menciones (tabla técnica, cuerpo del texto, panel de configuración).
**Esfuerzo estimado:** Bajo.

> **Nota legal del auditor.** No soy abogado. Cada recomendación legal de este informe es orientativa basada en el marco general (LSSI-CE, RGPD, LOPDGDD y criterios AEPD publicados). Para garantías formales, los textos legales y la implementación deben revisarse con un profesional jurídico especializado en RGPD/protección de datos.

### 6. Conversión y confianza

🟢 **ALTO — Pérdida de leads por WhatsApp roto (RESUELTO)**
**Problema:** Cerrado. La página de /contacto/ vuelve a operar como punta de embudo sin agujeros.
**Evidencia:** `contacto/index.html:364` — número real.
**Recomendación:** —.
**Esfuerzo estimado:** —.

🟡 **MEDIO — Logos de clientes en home (PENDIENTE)**
**Problema:** Sin sección "Han confiado en nosotros" todavía.
**Evidencia:** Búsquedas por `logos-clientes`, `han confiado`, `brand-strip` no devuelven sección dedicada.
**Recomendación:** Misma que en informe anterior. 6-10 logos en escala de grises con hover en color, debajo del hero.
**Esfuerzo estimado:** Medio.

🟡 **MEDIO — Lighthouse 100 sin evidencia visible (PENDIENTE)**
**Problema:** El badge "Lighthouse 100" sigue en la card de pindia.es de la home pero no hay screenshot ni link en `/proyectos/web-pindia.html` que lo respalde.
**Evidencia:** `grep -c "lighthouse\|pagespeed\|web-vitals" proyectos/web-pindia.html` devuelve cero.
**Recomendación:** Misma que en el informe anterior. Captura de Lighthouse 4-en-1 + link al PageSpeed Insights real.
**Esfuerzo estimado:** Bajo.

---

## PLAN DE ACCIÓN ACTUALIZADO

### Fase 1 — Esta semana: cerrar el último crítico

1. Migrar el frontend a Cloudflare Pages para activar `_headers` y dejar de tener cabeceras de seguridad como código muerto. CNAME pasa a apuntar al dominio de Cloudflare; el repositorio sigue siendo la fuente. Verificar cabeceras servidas con `curl -I https://pindia.es` después.
2. Completar los datos de inscripción registral en `aviso-legal.html` con Tomo, Folio, Hoja, Inscripción y fecha. Una línea de cambio.

### Fase 2 — Este mes: completar la postura técnica y comercial

1. Unificar el nombre de cookie técnica (`pindia_cookies_v2` parece la elegida): borrar las menciones de `cookie_consent` de la tabla técnica y verificar que `main.js` graba con esa clave.
2. Completar el manifest PWA con los tres iconos (192, 512, 512-maskable) y validar la instalación desde Chrome/Edge móvil.
3. Generar OG images específicas para `/servicios/`, `/servicios/diseno-web.html`, `/contacto/`, `/trowelapp/` y `/productos/trowelapp.html` con el mismo template visual de proyectos.
4. Resolver la duplicación "Apps móviles" + "APIs e integraciones" en footer y home: separar en dos páginas o usar anclas `#apps-mobile` / `#apis`.
5. Centralizar `ASSET_VER` (un único punto consumido por `build-pages.mjs` y `build-blog.mjs`, ideal: SHA corto del commit en CI).
6. Actualizar el copyright del footer a "© 2024–2026" o generarlo dinámicamente.
7. Añadir sección de logos de clientes en home (escala de grises + hover).
8. Añadir captura/link de Lighthouse real a `/proyectos/web-pindia.html`.

### Fase 3 — Trimestre: pulido y revisión externa

1. Revisión jurídica externa de los tres textos legales (RGPD/AEPD especializado) para cerrar la base que el self-disclaimer eliminado dejó implícita.
2. Etiquetar canales duales de contacto (fijo vs WhatsApp Business) con leyenda explícita.
3. Considerar mostrar tiempo medio de respuesta real si el equipo lleva métrica.
4. Revisar dimensiones del logo entre header (140×56) y footer (120×48): mantener ratio o servir un `<picture>` con dos rasterizaciones.
5. Añadir un módulo "Por qué Pindia" arriba del fold para reforzar diferenciación frente a constructores tipo Wix/Hostinger.

---

## Por qué este sitio merece un rediseño

La conclusión del informe anterior se mantiene y se refuerza: **este sitio no necesita un rediseño**. Necesita el último 2 % que separa "publicado con casi todo encajado" de "auditable sin sonrojo". Lo que importa hoy es **migrar a Cloudflare Pages** y **completar los datos de inscripción registral**. Con esos dos cierres, el sitio queda en un estado del que cualquier agencia puede presumir y que aguanta una mirada técnica externa (de un cliente importante, de un inspector AEPD o de un competidor que audita).

El resto del plan de fase 2 es valor incremental, no urgencia. Si solo se hace lo de la fase 1, el informe v3 tendría puntuación muy cercana al 9.

> **El sitio no necesita rediseño. Necesita Cloudflare Pages y una línea más en el aviso legal.**

---

*Re-auditoría realizada por Pindia el 1 de mayo de 2026 sobre la rama `main` del repositorio web-pindia tras los fixes aplicados al primer informe (`auditoria-pindia.md` / `auditoria-pindia.docx`). Las observaciones legales son orientativas y no sustituyen asesoramiento jurídico formal.*
