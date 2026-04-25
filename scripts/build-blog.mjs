#!/usr/bin/env node
/**
 * build-blog.mjs — Compilador de posts Markdown para el blog de Pindia Software
 *
 * Uso:
 *   node scripts/build-blog.mjs
 *
 * Dependencias:
 *   npm install gray-matter marked
 *
 * Qué hace:
 *   1. Lee los archivos .md de /blog/src/posts/
 *   2. Parsea el frontmatter con gray-matter
 *   3. Convierte el Markdown a HTML con marked
 *   4. Genera /blog/posts/[slug]/index.html para cada post (no-draft)
 *   5. Genera /blog/index.html con el listado de posts
 *   6. Genera /blog/rss.xml con el feed RSS
 *   7. Regenera /sitemap.xml añadiendo las URLs de los posts
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Rutas ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const POSTS_SRC = join(ROOT, 'blog', 'src', 'posts');
const POSTS_OUT = join(ROOT, 'blog', 'posts');
const BLOG_OUT  = join(ROOT, 'blog');
const SITE_URL  = 'https://pindia.es';

// ── Dependencias ─────────────────────────────────────────────────────────────

let matter, marked;

try {
  ({ default: matter } = await import('gray-matter'));
} catch {
  console.error('ERROR: gray-matter no está instalado. Ejecuta: npm install gray-matter marked');
  process.exit(1);
}

try {
  ({ marked } = await import('marked'));
} catch {
  console.error('ERROR: marked no está instalado. Ejecuta: npm install gray-matter marked');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Formatea una fecha como "24 de abril de 2024" */
function formatDateES(dateInput) {
  const d = new Date(dateInput);
  // Corregir offset de zona horaria para evitar que retroceda un día
  const utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return utc.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Formatea una fecha como "2024-04-24" (ISO) */
function formatDateISO(dateInput) {
  const d = new Date(dateInput);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Formatea una fecha para RSS (RFC 822) */
function formatDateRFC822(dateInput) {
  const d = new Date(dateInput);
  return d.toUTCString();
}

/** Escapa caracteres XML */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Leer posts ───────────────────────────────────────────────────────────────

if (!existsSync(POSTS_SRC)) {
  console.log('No existe el directorio /blog/src/posts/ — no hay posts que compilar.');
  console.log('Crea archivos .md en /blog/src/posts/ y vuelve a ejecutar este script.');
  process.exit(0);
}

const mdFiles = readdirSync(POSTS_SRC).filter(f => f.endsWith('.md'));

if (mdFiles.length === 0) {
  console.log('No se encontraron archivos .md en /blog/src/posts/');
  console.log('Crea al menos un post y vuelve a ejecutar este script.');
  process.exit(0);
}

const allPosts = mdFiles.map(file => {
  const slug    = basename(file, '.md');
  const raw     = readFileSync(join(POSTS_SRC, file), 'utf8');
  const { data, content } = matter(raw);
  return { slug, data, content };
});

// Filtrar drafts y ordenar por fecha desc
const posts = allPosts
  .filter(p => !p.data.draft)
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

if (posts.length === 0) {
  console.log('Todos los posts están marcados como draft — no se generó nada.');
  process.exit(0);
}

// ── Plantillas HTML ──────────────────────────────────────────────────────────

function navHTML() {
  return `
  <header class="site-header">
    <nav class="nav container" aria-label="Navegación principal">
      <a href="/" class="nav__logo" aria-label="Pindia Software — Inicio">
        <span class="nav__logo-text">Pindia</span>
      </a>
      <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav__menu" id="nav-menu" role="list">
        <li><a href="/servicios/" class="nav__link">Servicios</a></li>
        <li><a href="/proyectos/" class="nav__link">Proyectos</a></li>
        <li><a href="/productos/trowelapp.html" class="nav__link">Trowel App</a></li>
        <li><a href="/blog/" class="nav__link">Blog</a></li>
        <li><a href="/contacto/" class="nav__link nav__link--cta">Contacto</a></li>
      </ul>
    </nav>
  </header>`.trim();
}

function footerHTML() {
  return `
  <footer class="site-footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="/" class="footer__logo" aria-label="Pindia Software">
          <span>Pindia Software</span>
        </a>
        <p class="footer__tagline">Software a medida y diseño web en Santander.</p>
      </div>
      <nav class="footer__nav" aria-label="Servicios">
        <h3 class="footer__heading">Servicios</h3>
        <ul role="list">
          <li><a href="/servicios/diseno-web.html">Diseño web</a></li>
          <li><a href="/servicios/desarrollo-software.html">Desarrollo software</a></li>
          <li><a href="/servicios/apps-mobile-api.html">Apps móviles y API</a></li>
        </ul>
      </nav>
      <nav class="footer__nav" aria-label="Empresa">
        <h3 class="footer__heading">Empresa</h3>
        <ul role="list">
          <li><a href="/proyectos/">Proyectos</a></li>
          <li><a href="/productos/trowelapp.html">Trowel App</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/contacto/">Contacto</a></li>
        </ul>
      </nav>
      <div class="footer__contact">
        <h3 class="footer__heading">Contacto</h3>
        <ul role="list">
          <li><a href="mailto:hola@pindia.es">hola@pindia.es</a></li>
          <li><a href="https://wa.me/34XXXXXXXXX" rel="noopener noreferrer" target="_blank">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom container">
      <p>&copy; <span id="footer-year"></span> Pindia Software S.L. — Santander, Cantabria</p>
      <nav aria-label="Legal">
        <a href="/aviso-legal.html">Aviso legal</a>
        <a href="/politica-privacidad.html">Privacidad</a>
        <a href="/politica-cookies.html">Cookies</a>
      </nav>
    </div>
  </footer>`.trim();
}

function cookieBannerHTML() {
  return `
  <div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Aviso de cookies" aria-live="polite" hidden>
    <p>Usamos cookies propias y de análisis para mejorar tu experiencia. Puedes <a href="/politica-cookies.html">saber más aquí</a>.</p>
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="btn btn--sm btn--primary">Aceptar</button>
      <button id="cookie-reject" class="btn btn--sm btn--ghost">Rechazar</button>
    </div>
  </div>`.trim();
}

// ── Generar HTML de cada post ─────────────────────────────────────────────────

function buildPostHTML(post) {
  const { slug, data, content } = post;
  const {
    title       = 'Sin título',
    description = '',
    date        = new Date(),
    author      = 'Pindia Software',
    cover       = '',
    coverAlt    = '',
    tags        = [],
  } = data;

  const htmlContent = marked.parse(content);
  const canonicalUrl = `${SITE_URL}/blog/posts/${slug}/`;
  const dateISO      = formatDateISO(date);
  const dateDisplay  = formatDateES(date);

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: dateISO,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'Pindia Software', url: SITE_URL },
    description,
    ...(cover ? { image: `${SITE_URL}${cover}` } : {}),
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(title)} | Blog Pindia Software</title>
  <meta name="description" content="${escapeXml(description)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type"        content="article">
  <meta property="og:title"       content="${escapeXml(title)}">
  <meta property="og:description" content="${escapeXml(description)}">
  <meta property="og:url"         content="${canonicalUrl}">
  <meta property="og:site_name"   content="Pindia Software">
  ${cover ? `<meta property="og:image" content="${SITE_URL}${cover}">` : ''}
  <meta property="article:published_time" content="${dateISO}">
  ${tags.map(t => `<meta property="article:tag" content="${escapeXml(t)}">`).join('\n  ')}

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escapeXml(title)}">
  <meta name="twitter:description" content="${escapeXml(description)}">
  ${cover ? `<meta name="twitter:image" content="${SITE_URL}${cover}">` : ''}

  <!-- Favicon -->
  <link rel="icon" href="/assets/favicons/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/favicons/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/favicons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- CSS -->
  <link rel="stylesheet" href="/assets/css/styles.css">

  <!-- Schema.org BlogPosting -->
  <script type="application/ld+json">${schema}</script>
</head>
<body>

  ${navHTML()}

  <main id="main">
    <article class="post container" itemscope itemtype="https://schema.org/BlogPosting">
      <header class="post__header">
        <div class="post__meta">
          ${tags.map(t => `<span class="post__tag">${escapeXml(t)}</span>`).join('')}
        </div>
        <h1 class="post__title" itemprop="headline">${escapeXml(title)}</h1>
        <div class="post__byline">
          <time datetime="${dateISO}" itemprop="datePublished">${dateDisplay}</time>
          <span class="post__author" itemprop="author">${escapeXml(author)}</span>
        </div>
        ${cover ? `<img class="post__cover" src="${cover}" alt="${escapeXml(coverAlt)}" itemprop="image" loading="eager">` : ''}
      </header>

      <div class="post__body prose" itemprop="articleBody">
        ${htmlContent}
      </div>

      <footer class="post__footer">
        <a href="/blog/" class="btn btn--ghost">&larr; Volver al blog</a>
      </footer>
    </article>
  </main>

  ${footerHTML()}

  ${cookieBannerHTML()}

  <script src="/js/main.js" defer></script>
</body>
</html>`;
}

// ── Generar index del blog ────────────────────────────────────────────────────

function buildBlogIndex(posts) {
  const postItems = posts.map(({ slug, data }) => {
    const {
      title       = 'Sin título',
      description = '',
      date        = new Date(),
      cover       = '',
      coverAlt    = '',
      tags        = [],
    } = data;

    const dateISO     = formatDateISO(date);
    const dateDisplay = formatDateES(date);
    const url         = `/blog/posts/${slug}/`;

    return `
    <article class="blog-card">
      ${cover ? `
      <a href="${url}" class="blog-card__cover-link" tabindex="-1" aria-hidden="true">
        <img src="${cover}" alt="${escapeXml(coverAlt)}" class="blog-card__cover" loading="lazy" width="800" height="420">
      </a>` : ''}
      <div class="blog-card__body">
        <div class="blog-card__meta">
          ${tags.slice(0, 3).map(t => `<span class="post__tag">${escapeXml(t)}</span>`).join('')}
          <time datetime="${dateISO}">${dateDisplay}</time>
        </div>
        <h2 class="blog-card__title"><a href="${url}">${escapeXml(title)}</a></h2>
        <p class="blog-card__desc">${escapeXml(description)}</p>
        <a href="${url}" class="blog-card__more">Leer artículo &rarr;</a>
      </div>
    </article>`.trim();
  }).join('\n\n    ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Pindia Software — Noticias y artículos sobre software y tecnología</title>
  <meta name="description" content="Noticias, artículos y novedades de Pindia Software: diseño web, desarrollo a medida, apps móviles y tecnología para empresas.">
  <link rel="canonical" href="${SITE_URL}/blog/">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:title"       content="Blog | Pindia Software">
  <meta property="og:description" content="Noticias y artículos sobre software, diseño web y tecnología para empresas.">
  <meta property="og:url"         content="${SITE_URL}/blog/">
  <meta property="og:site_name"   content="Pindia Software">

  <!-- Favicon -->
  <link rel="icon" href="/assets/favicons/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/favicons/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/favicons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title="Blog Pindia Software" href="/blog/rss.xml">

  <!-- CSS -->
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>

  ${navHTML()}

  <main id="main">
    <section class="blog-hero container">
      <h1 class="blog-hero__title">Blog</h1>
      <p class="blog-hero__subtitle">Noticias y artículos sobre software, diseño web y tecnología para empresas.</p>
    </section>

    <section class="blog-list container" aria-label="Artículos del blog">
      ${postItems}
    </section>
  </main>

  ${footerHTML()}

  ${cookieBannerHTML()}

  <script src="/js/main.js" defer></script>
</body>
</html>`;
}

// ── Generar RSS ───────────────────────────────────────────────────────────────

function buildRSS(posts) {
  const items = posts.map(({ slug, data }) => {
    const {
      title       = 'Sin título',
      description = '',
      date        = new Date(),
      author      = 'Pindia Software',
    } = data;

    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/blog/posts/${slug}/</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${formatDateRFC822(date)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/posts/${slug}/</guid>
      <author>hola@pindia.es (${escapeXml(author)})</author>
    </item>`.trim();
  }).join('\n\n    ');

  const lastBuild = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Pindia Software</title>
    <link>${SITE_URL}/blog/</link>
    <description>Noticias y artículos sobre software, diseño web y tecnología para empresas en Santander.</description>
    <language>es-es</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>

    ${items}
  </channel>
</rss>`;
}

// ── Regenerar sitemap ─────────────────────────────────────────────────────────

function buildSitemap(posts) {
  const staticUrls = [
    { loc: `${SITE_URL}/`,                                      lastmod: '2024-04-24', changefreq: 'weekly',  priority: '1.0' },
    { loc: `${SITE_URL}/servicios/`,                            lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.9' },
    { loc: `${SITE_URL}/servicios/diseno-web.html`,             lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/servicios/desarrollo-software.html`,    lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/servicios/apps-mobile-api.html`,        lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/proyectos/`,                            lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/productos/trowelapp.html`,              lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.9' },
    { loc: `${SITE_URL}/blog/`,                                 lastmod: '2024-04-24', changefreq: 'weekly',  priority: '0.7' },
    { loc: `${SITE_URL}/contacto/`,                             lastmod: '2024-04-24', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_URL}/aviso-legal.html`,                      lastmod: '2024-04-24', changefreq: 'yearly',  priority: '0.2' },
    { loc: `${SITE_URL}/politica-privacidad.html`,              lastmod: '2024-04-24', changefreq: 'yearly',  priority: '0.2' },
    { loc: `${SITE_URL}/politica-cookies.html`,                 lastmod: '2024-04-24', changefreq: 'yearly',  priority: '0.2' },
  ];

  const postUrls = posts.map(({ slug, data }) => ({
    loc:        `${SITE_URL}/blog/posts/${slug}/`,
    lastmod:    formatDateISO(data.date || new Date()),
    changefreq: 'never',
    priority:   '0.5',
  }));

  const allUrls = [...staticUrls, ...postUrls];

  const urlEntries = allUrls.map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim()).join('\n\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  ${urlEntries}

</urlset>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

// 1. Generar HTML de cada post
for (const post of posts) {
  const outDir  = join(POSTS_OUT, post.slug);
  const outFile = join(outDir, 'index.html');

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, buildPostHTML(post), 'utf8');
  console.log(`✓ Built: ${post.slug}`);
}

// 2. Generar index del blog
const blogIndexPath = join(BLOG_OUT, 'index.html');
mkdirSync(BLOG_OUT, { recursive: true });
writeFileSync(blogIndexPath, buildBlogIndex(posts), 'utf8');
console.log('✓ Blog index updated');

// 3. Generar RSS
const rssPath = join(BLOG_OUT, 'rss.xml');
writeFileSync(rssPath, buildRSS(posts), 'utf8');
console.log('✓ RSS updated');

// 4. Regenerar sitemap
const sitemapPath = join(ROOT, 'sitemap.xml');
writeFileSync(sitemapPath, buildSitemap(posts), 'utf8');
console.log('✓ Sitemap updated');

console.log(`\nBlog compilado: ${posts.length} post(s) publicado(s).`);
