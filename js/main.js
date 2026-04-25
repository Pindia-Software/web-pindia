/* ============================================
   PINDIA SOFTWARE — main.js
   ============================================ */

'use strict';

/* ── Nav: scroll state + mobile drawer ── */
(function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.querySelector('.nav__drawer');

  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
    threshold: 0.12,
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

  document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
    observer.observe(el);
  });
})();

/* ── Cookie banner ── */
(function initCookies() {
  const STORAGE_KEY = 'pindia_cookies_v1';
  const banner      = document.getElementById('cookie-banner');
  const btnAccept   = document.getElementById('cookie-accept');
  const btnReject   = document.getElementById('cookie-reject');

  if (!banner) return;

  const consent = localStorage.getItem(STORAGE_KEY);
  if (!consent) {
    // Show after short delay so page renders first
    setTimeout(() => banner.classList.add('is-visible'), 800);
  }

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    banner.classList.remove('is-visible');
    if (value === 'accepted') {
      loadAnalytics();
    }
  }

  if (btnAccept) btnAccept.addEventListener('click', () => setConsent('accepted'));
  if (btnReject) btnReject.addEventListener('click', () => setConsent('rejected'));

  // If previously accepted, load analytics on page load
  if (consent === 'accepted') loadAnalytics();
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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3>¡Mensaje enviado!</h3>
              <p>Te responderemos en menos de 24 horas.</p>
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

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const section  = document.getElementById('hero-scroll');
  const canvas   = document.getElementById('scroll-canvas');
  const skeleton = document.getElementById('scroll-skeleton');
  const progress = document.getElementById('scroll-progress-fill');
  const hint     = document.getElementById('scroll-hint');
  const sticky   = section && section.querySelector('.hero__sticky');

  if (!section || !canvas) return;

  const ctx         = canvas.getContext('2d', { alpha: true });
  const TOTAL       = 112;
  const FRAME_START = 0;
  const FRAME_END   = 111;
  const BASE_PATH   = '/assets/videos/frames/frame_';
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
    if (progress) progress.style.width = (p * 100) + '%';
    if (hint)     hint.classList.toggle('is-hidden', p > 0.05);
    if (sticky) {
      const angle = p * Math.PI;
      sticky.style.setProperty('--glow-x', (22 * Math.sin(angle))       + 'vw');
      sticky.style.setProperty('--glow-y', (28 * (1 - Math.cos(angle))) + 'vh');
    }
  }

  /* ── Fade canvas as sticky unsticks so the robot doesn't visually
     overlap the next section as it enters from below. Driven by the
     uncapped progress: 1.0 = sticky just released, >1.0 = sticky
     scrolling out. Fade completes well before the next section's
     content reaches the viewport. */
  let lastOpacity = -1;
  function applyFade(uncapped) {
    let op = 1;
    if (uncapped > 1.0) op = Math.max(0, 1 - (uncapped - 1.0) / 0.18);
    if (op === lastOpacity) return;
    lastOpacity = op;
    if (op === 1) {
      canvas.style.opacity = '';
    } else {
      canvas.style.transition = 'none';
      canvas.style.opacity = String(op);
    }
  }

  /* ── Read scroll position → update targetFrame ──
     Animation completes at ANIM_END (85%) of the sticky range.
     The remaining 15% is a lerp/snap buffer: the last frame is fully
     rendered before the sticky releases and the next section enters. */
  const ANIM_END = 0.85;

  function getUncappedProgress() {
    const rect       = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return -rect.top / scrollable;
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
