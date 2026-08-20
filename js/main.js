/* ============================================
   PINDIA SOFTWARE — main.js
   ============================================ */

'use strict';

/* ── Blog: anclas en encabezados (.prose__anchor) — copian URL al clic ── */
(function initProseAnchors() {
  const anchors = document.querySelectorAll('.prose__anchor');
  if (!anchors.length) return;

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb && cb(); } catch {}
    document.body.removeChild(ta);
  }

  function showFeedback(el) {
    const prev = el.dataset.original || el.textContent;
    el.dataset.original = prev;
    el.classList.add('prose__anchor--copied');
    el.setAttribute('aria-label', 'Enlace copiado al portapapeles');
    el.textContent = '✓';
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.textContent = prev;
      el.classList.remove('prose__anchor--copied');
      el.setAttribute('aria-label', 'Enlace a esta sección');
    }, 1400);
  }

  anchors.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href');
      if (!id) return;
      const url = window.location.origin + window.location.pathname + id;
      history.replaceState(null, '', id);
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const done = () => showFeedback(a);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
      } else {
        fallbackCopy(url, done);
      }
    });
  });
})();

/* ── Reset scroll to top on homepage reload ──
   load event fires after all 112 hero frames preload, which can take
   seconds. If the user already started scrolling, do NOT yank back. */
(function resetHomepageScroll() {
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html');
  if (!isHome) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  let userScrolled = false;
  const onFirstScroll = () => { if (window.scrollY > 0) userScrolled = true; };
  window.addEventListener('scroll', onFirstScroll, { passive: true });
  window.addEventListener('load', () => {
    window.removeEventListener('scroll', onFirstScroll);
    if (!userScrolled) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
})();

/* ── Nav: scroll state + mobile drawer ── */
(function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.querySelector('.nav__drawer');

  if (!nav) return;

  let navTicking = false;
  let lastScrolled = false;
  function applyScrollState() {
    const scrolled = window.scrollY > 20;
    if (scrolled !== lastScrolled) {
      nav.classList.toggle('is-scrolled', scrolled);
      lastScrolled = scrolled;
    }
    navTicking = false;
  }
  function onScroll() {
    if (!navTicking) {
      requestAnimationFrame(applyScrollState);
      navTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  applyScrollState();

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const links = nav.querySelectorAll('.nav__link');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ── Parallax: CSS variable scroll ── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function updateParallax() {
    document.documentElement.style.setProperty('--scroll-y', window.scrollY);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Scroll reveal: IntersectionObserver ── */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Make everything visible immediately
    document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const options = {
    threshold: 0,
    rootMargin: '0px 0px -48px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const reveals = document.querySelectorAll('[data-reveal], [data-reveal-group]');

  const revealIfInViewport = () => {
    const vh = window.innerHeight;
    const rects = Array.from(reveals).map(el => ({ el, r: el.getBoundingClientRect() }));
    rects.forEach(({ el, r }) => {
      if (el.classList.contains('is-visible')) return;
      if (r.top < vh && r.bottom > 0) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  };

  reveals.forEach(el => observer.observe(el));
  revealIfInViewport();
  window.addEventListener('load', revealIfInViewport, { once: true });
})();

/* ── Cookie banner + settings modal (RGPD/AEPD) ── */
(function initCookies() {
  const KEY_V2 = 'pindia_cookies_v2';
  const KEY_V1 = 'pindia_cookies_v1';

  const banner   = document.getElementById('cookie-banner');
  const settings = document.getElementById('cookie-settings');
  if (!banner) return;

  const btnAccept   = document.getElementById('cookie-accept');
  const btnReject   = document.getElementById('cookie-reject');
  const btnOpen     = document.getElementById('cookie-settings-open');
  const btnSAccept  = document.getElementById('cookie-settings-accept');
  const btnSReject  = document.getElementById('cookie-settings-reject');
  const btnSSave    = document.getElementById('cookie-settings-save');
  const toggleA     = document.getElementById('cookie-toggle-analytics');

  function readConsent() {
    const v2 = localStorage.getItem(KEY_V2);
    if (v2) {
      try { return JSON.parse(v2); } catch (e) { /* fallthrough */ }
    }
    const v1 = localStorage.getItem(KEY_V1);
    if (v1) {
      const migrated = {
        v: 2,
        ts: new Date().toISOString(),
        necessary: true,
        analytics: v1 === 'accepted'
      };
      localStorage.setItem(KEY_V2, JSON.stringify(migrated));
      localStorage.removeItem(KEY_V1);
      return migrated;
    }
    return null;
  }

  function writeConsent(analytics) {
    const data = {
      v: 2,
      ts: new Date().toISOString(),
      necessary: true,
      analytics: !!analytics
    };
    localStorage.setItem(KEY_V2, JSON.stringify(data));
    return data;
  }

  function applyConsent(data) {
    if (data && data.analytics) {
      loadAnalytics();
    }
  }

  function hideBanner() {
    banner.classList.remove('is-visible');
  }

  /* ── Modal ── */
  let lastFocus = null;

  function getFocusables() {
    if (!settings) return [];
    return Array.from(settings.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('hidden'));
  }

  function openSettings() {
    if (!settings) return;
    lastFocus = document.activeElement;
    const current = readConsent();
    if (toggleA) toggleA.checked = current ? !!current.analytics : false;
    settings.hidden = false;
    requestAnimationFrame(() => settings.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    const focusables = getFocusables();
    if (focusables.length) focusables[0].focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeSettings() {
    if (!settings) return;
    settings.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => { settings.hidden = true; }, 250);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSettings();
      return;
    }
    if (e.key === 'Tab') {
      const f = getFocusables();
      if (!f.length) return;
      const first = f[0];
      const last  = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }

  /* ── Bindings ── */
  if (btnAccept) btnAccept.addEventListener('click', () => {
    applyConsent(writeConsent(true));
    hideBanner();
  });
  if (btnReject) btnReject.addEventListener('click', () => {
    writeConsent(false);
    hideBanner();
  });
  if (btnOpen) btnOpen.addEventListener('click', openSettings);

  if (btnSAccept) btnSAccept.addEventListener('click', () => {
    if (toggleA) toggleA.checked = true;
    applyConsent(writeConsent(true));
    hideBanner();
    closeSettings();
  });
  if (btnSReject) btnSReject.addEventListener('click', () => {
    if (toggleA) toggleA.checked = false;
    writeConsent(false);
    hideBanner();
    closeSettings();
  });
  if (btnSSave) btnSSave.addEventListener('click', () => {
    const a = !!(toggleA && toggleA.checked);
    applyConsent(writeConsent(a));
    hideBanner();
    closeSettings();
  });

  if (settings) {
    settings.querySelectorAll('[data-cookie-close]').forEach(el => {
      el.addEventListener('click', closeSettings);
    });
  }

  /* External triggers (footer link, política page button, etc.) */
  document.querySelectorAll('[data-cookie-settings]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openSettings();
    });
  });
  window.openCookieSettings = openSettings;

  /* ── Init state ── */
  const consent = readConsent();
  if (!consent) {
    setTimeout(() => banner.classList.add('is-visible'), 800);
  } else {
    applyConsent(consent);
  }
})();

/* ── Analytics loader (GA4, after consent) ── */
function loadAnalytics() {
  const GA_ID = window.GA_MEASUREMENT_ID; // Set in <head>: window.GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'
  if (!GA_ID || document.getElementById('gtag-script')) return;

  const script = document.createElement('script');
  script.id  = 'gtag-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/* ── Contact form: honeypot + time-gate + validation ── */
(function initForms() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach(form => {
    const startTime = Date.now();
    const honeypot  = form.querySelector('[name="website"]'); // honeypot field

    // Limpia error cuando usuario corrige campo
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.removeAttribute('aria-invalid');
          const wrapper = field.closest('.field');
          const err = wrapper?.querySelector('.field__error');
          if (err) err.hidden = true;
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      if (honeypot && honeypot.value) return;

      // Time-gate: < 3 seconds = bot
      if ((Date.now() - startTime) < 3000) return;

      // Basic validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const wrapper = field.closest('.field');
        const err     = wrapper?.querySelector('.field__error');
        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (err) { err.textContent = 'Este campo es obligatorio.'; err.hidden = false; }
        } else {
          field.removeAttribute('aria-invalid');
          if (err) err.hidden = true;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
        return;
      }

      // Submit
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      try {
        const data = new FormData(form);
        const body = Object.fromEntries(data.entries());
        delete body.website; // Remove honeypot

        const endpoint = form.dataset.endpoint || '/api/contact';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          form.innerHTML = `
            <div class="form-success" role="status">
              <div class="form-success__image">
                <img src="/assets/img/form-success-robot.webp" alt="Robot de Pindia celebrando" width="280" height="280" loading="eager">
              </div>
              <div class="form-success__content">
                <h3>¡Mensaje recibido!</h3>
                <p>Te contestaremos enseguida.</p>
              </div>
            </div>`;
        } else {
          throw new Error('Server error');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = originalText;
        const errMsg = form.querySelector('.form-error-global');
        if (errMsg) { errMsg.hidden = false; }
      }
    });
  });
})();

/* ── Smooth anchor scroll ──
   nav-h cacheado para evitar getComputedStyle (forced reflow) en cada click.
   Se invalida en resize por si cambia breakpoint (96px desktop / 88px mobile). */
let _navHCache = null;
function getNavH() {
  if (_navHCache !== null) return _navHCache;
  const v = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
  _navHCache = isNaN(v) ? 72 : v;
  return _navHCache;
}
window.addEventListener('resize', () => { _navHCache = null; }, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = getNavH();
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── YouTube facade: click to load ── */
document.querySelectorAll('.yt-facade').forEach(wrapper => {
  wrapper.addEventListener('click', function() {
    const id = this.dataset.id;
    if (!id) return;
    const iframe = document.createElement('iframe');
    iframe.src    = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    iframe.allow  = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    this.replaceWith(iframe);
  });
});

/* ============================================
   SCROLL-DRIVEN VIDEO ANIMATION
   Robot WebP frame sequence synced to hero scroll.
   Smooth scrubbing via rAF + lerp. Scroll lock handled
   naturally by the 260vh container + sticky layout.
   ============================================ */
(function initScrollVideo() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile       = window.matchMedia('(max-width: 639px)').matches;
  /* Hero estático (sin scroll-scrubbing) en móvil y con movimiento reducido:
     dibuja un único frame y muestra el primer mensaje del H1. Evita la tarea
     larga de JS (~1s) y la carga de 112 frames (~1,2 MB) → PageSpeed móvil. */
  const staticHero     = prefersReduced || isMobile;

  const section  = document.getElementById('hero-scroll');
  const canvas   = document.getElementById('scroll-canvas');
  const skeleton = document.getElementById('scroll-skeleton');
  const progress = document.getElementById('scroll-progress-fill');
  const hint     = document.getElementById('scroll-hint');
  const sticky   = section && section.querySelector('.hero__sticky');
  const heroH1   = section && section.querySelector('.hero__h1');
  const heroLines = heroH1 ? heroH1.querySelectorAll('.hero__h1-line') : [];
  if (!staticHero && heroH1 && heroLines.length) heroH1.classList.add('hero__h1--animated');
  const heroSubLines = section ? section.querySelectorAll('.hero__sub-line') : [];
  let lastLineIndex = -1;

  /* Typewriter setup: snapshot text-node content per h1 line, then empty
     them. Markup like <em> is preserved; chars stream back in document
     order on first activation. Skip line 0 — visible from page load. */
  heroLines.forEach((line, i) => {
    if (i === 0) {
      line._typed = true;
      line.classList.add('is-active');
      return;
    }
    if (staticHero) {
      /* No vaciamos las líneas 2/3: quedan en el DOM (SEO) pero ocultas por
         CSS (:not(.is-active) → display:none). Solo se muestra la línea 0. */
      line._typed = true;
      return;
    }
    const nodes = [];
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      nodes.push({ node: n, full: n.nodeValue });
      n.nodeValue = '';
    }
    line._typeNodes = nodes;
    line._typed = false;
  });

  function playTypewriter(line) {
    if (!line || line._typed || !line._typeNodes) return;
    line._typed = true;
    line.classList.add('is-typing');
    const nodes = line._typeNodes;
    const SPEED = 70;
    let nodeIdx = 0, charIdx = 0;
    function step() {
      while (nodeIdx < nodes.length && charIdx >= nodes[nodeIdx].full.length) {
        nodeIdx++;
        charIdx = 0;
      }
      if (nodeIdx >= nodes.length) {
        line.classList.remove('is-typing');
        line.classList.add('is-typed');
        return;
      }
      const cur = nodes[nodeIdx];
      cur.node.nodeValue = cur.full.slice(0, ++charIdx);
      setTimeout(step, SPEED);
    }
    step();
  }

  if (!section || !canvas) return;

  const ctx         = canvas.getContext('2d', { alpha: true });
  const TOTAL       = 112;
  const FRAME_START = 0;
  const FRAME_END   = 111;
  /* Mobile usa frames a 240px ancho (~10KB c/u, total ~1.3MB) en vez de
     480px (~200KB c/u, total ~22MB). Mismo número de frames, misma
     animación, 94% menos tráfico. */
  const BASE_PATH = isMobile
    ? '/assets/videos/frames-mobile/frame_'
    : '/assets/videos/frames/frame_';
  const LERP_FACTOR = 0.15; // lower = smoother / slower to catch up
  const frames      = new Array(TOTAL);
  let loadedCount   = 0;
  let lastDrawn     = -1;
  let targetFrame   = 0;  // driven by scroll position
  let currentFrame  = 0;  // interpolated toward targetFrame each rAF tick

  canvas.width  = 480;
  canvas.height = 762;

  /* ── Preload frames ── */
  function preloadFrame(i) {
    if (frames[i]) return;
    const img    = new Image();
    const num    = String(i + 1).padStart(4, '0');
    img.decoding = 'async';
    img.src      = `${BASE_PATH}${num}.webp`;

    img.onload = () => {
      loadedCount++;
      if (i === FRAME_START) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.classList.add('is-ready');
        if (skeleton) skeleton.classList.add('is-hidden');
      }
    };

    frames[i] = img;
  }

  /* Hero estático: dibuja solo el primer frame (su onload añade .is-ready y
     oculta el skeleton) y termina — sin loop rAF, sin listeners, sin más frames. */
  if (staticHero) {
    preloadFrame(FRAME_START);
    return;
  }

  /* Eagerly preload first + last + a few key intermediates so the snap-to-end
     in the buffer zone always has the final frame ready, even on first scroll. */
  [FRAME_START, FRAME_END, 28, 56, 84].forEach(preloadFrame);

  let preloadIndex = 1;
  function preloadNext() {
    while (preloadIndex < TOTAL && frames[preloadIndex]) preloadIndex++;
    if (preloadIndex >= TOTAL) return;
    preloadFrame(preloadIndex++);
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(preloadNext, { timeout: 200 });
    } else {
      setTimeout(preloadNext, 8);
    }
  }
  requestAnimationFrame(preloadNext);

  /* ── Draw frame by index, fall back to nearest loaded frame ── */
  function drawFrame(index) {
    const img = frames[index];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawn = index;
      return;
    }
    for (let d = 1; d < 16; d++) {
      const prev = frames[index - d];
      const next = frames[index + d];
      const fb   = (prev && prev.complete && prev.naturalWidth > 0) ? prev
                 : (next && next.complete && next.naturalWidth > 0) ? next
                 : null;
      if (fb) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fb, 0, 0, canvas.width, canvas.height);
        return;
      }
    }
  }

  /* ── Update side effects for progress p (0–1) ── */
  function applyEffects(p) {
    if (progress) progress.style.transform = `scaleX(${p})`;
    if (hint)     hint.classList.toggle('is-hidden', p > 0.05);
    if (sticky) {
      const angle = p * Math.PI;
      sticky.style.setProperty('--glow-x', (22 * Math.sin(angle))       + 'vw');
      sticky.style.setProperty('--glow-y', (28 * (1 - Math.cos(angle))) + 'vh');
    }
    if (heroLines.length) {
      const idx = p < 0.2 ? 0 : p < 0.6 ? 1 : 2;
      if (idx !== lastLineIndex) {
        heroLines.forEach((el, i) => el.classList.toggle('is-active', i === idx));
        heroSubLines.forEach((el, i) => el.classList.toggle('is-active', i === idx));
        lastLineIndex = idx;
        playTypewriter(heroLines[idx]);
      }
    }
  }

  /* ── Robot siempre visible: no fade al final de la animación ── */
  function applyFade(_uncapped) {}

  /* ── Read scroll position → update targetFrame ──
     Animation completes at ANIM_END (85%) of the sticky range.
     The remaining 15% is a lerp/snap buffer: the last frame is fully
     rendered before the sticky releases and the next section enters. */
  const ANIM_END = 0.85;

  let _sectionRectCache = null;
  let _lastScrollY = -1;
  function getUncappedProgress() {
    if (window.scrollY === _lastScrollY && _sectionRectCache) {
      return -_sectionRectCache.top / (section.offsetHeight - window.innerHeight);
    }
    _lastScrollY = window.scrollY;
    _sectionRectCache = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return -_sectionRectCache.top / scrollable;
  }

  function getRawProgress() {
    return Math.max(0, Math.min(1, getUncappedProgress()));
  }

  function updateTarget() {
    const uncapped  = getUncappedProgress();
    const raw       = Math.max(0, Math.min(1, uncapped));
    const animProg  = Math.min(1, raw / ANIM_END);
    targetFrame     = FRAME_START + animProg * (FRAME_END - FRAME_START);
    applyEffects(animProg);
    applyFade(uncapped);
  }

  /* ── Continuous rAF loop: lerp currentFrame toward targetFrame ──
     In the final buffer zone (raw >= ANIM_END) snap immediately so
     the last frame is guaranteed rendered before the sticky releases. */
  function tick() {
    if (getRawProgress() >= ANIM_END) {
      currentFrame = targetFrame; // snap — no lerp lag in the buffer zone
    } else {
      currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;
      if (Math.abs(currentFrame - targetFrame) < 0.1) currentFrame = targetFrame;
    }

    const idx = Math.round(Math.max(FRAME_START, Math.min(FRAME_END, currentFrame)));
    if (idx !== lastDrawn) drawFrame(idx);

    requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', updateTarget, { passive: true });

  /* Init */
  updateTarget();
  currentFrame = targetFrame; // start at correct frame, no lerp catch-up on load
  requestAnimationFrame(tick);

})();

/* ============================================
   Carrusel de proyectos (scroll-snap + flechas)
   ============================================ */
(function () {
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.carousel__track');
    if (!track) return;
    var prev = car.querySelector('[data-dir="prev"]');
    var next = car.querySelector('[data-dir="next"]');

    var raf = null;
    function stepSize() {
      var item = track.querySelector('.carousel__item');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return item ? item.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= maxScroll() - 4;
    }
    function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
    function animateTo(target) {
      target = Math.max(0, Math.min(target, maxScroll()));
      var start = track.scrollLeft;
      var dist = target - start;
      if (Math.abs(dist) < 1) return;
      if (raf) cancelAnimationFrame(raf);
      var dur = 420, t0 = null;
      function frame(now) {
        if (t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        track.scrollLeft = start + dist * ease(p);
        if (p < 1) raf = requestAnimationFrame(frame); else update();
      }
      raf = requestAnimationFrame(frame);
    }
    if (prev) prev.addEventListener('click', function () { animateTo(track.scrollLeft - stepSize()); });
    if (next) next.addEventListener('click', function () { animateTo(track.scrollLeft + stepSize()); });

    // Arrastre con ratón (las pantallas táctiles usan el scroll nativo con inercia)
    var down = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (raf) cancelAnimationFrame(raf);
      down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      // La captura de puntero se activa solo cuando hay arrastre real: si se
      // capturase ya en pointerdown, el click posterior se redirigiria al track
      // y los enlaces de las tarjetas nunca se abririan.
      if (!moved) {
        if (Math.abs(dx) <= 4) return;
        moved = true;
        try { track.setPointerCapture(e.pointerId); } catch (_) {}
        track.classList.add('is-dragging');
      }
      track.scrollLeft = startScroll - dx;
    });
    function release() {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      update();
    }
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    // Un arrastre no debe activar el enlace de la tarjeta
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
