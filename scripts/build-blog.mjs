#!/usr/bin/env node
/**
 * build-blog.mjs — Compilador de posts Markdown del blog de Pindia Software
 *
 * Lee:   /blog/src/posts/*.md
 * Genera:
 *   /blog/index.html                       (listado, página 1)
 *   /blog/page/<n>/index.html              (páginas siguientes)
 *   /blog/posts/<slug>/index.html          (post individual)
 *   /blog/rss.xml
 *   /sitemap.xml                           (regenerado con posts añadidos)
 *
 * Frontmatter soportado (YAML):
 *   title       (string, requerido)
 *   description (string)
 *   date        (YYYY-MM-DD, requerido)
 *   author      (string)
 *   tags        (lista)
 *   cover       (path absoluto a la imagen principal — hero + listado + og:image)
 *   coverAlt    (alt text del cover)
 *   images      (lista de { src, alt, caption } — galería al final del post)
 *   draft       (true/false, por defecto false)
 *
 * Markdown: sintaxis estándar + imágenes ![alt](/ruta) inline.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

import matter from 'gray-matter';
import { marked } from 'marked';

// ── Config ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const POSTS_SRC = join(ROOT, 'blog', 'src', 'posts');
const POSTS_OUT = join(ROOT, 'blog', 'posts');
const PAGE_OUT  = join(ROOT, 'blog', 'page');
const TAG_OUT   = join(ROOT, 'blog', 'tag');
const BLOG_OUT  = join(ROOT, 'blog');
const SITE_URL  = 'https://pindia.es';
const PER_PAGE  = 6;
const ASSET_VER = 'v=20260426b';

// ── Utilidades ───────────────────────────────────────────────────────────────

function formatDateES(d) {
  const date = new Date(d);
  const utc  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return utc.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateISO(d) {
  const date = new Date(d);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateRFC822(d) { return new Date(d).toUTCString(); }

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

// ── Marked: renderer custom ──────────────────────────────────────────────────
//
// - Imágenes: lazy + decoding async + clase prose__img
// - Enlaces externos: rel noopener
// - Encabezados: id automático (slug del texto) para anchors

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const renderer = new marked.Renderer();

renderer.image = ({ href, title, text }) => {
  const alt = escapeHTML(text || '');
  const ttl = title ? ` title="${escapeHTML(title)}"` : '';
  return `<figure class="prose__figure"><img src="${escapeHTML(href)}" alt="${alt}"${ttl} loading="lazy" decoding="async" class="prose__img">${title ? `<figcaption class="prose__caption">${escapeHTML(title)}</figcaption>` : ''}</figure>`;
};

renderer.link = function({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
  const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : '';
  const ttl = title ? ` title="${escapeHTML(title)}"` : '';
  return `<a href="${escapeHTML(href)}"${ttl}${rel}>${text}</a>`;
};

renderer.heading = function({ text, depth, tokens }) {
  const inline = this.parser.parseInline(tokens);
  const plain = tokens.map(t => t.text || t.raw || '').join('');
  const id = slugify(plain);
  return `<h${depth} id="${id}"><a href="#${id}" class="prose__anchor" aria-label="Enlace a esta sección">#</a>${inline}</h${depth}>`;
};

renderer.strong = function({ tokens }) {
  return `<strong>${this.parser.parseInline(tokens)}</strong>`;
};

renderer.em = function({ tokens }) {
  return `<em>${this.parser.parseInline(tokens)}</em>`;
};

renderer.codespan = ({ text }) => {
  return `<code>${escapeHTML(text)}</code>`;
};

renderer.table = function({ header, rows }) {
  const headHTML = header.map(cell => this.tablecell(cell)).join('');
  const bodyHTML = rows.map(row => `<tr>${row.map(cell => this.tablecell(cell)).join('')}</tr>`).join('');
  return `<div class="prose__table-wrapper"><table class="prose__table"><thead><tr>${headHTML}</tr></thead><tbody>${bodyHTML}</tbody></table></div>`;
};

renderer.tablecell = function({ tokens, header, align }) {
  const text = this.parser.parseInline(tokens);
  const alignAttr = align ? ` style="text-align:${align}"` : '';
  const tag = header ? 'th' : 'td';
  return `<${tag}${alignAttr}>${text}</${tag}>`;
};

marked.use({ renderer, gfm: true, breaks: false });

// ── Partials (nav, footer, cookie banner) ────────────────────────────────────
// Idénticos a /blog/index.html para mantener coherencia visual + a11y.

function navHTML(currentPage) {
  const isActive = (page) => page === currentPage ? ' aria-current="page"' : '';
  return `
  <header class="nav" role="banner">
    <div class="container">
      <div class="nav__inner">

        <a href="/web-pindia/" class="nav__logo" aria-label="Pindia Software — Inicio">
          <img src="/assets/icons/logo-nav.svg" alt="Pindia Software" width="140" height="56" loading="eager">
        </a>

        <nav class="nav__links" aria-label="Navegación principal">
          <a href="/servicios/" class="nav__link"${isActive('servicios')}>Servicios</a>
          <a href="/proyectos/" class="nav__link"${isActive('proyectos')}>Proyectos</a>
          <a href="/blog/" class="nav__link"${isActive('blog')}>Blog</a>
        </nav>

        <div class="nav__actions">
          <a href="/contacto/" class="btn btn--primary">Hablemos</a>
          <button class="nav__toggle" aria-expanded="false" aria-controls="nav-drawer" aria-label="Abrir menú">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <nav id="nav-drawer" class="nav__drawer" aria-label="Menú móvil">
    <a href="/servicios/" class="nav__link"${isActive('servicios')}>Servicios</a>
    <a href="/proyectos/" class="nav__link"${isActive('proyectos')}>Proyectos</a>
    <a href="/blog/" class="nav__link"${isActive('blog')}>Blog</a>
    <a href="/contacto/" class="btn btn--primary btn--lg" style="width:100%;margin-top:auto;">Hablemos de tu proyecto</a>
  </nav>`.trim();
}

function footerHTML() {
  return `
  <footer class="footer" role="contentinfo">
    <div class="container">

      <div class="footer__grid">

        <div class="footer__brand">
          <img src="/assets/icons/logo-nav.svg" alt="Pindia Software" class="footer__logo" width="120" height="48" loading="lazy">
          <p>Agencia de software a medida y diseño web en Santander. Construimos tu presencia digital desde Cantabria para toda España.</p>
        </div>

        <nav class="footer__col" aria-label="Servicios">
          <h3>Servicios</h3>
          <ul class="footer__links" role="list">
            <li><a href="/servicios/desarrollo-software.html">Desarrollo software</a></li>
            <li><a href="/servicios/diseno-web.html">Diseño web</a></li>
            <li><a href="/servicios/apps-mobile-api.html">Apps móviles</a></li>
            <li><a href="/servicios/apps-mobile-api.html">APIs e integraciones</a></li>
          </ul>
        </nav>

        <nav class="footer__col" aria-label="Empresa">
          <h3>Empresa</h3>
          <ul class="footer__links" role="list">
            <li><a href="/proyectos/">Proyectos</a></li>
            <li><a href="/productos/trowelapp.html">TrowelApp</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contacto/">Contacto</a></li>
          </ul>
        </nav>

        <div class="footer__col footer__nap">
          <h3>Contacto</h3>
          <address>
            <a href="tel:+34942189733" class="footer__nap-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
              (+34) 942 18 97 33
            </a>
            <a href="mailto:info@pindia.es" class="footer__nap-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@pindia.es
            </a>
            <a href="https://wa.me/34XXXXXXXXX" target="_blank" rel="noopener" class="footer__nap-item">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="color:var(--accent)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Business
            </a>
            <span class="footer__nap-item" style="cursor:default">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Calle Ramón Ramírez 5, 1º, 39100 Santa Cruz de Bezana</span>
            </span>
          </address>
        </div>

      </div>

      <div class="footer__bottom">
        <p class="footer__copy">© 2024 PINDIA SOFTWARE S.L. · CIF B67353748</p>
        <nav class="footer__legal" aria-label="Páginas legales">
          <a href="/aviso-legal.html">Aviso legal</a>
          <a href="/politica-privacidad.html">Política de privacidad</a>
          <a href="/politica-cookies.html">Política de cookies</a>
        </nav>
      </div>

    </div>
  </footer>`.trim();
}

function cookieBannerHTML() {
  return `
  <div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
    <div class="cookie-banner__inner">
      <p class="cookie-banner__text">
        Usamos cookies analíticas (Google Analytics 4) para mejorar tu experiencia. Por defecto están desactivadas. Puedes aceptarlas o rechazarlas. Más info en nuestra <a href="/politica-cookies.html">política de cookies</a>.
      </p>
      <div class="cookie-banner__actions">
        <button id="cookie-reject" class="btn btn--secondary">Rechazar</button>
        <button id="cookie-accept" class="btn btn--primary">Aceptar cookies</button>
      </div>
    </div>
  </div>`.trim();
}

function commonHead({ title, description, canonical, ogImage, extraSchema = [], prev = '', next = '' }) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="${escapeHTML(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="noindex, nofollow">
  ${prev ? `<link rel="prev" href="${prev}">` : ''}
  ${next ? `<link rel="next" href="${next}">` : ''}

  <!-- Open Graph -->
  <meta property="og:type"        content="article">
  <meta property="og:title"       content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(description)}">
  <meta property="og:image"       content="${ogImage}">
  <meta property="og:url"         content="${canonical}">
  <meta property="og:locale"      content="es_ES">
  <meta property="og:site_name"   content="Pindia Software">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escapeHTML(title)}">
  <meta name="twitter:description" content="${escapeHTML(description)}">
  <meta name="twitter:image"       content="${ogImage}">

  <!-- Favicons -->
  <link rel="icon" type="image/png" href="/assets/favicons/favicon.png">
  <link rel="apple-touch-icon" href="/assets/favicons/favicon.png">
  <link rel="manifest"         href="/manifest.webmanifest">
  <meta name="theme-color"     content="#22293E">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"></noscript>

  <!-- GA4 -->
  <script>window.GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';</script>

  <!-- Styles -->
  <link rel="stylesheet" href="/css/styles.min.css?${ASSET_VER}">

  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title="Blog Pindia Software" href="/blog/rss.xml">
${extraSchema.map(s => `  <script type="application/ld+json">${s}</script>`).join('\n')}`;
}

// ── CTA Template ────────────────────────────────────────────────────────────

function postCTAHTML() {
  return `
        <section class="post-cta" aria-labelledby="post-cta-title" style="margin-top:var(--sp-16);background:#0F172A;border:1px solid #1E293B;border-radius:var(--r-xl);overflow:hidden;max-width:880px;margin-inline:auto;position:relative" data-reveal>
          <div class="post-cta__grid" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);align-items:center;gap:0">
            <div class="post-cta__media" style="position:relative;aspect-ratio:1/1;background:#0F172A">
              <img src="/assets/img/blog/cta/robot-ayuda.webp" alt="Robot de Pindia con los brazos abiertos ofreciendo ayuda" loading="lazy" decoding="async" width="600" height="600" style="width:100%;height:100%;object-fit:cover;display:block">
            </div>
            <div class="post-cta__body" style="padding:var(--sp-10) var(--sp-10);color:#F8FAFC">
              <span style="display:inline-flex;align-items:center;gap:6px;font-size:var(--text-xs);font-weight:var(--w-sb);letter-spacing:.08em;text-transform:uppercase;color:#FF7A73;margin-bottom:var(--sp-3)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Pindia te acompaña
              </span>
              <h2 id="post-cta-title" style="font-size:var(--text-2xl);font-weight:var(--w-sb);line-height:1.2;color:#F8FAFC;margin-bottom:var(--sp-3)">Te echamos una mano con tu proyecto</h2>
              <p style="font-size:var(--text-sm);color:#CBD5E1;line-height:1.65;margin-bottom:var(--sp-6)">
                Auditorías, rediseños, integraciones o desarrollo a medida: ponemos nuestro equipo a tu disposición para resolver lo que tu web necesita.
              </p>
              <div style="display:flex;flex-wrap:wrap;gap:var(--sp-3);align-items:center">
                <a href="/contacto/" class="btn btn--primary">
                  Cuéntanos tu caso
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left:6px"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
                <a href="/servicios/" style="font-size:var(--text-sm);font-weight:var(--w-md);color:#F8FAFC;text-decoration:underline;text-decoration-color:rgba(248,250,252,.35);text-underline-offset:4px">Ver servicios</a>
              </div>
            </div>
          </div>
        </section>
        <style>
          @media (max-width: 768px) {
            .post-cta__grid { grid-template-columns: 1fr !important; }
            .post-cta__media { aspect-ratio: 16/10 !important; }
            .post-cta__body { padding: var(--sp-8) var(--sp-6) !important; }
          }
        </style>`;
}

// ── Plantilla post individual ────────────────────────────────────────────────

function renderPost(post) {
  const { slug, data, content } = post;
  const title       = data.title;
  const description = data.description || '';
  const date        = data.date;
  const author      = data.author || 'Pindia Software';
  const tags        = Array.isArray(data.tags) ? data.tags : [];
  const cover       = data.cover || '';
  const coverAlt    = data.coverAlt || title;
  const gallery     = Array.isArray(data.images) ? data.images : [];

  const dateISO     = formatDateISO(date);
  const dateDisplay = formatDateES(date);
  const url         = `${SITE_URL}/blog/posts/${slug}/`;
  const ogImage     = cover ? `${SITE_URL}${cover}` : `${SITE_URL}/assets/img/og-home.webp`;
  const minutes     = readingTime(content);
  const htmlBody    = marked.parse(content);

  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog',   item: `${SITE_URL}/blog/` },
      { '@type': 'ListItem', position: 3, name: title,    item: url },
    ],
  });

  const article = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: dateISO,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'Pindia Software S.L.', url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/icons/logo-nav.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(cover ? { image: ogImage } : {}),
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
  });

  const galleryHTML = gallery.length ? `
        <section class="post-gallery" aria-labelledby="gallery-title">
          <h2 id="gallery-title" class="post-gallery__title">Galería</h2>
          <div class="post-gallery__grid">
            ${gallery.map(img => `
            <figure class="post-gallery__item">
              <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.alt || '')}" loading="lazy" decoding="async">
              ${img.caption ? `<figcaption>${escapeHTML(img.caption)}</figcaption>` : ''}
            </figure>`).join('')}
          </div>
        </section>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
${commonHead({
    title: `${title} | Blog Pindia Software`,
    description: description || `Artículo de Pindia Software: ${title}`,
    canonical: url,
    ogImage,
    extraSchema: [breadcrumb, article],
  })}
</head>

<body>

  <a href="#main" class="skip-link">Saltar al contenido principal</a>

  ${navHTML('blog')}

  <main id="main">

    <!-- BREADCRUMB -->
    <nav class="post__breadcrumb" aria-label="Ruta de navegación">
      <div class="container">
        <ol>
          <li><a href="/web-pindia/">Inicio</a></li>
          <li aria-hidden="true">/</li>
          <li><a href="/blog/">Blog</a></li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page">${escapeHTML(title)}</span></li>
        </ol>
      </div>
    </nav>

    <article class="post" itemscope itemtype="https://schema.org/BlogPosting">

      <header class="post__header">
        <div class="container">
          <div class="post__header-inner">

            <a href="/blog/" id="post-back-link" class="post__back" aria-label="Volver al listado del blog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver al blog
            </a>

            <script>
              (function() {
                const params = new URLSearchParams(window.location.search);
                const page = params.get('page');
                const backLink = document.getElementById('post-back-link');
                if (backLink && page) {
                  const pageNum = parseInt(page, 10);
                  if (pageNum > 1) {
                    backLink.href = '/blog/page/' + pageNum + '/';
                  }
                }
              })();
            </script>

            <div class="post__meta">
              ${tags.map(t => `<span class="post__tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <h1 class="post__title" itemprop="headline">${escapeHTML(title)}</h1>
            ${description ? `<p class="post__lead">${escapeHTML(description)}</p>` : ''}
            <div class="post__byline">
              <time datetime="${dateISO}" itemprop="datePublished">${dateDisplay}</time>
              <span aria-hidden="true">·</span>
              <span class="post__author" itemprop="author">${escapeHTML(author)}</span>
              <span aria-hidden="true">·</span>
              <span class="post__reading-time">${minutes} min de lectura</span>
            </div>
          </div>
        </div>
      </header>

      ${cover ? `
      <figure class="post__cover-wrap">
        <div class="container">
          <img class="post__cover" src="${escapeHTML(cover)}" alt="${escapeHTML(coverAlt)}" itemprop="image" loading="eager" fetchpriority="high">
        </div>
      </figure>` : ''}

      <div class="container">
        <div class="post__body prose" itemprop="articleBody">
          ${htmlBody}
        </div>

        ${galleryHTML}

        ${postCTAHTML()}

        <footer class="post__footer">
          <a href="/blog/" class="btn btn--ghost">← Volver al blog</a>
        </footer>
      </div>

    </article>

  </main>

  ${footerHTML()}

  ${cookieBannerHTML()}

  <script src="/js/main.min.js?${ASSET_VER}" defer></script>

</body>
</html>`;
}

// ── Plantilla listado / paginación ───────────────────────────────────────────

function renderTagBar(tagList, activeTag) {
  if (!tagList.length) return '';
  const items = [
    `<a class="blog-filter${!activeTag ? ' is-active' : ''}" href="/blog/"${!activeTag ? ' aria-current="page"' : ''}>Todos</a>`,
    ...tagList.map(t => {
      const isActive = activeTag && activeTag.slug === t.slug;
      return `<a class="blog-filter${isActive ? ' is-active' : ''}" href="/blog/tag/${t.slug}/"${isActive ? ' aria-current="page"' : ''}>${escapeHTML(t.name)} <span class="blog-filter__count" aria-label="(${t.count} artículos)">${t.count}</span></a>`;
    }),
  ];
  return `
    <nav class="blog-filters" aria-label="Filtrar por etiqueta">
      <div class="container">
        <div class="blog-filters__list" role="list">
          ${items.map(x => `<span role="listitem">${x}</span>`).join('\n          ')}
        </div>
      </div>
    </nav>`;
}

function renderBlogList(posts, pageNum, totalPages, tagList = [], activeTag = null) {
  const isFirst = pageNum === 1;
  const basePath = activeTag ? `/blog/tag/${activeTag.slug}/` : '/blog/';
  const pageHref = (n) => n === 1 ? basePath : `${basePath}page/${n}/`;
  const path = pageHref(pageNum);
  const url = `${SITE_URL}${path}`;
  const prevURL = pageNum > 1 ? `${SITE_URL}${pageHref(pageNum - 1)}` : '';
  const nextURL = pageNum < totalPages ? `${SITE_URL}${pageHref(pageNum + 1)}` : '';

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Blog',   item: `${SITE_URL}/blog/` },
  ];
  if (activeTag) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: activeTag.name, item: `${SITE_URL}/blog/tag/${activeTag.slug}/` });
  }
  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  });

  const blogSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog de Pindia Software',
    url: `${SITE_URL}/blog/`,
    description: 'Ideas, novedades y reflexiones sobre software, diseño web y digitalización',
    publisher: { '@type': 'Organization', name: 'Pindia Software S.L.', url: SITE_URL },
  });

  const cards = posts.map(({ slug, data }) => {
    const t = data.title;
    const d = data.description || '';
    const dt = data.date;
    const cover = data.cover || '';
    const coverAlt = data.coverAlt || t;
    const tags = Array.isArray(data.tags) ? data.tags.slice(0, 2) : [];
    const purl = `/blog/posts/${slug}/?page=${pageNum}`;

    return `
          <article class="blog-card">
            ${cover ? `
            <a href="${purl}" class="blog-card__cover-link" tabindex="-1" aria-hidden="true">
              <img src="${escapeHTML(cover)}" alt="${escapeHTML(coverAlt)}" class="blog-card__cover" loading="lazy" decoding="async" width="800" height="450">
            </a>` : ''}
            <div class="blog-card__body">
              <div class="blog-card__date">
                <time datetime="${formatDateISO(dt)}">${formatDateES(dt)}</time>
              </div>
              <h2 class="blog-card__title">
                <a href="${purl}">${escapeHTML(t)}</a>
              </h2>
              <p class="blog-card__excerpt">${escapeHTML(d)}</p>
              ${tags.length ? `<div class="blog-card__tags">${tags.map(x => `<span class="post__tag">${escapeHTML(x)}</span>`).join('')}</div>` : ''}
              <a href="${purl}" class="blog-card__more" aria-label="Leer ${escapeHTML(t)}">
                Leer artículo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </article>`.trim();
  }).join('\n\n          ');

  const paginationHTML = totalPages > 1 ? `
        <nav class="pagination" aria-label="Paginación del blog">
          ${pageNum > 1
            ? `<a class="pagination__item pagination__item--prev" href="${pageHref(pageNum - 1)}" rel="prev">← Anterior</a>`
            : `<span class="pagination__item pagination__item--disabled" aria-hidden="true">← Anterior</span>`}
          <ol class="pagination__pages" role="list">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
              return n === pageNum
                ? `<li><span class="pagination__page pagination__page--current" aria-current="page">${n}</span></li>`
                : `<li><a class="pagination__page" href="${pageHref(n)}">${n}</a></li>`;
            }).join('')}
          </ol>
          ${pageNum < totalPages
            ? `<a class="pagination__item pagination__item--next" href="${pageHref(pageNum + 1)}" rel="next">Siguiente →</a>`
            : `<span class="pagination__item pagination__item--disabled" aria-hidden="true">Siguiente →</span>`}
        </nav>` : '';

  const heroLabel    = activeTag ? 'Etiqueta del blog' : 'Nuestro blog';
  const heroTitle    = activeTag ? activeTag.name : 'Blog';
  const heroSubtitle = activeTag
    ? `Artículos sobre <strong>${escapeHTML(activeTag.name)}</strong>${posts.length ? ` (${activeTag.count} ${activeTag.count === 1 ? 'artículo' : 'artículos'})` : ''}.`
    : 'Ideas, novedades y reflexiones sobre software, diseño web y digitalización.';
  const pageTitle = activeTag
    ? `${activeTag.name} | Blog Pindia Software`
    : (isFirst
      ? 'Blog — Ideas sobre software, diseño web y digitalización | Pindia Software'
      : `Blog (página ${pageNum}) | Pindia Software`);
  const pageDesc = activeTag
    ? `Artículos del blog de Pindia Software etiquetados con "${activeTag.name}". Contenido sobre software, diseño web y digitalización.`
    : 'Ideas, novedades y reflexiones sobre software, diseño web y digitalización desde Pindia Software en Santander. Artículos sobre tecnología, construcción y empresa.';

  const breadcrumbHTML = `
    <nav class="post__breadcrumb" aria-label="Ruta de navegación">
      <div class="container">
        <ol>
          <li><a href="/web-pindia/">Inicio</a></li>
          <li aria-hidden="true">/</li>
          ${activeTag
            ? `<li><a href="/blog/">Blog</a></li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page">${escapeHTML(activeTag.name)}${isFirst ? '' : ` · página ${pageNum}`}</span></li>`
            : `<li><span aria-current="page">Blog${isFirst ? '' : ` · página ${pageNum}`}</span></li>`}
        </ol>
      </div>
    </nav>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
${commonHead({
    title: pageTitle,
    description: pageDesc,
    canonical: url,
    ogImage: `${SITE_URL}/assets/img/og-home.webp`,
    extraSchema: [breadcrumb, blogSchema],
    prev: prevURL,
    next: nextURL,
  })}
</head>

<body>

  <a href="#main" class="skip-link">Saltar al contenido principal</a>

  ${navHTML('blog')}

  <main id="main">

    <!-- BREADCRUMB -->${breadcrumbHTML}

    <!-- HERO -->
    <section style="padding-block:var(--sp-12) var(--sp-6);background:var(--bg-main)" aria-labelledby="blog-hero-title">
      <div class="container">
        <div style="max-width:640px" data-reveal>
          <span class="section__label">${escapeHTML(heroLabel)}</span>
          <h1 id="blog-hero-title" class="section__headline" style="font-size:clamp(1.8rem,4vw,3rem)">${escapeHTML(heroTitle)}</h1>
          <p class="section__sub">${heroSubtitle}</p>
        </div>
      </div>
    </section>

    <!-- FILTRO POR TAGS -->${renderTagBar(tagList, activeTag)}

    <!-- ARTÍCULOS -->
    <section class="section" style="padding-top:var(--sp-8)" aria-label="Artículos del blog${activeTag ? ` etiquetados con ${activeTag.name}` : ''}${isFirst ? '' : ` — página ${pageNum}`}">
      <div class="container">

        <div class="blog-grid" data-reveal-group>

          ${cards}

        </div>

        ${paginationHTML}

        ${postCTAHTML()}

      </div>
    </section>

  </main>

  ${footerHTML()}

  ${cookieBannerHTML()}

  <script src="/js/main.min.js?${ASSET_VER}" defer></script>

</body>
</html>`;
}

// ── RSS ──────────────────────────────────────────────────────────────────────

function renderRSS(posts) {
  const items = posts.map(({ slug, data }) => `
    <item>
      <title>${escapeXML(data.title)}</title>
      <link>${SITE_URL}/blog/posts/${slug}/</link>
      <description>${escapeXML(data.description || '')}</description>
      <pubDate>${formatDateRFC822(data.date)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/posts/${slug}/</guid>
      <author>info@pindia.es (${escapeXML(data.author || 'Pindia Software')})</author>
      ${(Array.isArray(data.tags) ? data.tags : []).map(t => `<category>${escapeXML(t)}</category>`).join('')}
    </item>`.trim()).join('\n\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Pindia Software</title>
    <link>${SITE_URL}/blog/</link>
    <description>Noticias y artículos sobre software, diseño web y tecnología para empresas en Santander.</description>
    <language>es-es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>

    ${items}
  </channel>
</rss>`;
}

// ── Sitemap ──────────────────────────────────────────────────────────────────

function renderSitemap(posts, totalPages, tagPlan = []) {
  const today = formatDateISO(new Date());
  const staticUrls = [
    { loc: `${SITE_URL}/`,                                   lastmod: today, changefreq: 'weekly',  priority: '1.0' },
    { loc: `${SITE_URL}/servicios/`,                         lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { loc: `${SITE_URL}/servicios/diseno-web.html`,          lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/servicios/desarrollo-software.html`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/servicios/apps-mobile-api.html`,     lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/proyectos/`,                         lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/productos/trowelapp.html`,           lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { loc: `${SITE_URL}/blog/`,                              lastmod: today, changefreq: 'weekly',  priority: '0.7' },
    { loc: `${SITE_URL}/contacto/`,                          lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/aviso-legal.html`,                   lastmod: today, changefreq: 'yearly',  priority: '0.2' },
    { loc: `${SITE_URL}/politica-privacidad.html`,           lastmod: today, changefreq: 'yearly',  priority: '0.2' },
    { loc: `${SITE_URL}/politica-cookies.html`,              lastmod: today, changefreq: 'yearly',  priority: '0.2' },
  ];

  const pageUrls = Array.from({ length: totalPages - 1 }, (_, i) => ({
    loc: `${SITE_URL}/blog/page/${i + 2}/`, lastmod: today, changefreq: 'weekly', priority: '0.5',
  }));

  const postUrls = posts.map(({ slug, data }) => ({
    loc: `${SITE_URL}/blog/posts/${slug}/`,
    lastmod: formatDateISO(data.date),
    changefreq: 'yearly',
    priority: '0.6',
  }));

  const tagUrls = tagPlan.flatMap(({ tag, totalPages: tp }) =>
    Array.from({ length: tp }, (_, i) => i + 1).map(n => ({
      loc: `${SITE_URL}/blog/tag/${tag.slug}/${n === 1 ? '' : `page/${n}/`}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.5',
    }))
  );

  const all = [...staticUrls, ...pageUrls, ...postUrls, ...tagUrls];
  const entries = all.map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim()).join('\n\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  ${entries}

</urlset>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(POSTS_SRC)) {
  console.log('No existe /blog/src/posts/. Crea archivos .md y vuelve a ejecutar.');
  process.exit(0);
}

const mdFiles = readdirSync(POSTS_SRC).filter(f => f.endsWith('.md'));

if (mdFiles.length === 0) {
  console.log('No se encontraron .md en /blog/src/posts/.');
  process.exit(0);
}

const all = mdFiles.map(file => {
  const slug = basename(file, '.md');
  const raw  = readFileSync(join(POSTS_SRC, file), 'utf8');
  const { data, content } = matter(raw);
  return { slug, data, content };
});

const posts = all
  .filter(p => !p.data.draft)
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

if (posts.length === 0) {
  console.log('Todos los posts marcados draft. No se generó nada.');
  process.exit(0);
}

// Limpiar listados anteriores (page/, tag/) para no dejar huérfanos
if (existsSync(PAGE_OUT)) rmSync(PAGE_OUT, { recursive: true, force: true });
if (existsSync(TAG_OUT))  rmSync(TAG_OUT,  { recursive: true, force: true });

// Recolectar etiquetas únicas (orden: frecuencia desc, alfabético)
const tagCounts = new Map();
posts.forEach(p => (Array.isArray(p.data.tags) ? p.data.tags : []).forEach(t => {
  tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
}));
const tagList = [...tagCounts.entries()]
  .map(([name, count]) => ({ name, slug: slugify(name), count }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'));

// Posts individuales
for (const post of posts) {
  const outDir  = join(POSTS_OUT, post.slug);
  const outFile = join(outDir, 'index.html');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, renderPost(post), 'utf8');
  console.log(`✓ post: ${post.slug}`);
}

// Listados paginados (todos los posts)
const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
for (let n = 1; n <= totalPages; n++) {
  const slice = posts.slice((n - 1) * PER_PAGE, n * PER_PAGE);
  const outDir = n === 1 ? BLOG_OUT : join(PAGE_OUT, String(n));
  const outFile = join(outDir, 'index.html');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, renderBlogList(slice, n, totalPages, tagList, null), 'utf8');
  console.log(`✓ index página ${n}/${totalPages}`);
}

// Páginas filtradas por etiqueta
const tagPlan = [];
for (const tag of tagList) {
  const tagPosts = posts.filter(p =>
    (Array.isArray(p.data.tags) ? p.data.tags : []).some(t => slugify(t) === tag.slug)
  );
  const tp = Math.max(1, Math.ceil(tagPosts.length / PER_PAGE));
  tagPlan.push({ tag, totalPages: tp });

  for (let n = 1; n <= tp; n++) {
    const slice = tagPosts.slice((n - 1) * PER_PAGE, n * PER_PAGE);
    const outDir = n === 1
      ? join(TAG_OUT, tag.slug)
      : join(TAG_OUT, tag.slug, 'page', String(n));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), renderBlogList(slice, n, tp, tagList, tag), 'utf8');
  }
  console.log(`✓ tag: ${tag.slug} (${tagPosts.length} post${tagPosts.length === 1 ? '' : 's'}, ${tp} pág.)`);
}

// RSS
writeFileSync(join(BLOG_OUT, 'rss.xml'), renderRSS(posts), 'utf8');
console.log('✓ rss.xml');

// Sitemap
writeFileSync(join(ROOT, 'sitemap.xml'), renderSitemap(posts, totalPages, tagPlan), 'utf8');
console.log('✓ sitemap.xml');

console.log(`\nBlog OK · ${posts.length} post(s) · ${totalPages} página(s) · ${tagList.length} etiqueta(s) · ${PER_PAGE}/página`);
