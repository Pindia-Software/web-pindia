# Pindia SEO — Tareas para desarrollo

Estado a fecha de hoy. Marcar `[x]` según se completen.
Prioridad: 🔴 alta · 🟡 media · 🟢 rápida/fácil

---

## Registro — sesión 22 jul 2026
Publicado y en vivo en pindia.es: **landing `/servicios/mantenimiento-web`** (precios 99/199/A medida),
**post reoptimizado de mantenimiento** y **post nuevo "diseño web a medida"** (con portada). Las 3 URLs
**solicitadas a indexar** en GSC. Semrush pasado a base España, keywords comerciales en Position Tracking,
y propiedad de Borja conectada a Semrush. **Pendiente principal: Google Business Profile (Bloque 4).**

---

## Contexto en una línea
Partimos de visibilidad 1,84% en Semrush, rankeando solo por marca. Estrategia validada con
datos reales. Solo 2 artículos tienen keyword confirmada con datos: **mantenimiento web** y
**diseño web a medida**. El resto del contenido escrito queda EN ESPERA hasta validar keyword.

---

## BLOQUE 1 · Ajustes de cuenta (desbloquea medición)
- [x] 🟢 Semrush: cambiar base de datos del panel de *United States* → **Spain**
- [ ] 🔴 GSC: dar de alta `sc-domain:pindia.es` (propiedad de **Dominio**, verificación DNS)
      → Quedó **sin verificar**. Se decidió usar la propiedad **de Borja** (con histórico) + la de
        **URL-prefix** `https://pindia.es/` (a la que Bea sí tiene acceso). Revisar más adelante si
        conviene verificar la de Dominio (captura http+https+subdominios).
- [ ] 🟡 GSC: añadir a `borja.garciac@pindia.es` como propietario de esa propiedad
      → No aplica tal cual: la propiedad "buena" ya es de Borja. Pendiente al revés: que Borja añada
        a Bea a la suya si se quiere el histórico dentro de su cuenta.
- [x] 🟡 Semrush: conectar la propiedad de Google (Gestionar servicios de Google) → conectada la de Borja
- [x] 🟡 Semrush Position Tracking: keywords comerciales añadidas (`diseño web a medida`,
      `desarrollo web a medida`, `mantenimiento web`, `software a medida`, `diseño web cantabria`)
      con etiqueta `comercial`. Campaña pindia.es en 108 keywords.
- [ ] 🟢 GSC: Organic Traffic Insights + On Page SEO Checker
      → OTI **pospuesto** (aporta poco con 3 clics; primero generar tráfico). On Page SEO Checker pendiente.

## BLOQUE 2 · Mantenimiento web  🔴 (keyword transaccional, 2.900 búsq/mes) — ✅ PUBLICADO
Artículo: `/blog/posts/mantenimiento-web-empresas-cantabria/` (NO cambiar slug — ya indexado)
- [x] 🔴 title → `Mantenimiento web para empresas: qué incluye y cuánto cuesta`
- [x] 🔴 meta description
- [x] 🔴 H1 y secciones nuevas (planes, contrato, timos, WP vs medida, FAQ)
- [x] 🟡 `alt` de la cover (quitada la sobre-localización en Cantabria)
- [x] 🔴 **Página `/servicios/mantenimiento-web` con packs y precios** (99 / 199 / A medida, aprobados por Borja)
- [x] 🟡 "Mantenimiento web" añadido al footer e índice de servicios (nota: no está en el navbar superior)
- [x] 🔴 JSON-LD: FAQPage + LocalBusiness (+ BlogPosting/Breadcrumb que genera el build)
- [ ] 🟡 Actualizar fecha `updated` → N/A: el build no soporta campo `updated`; se republicó con la misma fecha
- [x] 🟢 GSC → Solicitar indexación

## BLOQUE 3 · Diseño web a medida  🔴 (4.300 búsq/mes, KD 13-14) — ✅ PUBLICADO
Artículo: `/blog/posts/diseno-web-a-medida/`
- [x] 🔴 Publicar artículo (con portada)
- [x] 🔴 JSON-LD: FAQPage + LocalBusiness
- [ ] 🟡 Confirmar si se pueden nombrar clientes (4Beats/Expertus/Würth) → bloque Reviews del SERP
- [x] 🟡 Verificar enlaces internos → OK; corregidos 2 slugs rotos (`precio-pagina-web-cantabria`
      y `migrar-web-sin-perder-seo`)
- [x] 🟢 GSC → Solicitar indexación
- [ ] 🟢 Enlazar este artículo DESDE los ya publicados: wordpress-vs-medida, precio-pagina-web, mantenimiento

## BLOQUE 4 · Transversal — ⏳ PENDIENTE (lo más rentable que queda)
- [ ] 🔴 **Optimizar Google Business Profile** (categorías "Diseñador de páginas web" +
      "Desarrollador de software", fotos, reseñas) — palanca del Local pack ← PRÓXIMO
- [x] 🟡 Plantilla `LocalBusiness` reutilizable → implementada en landing + 2 posts; snippet en `docs/schema-snippets.md`
- [ ] 🟢 Pedir reseña de Google a clientes actuales (4Beats, Expertus, Würth…)

---

## EN ESPERA (no publicar hasta validar keyword con datos)
- Artículos A03 (agencia ia cantabria = 0 búsq) y A07 (software a medida cantabria = 0 búsq)
- W02 y W05 (cluster IA: KD 52-62, público DIY que no contrata)
- Reutilizar su contenido dentro de artículos con keyword válida, no como piezas propias

## SIGUIENTE EN LA COLA (keyword ya validada, aún sin redactar)
1. `software a medida` — 1.000 búsq · KD 17 · CPC 7,02 € (el clic más caro del dataset)
2. `posicionamiento web santander` — 210 · KD 2 (regalo)
3. `tienda online a medida` — 210 · KD 4 (abre cluster ecommerce)
