/* NestedFusion — motion & interaction */
(() => {
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGSAP = typeof window.gsap !== 'undefined';

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Hero title: wrap lines for mask reveal ---------- */
  $$('.hero__title .line').forEach(l => { l.innerHTML = `<span>${l.innerHTML}</span>`; });

  /* ---------- Marquee: duplicate for seamless loop ---------- */
  const mt = $('.marquee__track');
  if (mt) { const clone = mt.innerHTML; mt.insertAdjacentHTML('beforeend', clone.replace(/<span>/g, '<span aria-hidden="true">')); }

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav__toggle'), menu = $('#mobile-menu');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });

  /* ---------- Fallback when GSAP unavailable or reduced motion ---------- */
  const showAll = () => {
    $$('.reveal-up').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.hero__title .line > span').forEach(el => { el.style.transform = 'none'; });
    $$('.step').forEach(s => s.classList.add('on'));
    $$('.manifesto__text .word').forEach(w => w.classList.add('on'));
  };

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  // In-page anchors
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -70, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    if (id !== '#top') { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }));

  /* ---------- Nav state ---------- */
  const nav = $('.nav');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    const goingDown = y > lastY && y > 400 && menu.hidden;
    nav.classList.toggle('is-hidden', goingDown);
    document.body.classList.toggle('nav-hidden', goingDown);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sub-nav highlight (services jump links, FAQ groups) ---------- */
  const subLinks = $$('.jump a, .faq__toc a');
  if (subLinks.length) {
    const sio = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) subLinks.forEach(l => l.classList.toggle('is-on', l.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    subLinks.forEach(l => { const t = document.getElementById(l.getAttribute('href').slice(1)); if (t) sio.observe(t); });
  }

  /* ---------- Count up ---------- */
  const countUp = el => {
    const to = +el.dataset.to; if (reduce) { el.textContent = to; return; }
    const dur = 1400, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = 0; requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), { threshold: .6 });

  /* ---------- Manifesto words ---------- */
  const mani = $('.manifesto__text');
  if (mani) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement('span'); s.className = 'word'; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(mani);
  }

  /* ---------- Console demo loop ---------- */
  const items = $$('.console__list li'), meter = $('.console__meter i');
  let ci = 0, consoleTimer = null;
  const tick = () => {
    if (ci === items.length) {
      consoleTimer = setTimeout(() => { items.forEach(i => i.classList.remove('done', 'run')); meter.style.width = '0%'; ci = 0; consoleTimer = setTimeout(tick, 600); }, 2200);
      return;
    }
    const it = items[ci];
    it.classList.add('run');
    consoleTimer = setTimeout(() => {
      it.classList.remove('run'); it.classList.add('done');
      ci++; meter.style.width = (ci / items.length * 100) + '%';
      consoleTimer = setTimeout(tick, 380);
    }, 1100 + Math.random() * 500);
  };
  const startConsole = () => {
    if (!items.length) return;
    if (reduce) { items.forEach(i => i.classList.add('done')); meter.style.width = '100%'; return; }
    let running = false;
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; tick(); }
      else if (!en.isIntersecting && running) { running = false; clearTimeout(consoleTimer); }
    }, { threshold: .35 }).observe(items[0].closest('.console'));
  };

  /* ---------- Hero network canvas ---------- */
  const canvas = $('.hero__net');
  const net = (() => {
    if (!canvas) return { start() {} };
    const ctx = canvas.getContext('2d');
    let W, H, dpr, nodes = [], edges = [], pulses = [], base, running = false, visible = true, raf;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const CYAN = '35,215,255';

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      const gap = W < 720 ? 92 : 120;
      const cols = Math.ceil(W / gap) + 1, rows = Math.ceil(H / gap) + 1;
      nodes = []; edges = [];
      const grid = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          if (Math.random() < .38) { grid[r][c] = null; continue; }
          const n = { x: c * gap + (Math.random() - .5) * gap * .5, y: r * gap + (Math.random() - .5) * gap * .5, ring: Math.random() < .35, e: [] };
          nodes.push(n); grid[r][c] = n;
        }
      }
      const link = (a, b) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        let mid;
        if (Math.abs(dx) > Math.abs(dy)) mid = { x: b.x - Math.sign(dx) * Math.abs(dy), y: a.y };
        else mid = { x: a.x, y: b.y - Math.sign(dy) * Math.abs(dx) };
        const pts = [a, mid, b];
        const segs = [Math.hypot(mid.x - a.x, mid.y - a.y), Math.hypot(b.x - mid.x, b.y - mid.y)];
        const e = { pts, segs, len: segs[0] + segs[1], a, b };
        edges.push(e); a.e.push(e); b.e.push(e);
      };
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const n = grid[r][c]; if (!n) continue;
        const cand = [[r, c + 1], [r + 1, c], [r + 1, c + 1], [r + 1, c - 1]].filter(() => Math.random() < .42);
        cand.forEach(([rr, cc]) => { const m = grid[rr] && grid[rr][cc]; if (m) link(n, m); });
      }
      // Pre-render static traces
      base = document.createElement('canvas'); base.width = canvas.width; base.height = canvas.height;
      const b = base.getContext('2d'); b.scale(dpr, dpr);
      b.lineWidth = 1.2; b.lineJoin = 'round'; b.lineCap = 'round';
      edges.forEach(e => {
        b.strokeStyle = `rgba(${CYAN},${.05 + Math.random() * .06})`;
        b.beginPath(); b.moveTo(e.pts[0].x, e.pts[0].y); b.lineTo(e.pts[1].x, e.pts[1].y); b.lineTo(e.pts[2].x, e.pts[2].y); b.stroke();
      });
      nodes.forEach(n => {
        if (!n.e.length) return;
        b.beginPath(); b.arc(n.x, n.y, n.ring ? 3.4 : 1.6, 0, Math.PI * 2);
        if (n.ring) { b.strokeStyle = `rgba(${CYAN},.22)`; b.lineWidth = 1.2; b.stroke(); }
        else { b.fillStyle = 'rgba(255,255,255,.16)'; b.fill(); }
      });
      pulses = [];
    };

    const pointAt = (e, d) => {
      if (d <= e.segs[0]) { const t = d / (e.segs[0] || 1); return { x: e.pts[0].x + (e.pts[1].x - e.pts[0].x) * t, y: e.pts[0].y + (e.pts[1].y - e.pts[0].y) * t }; }
      const t = (d - e.segs[0]) / (e.segs[1] || 1); return { x: e.pts[1].x + (e.pts[2].x - e.pts[1].x) * t, y: e.pts[1].y + (e.pts[2].y - e.pts[1].y) * t };
    };
    const spawn = (near) => {
      let e;
      if (near) {
        const cands = edges.filter(ed => Math.hypot(ed.a.x - mouse.x, ed.a.y - mouse.y) < 220);
        e = cands[(Math.random() * cands.length) | 0];
      }
      if (!e) e = edges[(Math.random() * edges.length) | 0];
      if (!e) return;
      const fwd = Math.random() < .5;
      pulses.push({ e, d: 0, fwd, v: 1.2 + Math.random() * 1.8, hops: 1 + (Math.random() * 3 | 0), white: Math.random() < .25 });
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * .12; mouse.y += (mouse.ty - mouse.y) * .12;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // cursor glow over nodes
      if (mouse.x > -999) {
        for (const n of nodes) {
          const dd = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (dd < 200 && n.e.length) {
            const a = (1 - dd / 200);
            ctx.beginPath(); ctx.arc(n.x, n.y, n.ring ? 3.6 : 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${CYAN},${a * .9})`; ctx.lineWidth = 1.4; ctx.stroke();
            if (!n.ring) { ctx.fillStyle = `rgba(${CYAN},${a})`; ctx.fill(); }
          }
        }
      }
      if (pulses.length < (W < 720 ? 10 : 22) && Math.random() < .25) spawn(Math.random() < .5);
      ctx.lineCap = 'round';
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.d += p.v;
        const len = p.e.len;
        const trail = 46;
        const head = Math.min(p.d, len), tail = Math.max(0, p.d - trail);
        const map = d => pointAt(p.e, p.fwd ? d : len - d);
        const h = map(head), t = map(tail);
        const g = ctx.createLinearGradient(t.x, t.y, h.x, h.y);
        const col = p.white ? '255,255,255' : CYAN;
        g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},.95)`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.8;
        ctx.beginPath();
        // draw along possible corner
        const steps = 6;
        for (let s = 0; s <= steps; s++) { const q = map(tail + (head - tail) * s / steps); s ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
        ctx.stroke();
        ctx.beginPath(); ctx.arc(h.x, h.y, 2.2, 0, Math.PI * 2); ctx.fillStyle = `rgba(${col},1)`;
        ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
        if (p.d - trail > len) {
          const end = p.fwd ? p.e.b : p.e.a;
          if (p.hops > 0 && end.e.length > 1) {
            const nexts = end.e.filter(x => x !== p.e);
            const ne = nexts[(Math.random() * nexts.length) | 0];
            pulses[i] = { e: ne, d: 0, fwd: ne.a === end, v: p.v, hops: p.hops - 1, white: p.white };
          } else pulses.splice(i, 1);
        }
      }
    };

    const drawStatic = () => { build(); ctx.drawImage(base, 0, 0); };

    return {
      start() {
        if (!canvas.clientWidth || !canvas.clientHeight) return; // hidden: skip, never block the intro
        build();
        if (reduce) { ctx.drawImage(base, 0, 0); return; }
        running = true; frame();
        let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
        const hero = canvas.parentElement;
        hero.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; if (mouse.x < -999) { mouse.x = mouse.tx; mouse.y = mouse.ty; } });
        hero.addEventListener('pointerleave', () => { mouse.tx = mouse.ty = -9999; mouse.x = mouse.y = -9999; });
        new IntersectionObserver(([en]) => { visible = en.isIntersecting && !document.hidden; }).observe(hero);
        document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
      }
    };
  })();

  /* ---------- Spotlight cards & tilt ---------- */
  if (finePointer && !reduce) {
    $$('.card').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
    $$('.case').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
    // Magnetic buttons
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = `translate(${x * .18}px, ${y * .3}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- FAQ smooth open ---------- */
  $$('.faq details').forEach(d => {
    const sum = $('summary', d), body = $('.faq__a', d);
    sum.addEventListener('click', e => {
      if (reduce || !hasGSAP) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: .4, ease: 'power2.inOut', onComplete: () => { d.open = false; body.style.height = ''; } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: body.scrollHeight, duration: .5, ease: 'power3.out', onComplete: () => { body.style.height = ''; } });
      }
    });
  });

  /* ---------- Contact form (Netlify Forms) ---------- */
  const form = $('.form');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('.form__status', form), btn = $('button[type=submit]', form);
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true; status.className = 'form__status'; status.textContent = 'Sending…';
    try {
      const fd = new FormData(form);
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.className = 'form__status ok';
      status.textContent = 'Thanks — your message is in. We’ll reply within one business day.';
    } catch (err) {
      status.className = 'form__status err';
      status.textContent = 'That didn’t send — please check your connection and try again.';
    } finally { btn.disabled = false; }
  });

  /* ---------- Photos: fade in when loaded ---------- */
  $$('.ph img').forEach(im => {
    const done = () => im.closest('.ph').classList.add('is-loaded');
    if (im.complete && im.naturalWidth) done(); else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); }
  });

  /* ---------- Background videos: load when near view, play only while visible ---------- */
  const vids = $$('video.bgvid');
  if (vids.length) {
    const saveData = navigator.connection && navigator.connection.saveData;
    const probe = document.createElement('video');
    const useWebm = !probe.canPlayType('video/mp4; codecs="avc1.640028"') && !!probe.canPlayType('video/webm; codecs="vp9"');
    const load = v => { if (!v.src && v.dataset.src) { v.src = useWebm ? v.dataset.src.replace(/\.mp4$/, '.webm') : v.dataset.src; v.load(); } };
    if (reduce) vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
    if (!reduce && !saveData) {
      const vio = new IntersectionObserver(es => es.forEach(en => {
        const v = en.target;
        if (en.isIntersecting) { load(v); const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        else if (!v.paused) v.pause();
      }), { rootMargin: '200px 0px' });
      vids.forEach(v => { if (v.hasAttribute('data-eager')) load(v); vio.observe(v); });
      document.addEventListener('visibilitychange', () => { if (document.hidden) vids.forEach(v => v.pause()); });
    }
  }

  /* ---------- Page transitions ---------- */
  // Browsers with cross-document View Transitions use the CSS @view-transition rule.
  // Others get a short cyan wipe so moving between pages still feels continuous.
  if (!reduce && !('onpagereveal' in window)) {
    const veil = document.createElement('div');
    veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    requestAnimationFrame(() => veil.classList.add('veil--out'));
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash) || a.hasAttribute('download')) return;
      e.preventDefault();
      veil.classList.remove('veil--out'); veil.classList.add('veil--in');
      setTimeout(() => { location.href = url.href; }, 320);
    });
    window.addEventListener('pageshow', ev => { if (ev.persisted) { veil.classList.remove('veil--in'); veil.classList.add('veil--out'); } });
  }

  /* ---------- Work filters ---------- */
  const filters = $$('.filter');
  if (filters.length) {
    const studies = $$('.study'), empty = $('.filters__empty');
    filters.forEach(f => f.addEventListener('click', () => {
      const key = f.dataset.filter;
      filters.forEach(x => { const on = x === f; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      let shown = 0;
      studies.forEach(st => {
        const match = key === 'all' || st.dataset.type.split(' ').includes(key);
        if (match) shown++;
        if (hasGSAP && !reduce) {
          if (match) { st.hidden = false; gsap.fromTo(st, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' }); }
          else st.hidden = true;
        } else st.hidden = !match;
      });
      if (empty) empty.hidden = shown > 0;
      if (hasGSAP) ScrollTrigger.refresh();
    }));
  }

  /* ---------- Arrive at #section from another page ---------- */
  const goToHash = () => {
    if (!location.hash || location.hash.length < 2) return;
    let t; try { t = $(location.hash); } catch (e) { return; }
    if (!t) return;
    if (lenis) lenis.scrollTo(t, { offset: -90, immediate: true }); else t.scrollIntoView();
  };

  /* ---------- GSAP choreography ---------- */
  const runIntro = () => {
    startConsole();
    net.start();
    $$('.count').forEach(c => cio.observe(c));
    if (!hasGSAP || reduce) { showAll(); goToHash(); return; }

    gsap.registerPlugin(ScrollTrigger, window.SplitText ? SplitText : undefined);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if ($('.hero__title')) tl.to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: .1 });
    if ($('.reveal-up')) tl.to('.reveal-up', { opacity: 1, y: 0, duration: 1, stagger: .08 }, $('.hero__title') ? '-=1.0' : 0);
    if ($('.hero__visual')) tl.from('.hero__visual', { opacity: 0, scale: .92, duration: 1.6 }, '-=1.3').from('.console', { y: 40, opacity: 0, duration: 1.2 }, '-=1.2');

    // Progress bar
    gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

    // Hero parallax out
    if ($('.hero__copy')) {
      gsap.to('.hero__copy', { yPercent: -12, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    if ($('.phero__in')) gsap.to('.phero__in', { yPercent: -18, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: true } });

    // Split headings
    if (window.SplitText) {
      $$('.split').forEach(h => {
        const st = SplitText.create(h, { type: 'words', mask: 'words', wordsClass: 'w-in' });
        gsap.from(st.words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 85%' } });
      });
    }

    // Manifesto scrub
    const words = $$('.manifesto__text .word');
    if (words.length) ScrollTrigger.create({
      trigger: '.manifesto', start: 'top 70%', end: 'bottom 55%', scrub: true,
      onUpdate: self => { const n = Math.round(self.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); }
    });

    // Batch reveals
    const batch = (sel, opts = {}) => {
      gsap.set(sel, { opacity: 0, y: 40 });
      ScrollTrigger.batch(sel, { start: 'top 88%', onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1, ...opts, overwrite: true }) });
    };
    if ($('.demo__stage')) gsap.from('.demo__stage .console', { y: 60, opacity: 0, rotateX: 8, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.demo', start: 'top 75%' } });
    ['.card', '.case', '.study', '.pillar', '.founder', '.form', '.svc__col', '.guard__item', '.engage__card', '.band__in', '.faq__ask']
      .forEach(sel => { if ($(sel)) batch(sel); });
    ['.faq details', '.strip__steps li', '.principles__list li', '.next li', '.jump a'].forEach(sel => { if ($(sel)) batch(sel, { stagger: .06 }); });
    $$('.sec-head .kicker, .cta .kicker, .svc__no').forEach(k => gsap.from(k, { opacity: 0, x: -16, duration: .8, scrollTrigger: { trigger: k, start: 'top 90%' } }));
    $$('.lead:not(.reveal-up)').forEach(l => gsap.from(l, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 90%' } }));

    // Process line + steps
    const fill = $('.process__line i');
    if (fill) {
      gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process__track', start: 'top 62%', end: 'bottom 62%', scrub: .4 } });
      $$('.step').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 62%', onEnter: () => s.classList.add('on'), onLeaveBack: () => s.classList.remove('on') }));
    }

    // Photos: clip reveal + gentle parallax
    $$('.ph--band, .ph--svc').forEach(f => {
      gsap.fromTo(f, { clipPath: 'inset(10% 6% 10% 6% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 95%', end: 'top 45%', scrub: .6 } });
    });
    $$('.ph').forEach(f => {
      const im = $('img, video', f);
      if (!im) return;
      gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Footer wordmark
    gsap.from('.footer__big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 90%' } });

    // Stack marquee speed-up with scroll velocity
    const track = $('.marquee__track');
    if (track && lenis) {
      lenis.on('scroll', ({ velocity }) => { track.style.animationDuration = Math.max(14, 45 - Math.abs(velocity) * 3) + 's'; });
    }

    window.addEventListener('load', () => { ScrollTrigger.refresh(); goToHash(); });
    goToHash();
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  };

  /* ---------- Loader ---------- */
  const loader = $('.loader');
  const seen = doc.classList.contains('seen');
  const begin = () => requestAnimationFrame(runIntro);
  if (!loader || seen || reduce || !hasGSAP) {
    if (loader) loader.remove();
    begin();
  } else {
    try { sessionStorage.setItem('nf-seen', '1'); } catch (e) {}
    setTimeout(() => {
      gsap.to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut', onComplete: () => loader.remove() });
      setTimeout(begin, 350);
    }, 1150);
  }
})();

// Work page on phones: show the headline result, tuck the long write-up behind a toggle
(() => {
  document.querySelectorAll('.study__body').forEach((body) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'study__more';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Read the full story';
    btn.addEventListener('click', () => {
      const open = body.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Show less' : 'Read the full story';
    });
    body.after(btn);
  });
})();
