/* Betini Trips — main.js | Swellbridge Digital */
(function () {
  'use strict';

  var WA = '2347034491010';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp deep links (context-aware pre-fill) ---------- */
  function waLink(msg) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var msg = a.getAttribute('data-wa') || 'Hi Betini Trips, I would like to plan a trip.';
    a.href = waLink(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      if (window.gtag) gtag('event', 'contact', { method: 'whatsapp', placement: a.dataset.place || 'unknown' });
      if (window.fbq) fbq('track', 'Contact');
    });
  });

  /* ---------- Loader ---------- */
  var loader = document.querySelector('.loader');
  if (loader) {
    if (reduce || sessionStorage.getItem('bt_seen')) {
      loader.remove();
    } else {
      var kill = function () {
        loader.classList.add('is-done');
        sessionStorage.setItem('bt_seen', '1');
        setTimeout(function () { loader.remove(); }, 800);
      };
      window.addEventListener('load', function () { setTimeout(kill, 300); });
      setTimeout(kill, 1500); // hard cap
    }
  }

  /* ---------- Nav: transparent -> solid ---------- */
  var nav = document.querySelector('.nav');
  var forceSolid = nav && nav.hasAttribute('data-solid');
  function navState() {
    if (!nav) return;
    if (forceSolid || window.scrollY > 60) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }
  navState();
  window.addEventListener('scroll', navState, { passive: true });

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.drawer');
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      drawer.querySelectorAll('nav a').forEach(function (a, i) {
        a.style.animationDelay = (i * 55 + 90) + 'ms';
      });
    });
    drawer.querySelector('.drawer__close').addEventListener('click', closeDrawer);
    drawer.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); closeLb(); }
  });

  /* ---------- Scroll reveal ---------- */
  var rvs = document.querySelectorAll('.rv');
  if (rvs.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      rvs.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      rvs.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- THE ROUTE: scroll-linked red line ---------- */
  var track = document.querySelector('.route__track');
  if (track && !reduce) {
    var fill = track.querySelector('.route__line i');
    var steps = Array.prototype.slice.call(track.querySelectorAll('.route__step'));
    var tick = function () {
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress from when track top hits 78% of viewport, to when it hits 30%
      var p = (vh * 0.78 - r.top) / (r.height + vh * 0.34);
      p = Math.max(0, Math.min(1, p));
      if (fill) fill.style.width = (p * 100) + '%';
      steps.forEach(function (s, i) {
        var at = (i + 0.35) / steps.length;
        s.classList.toggle('is-on', p >= at);
      });
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  } else if (track) {
    track.querySelectorAll('.route__step').forEach(function (s) { s.classList.add('is-on'); });
  }

  /* ---------- Floating WhatsApp bubble ---------- */
  var fab = document.querySelector('.fab');
  var foot = document.querySelector('.foot');
  if (fab) {
    var fabTick = function () {
      var deep = window.scrollY > window.innerHeight * 0.25;
      var footNear = foot && foot.getBoundingClientRect().top < window.innerHeight - 60;
      fab.classList.toggle('is-on', deep && !footNear);
    };
    fabTick();
    window.addEventListener('scroll', fabTick, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__i').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      item.classList.toggle('is-open', !open);
      q.setAttribute('aria-expanded', String(!open));
      a.style.maxHeight = open ? '0px' : a.scrollHeight + 'px';
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector('.lb');
  var lbImg = lb && lb.querySelector('img');
  var lbCap = lb && lb.querySelector('.lb__cap');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
  var idx = 0;

  function openLb(i) {
    if (!lb || !items.length) return;
    idx = (i + items.length) % items.length;
    var el = items[idx];
    lbImg.src = el.getAttribute('data-lb');
    lbImg.alt = el.getAttribute('data-lb-cap') || '';
    if (lbCap) lbCap.textContent = el.getAttribute('data-lb-cap') || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  items.forEach(function (el, i) {
    el.addEventListener('click', function () { openLb(i); });
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });
  if (lb) {
    lb.querySelector('.lb__x').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    var p = lb.querySelector('.lb__prev'), n = lb.querySelector('.lb__next');
    if (p) p.addEventListener('click', function (e) { e.stopPropagation(); openLb(idx - 1); });
    if (n) n.addEventListener('click', function (e) { e.stopPropagation(); openLb(idx + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') openLb(idx - 1);
      if (e.key === 'ArrowRight') openLb(idx + 1);
    });
  }

  /* ---------- Copy phone number ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy');
      var done = function () {
        var old = b.textContent;
        b.textContent = 'Copied ✓';
        setTimeout(function () { b.textContent = old; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
      else {
        var t = document.createElement('textarea');
        t.value = txt; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(t);
      }
    });
  });

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1400, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e).toString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Contact form: honeypot + timing + Netlify ---------- */
  var form = document.querySelector('form[data-bt-form]');
  if (form) {
    var t0 = Date.now();
    form.addEventListener('submit', function (e) {
      if (form.querySelector('[name="company-website"]').value) { e.preventDefault(); return; }
      if (Date.now() - t0 < 2500) { e.preventDefault(); return; }
      if (window.gtag) gtag('event', 'generate_lead', { method: 'form' });
      if (window.fbq) fbq('track', 'Lead');
    });
  }

  /* ---------- Sticky mobile bar spacing ---------- */
  if (document.querySelector('.stickybar')) document.body.classList.add('has-stickybar');

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
