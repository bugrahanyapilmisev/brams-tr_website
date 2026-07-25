/* =========================================================
   BRAMS — site behaviour
   No dependencies. Every block is defensive: pages that do not
   contain a given component simply skip it.
   ========================================================= */
(function () {
  'use strict';

  /* ---- 1. Sticky nav shadow ---- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 2. Mobile drawer ---- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && drawer.classList.contains('open')) setOpen(false);
    });
  }

  /* ---- 3. Active nav state ---- */
  (function () {
    var file = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('[data-page]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-page') === file) links[i].classList.add('active');
    }
  })();

  /* ---- 4. Scroll reveal ---- */
  (function () {
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < els.length; j++) els[j].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    els.forEach(function (el, i) {
      el.style.transitionDelay = (i % 5) * 70 + 'ms';
      io.observe(el);
    });
  })();

  /* ---- 5. Obfuscated e-mail / phone (basic scrape protection) ---- */
  (function () {
    var b64 = function (v) { try { return atob(v); } catch (e) { return ''; } };

    document.querySelectorAll('[data-mail]').forEach(function (el) {
      var user = b64(el.getAttribute('data-mail'));
      var host = b64(el.getAttribute('data-host'));
      if (!user || !host) return;
      var addr = user + '@' + host;
      if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + addr);
      var slot = el.querySelector('.val') || el;
      if (!slot.textContent.trim()) slot.textContent = addr;
    });

    document.querySelectorAll('[data-tel]').forEach(function (el) {
      var num = b64(el.getAttribute('data-tel'));
      if (!num) return;
      if (el.tagName === 'A') el.setAttribute('href', 'tel:' + num.replace(/[^+\d]/g, ''));
      var slot = el.querySelector('.val') || el;
      if (!slot.textContent.trim()) slot.textContent = num;
    });
  })();

  /* ---- 6. Contact form -> mailto handoff -----------------------------
     Static hosting has no mail server, so the form composes a message in
     the visitor's own mail client. Swap for a Cloudflare Pages Function or
     a form service later; the markup will not need to change.
  -------------------------------------------------------------------- */
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var get = function (id) {
        var el = form.querySelector('#' + id);
        return el ? el.value.trim() : '';
      };
      var LABELS = {
        tr: { name: 'Ad Soyad', company: 'Şirket', email: 'E-posta', phone: 'Telefon',
              topic: 'Talep türü', country: 'Ülke', msg: 'Mesaj',
              subject: 'Web sitesi talebi' },
        en: { name: 'Name', company: 'Company', email: 'Email', phone: 'Phone',
              topic: 'Enquiry type', country: 'Country', msg: 'Message',
              subject: 'Website enquiry' },
        ro: { name: 'Nume', company: 'Companie', email: 'E-mail', phone: 'Telefon',
              topic: 'Tip de solicitare', country: 'Țară', msg: 'Mesaj',
              subject: 'Solicitare de pe site' }
      };
      var L = LABELS[form.getAttribute('data-lang')] || LABELS.tr;

      var lines = [
        L.name + ': ' + get('cf-name'),
        L.company + ': ' + get('cf-company'),
        L.email + ': ' + get('cf-email'),
        L.phone + ': ' + get('cf-phone'),
        L.country + ': ' + get('cf-country'),
        L.topic + ': ' + get('cf-topic'),
        '',
        L.msg + ':',
        get('cf-message')
      ];

      var to = atob(form.getAttribute('data-mail')) + '@' + atob(form.getAttribute('data-host'));
      var subject = L.subject + ' — ' + (get('cf-topic') || get('cf-company') || get('cf-name'));

      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      var msg = document.getElementById('form-msg');
      if (msg) msg.classList.add('show');
    });
  })();

  /* ---- 7. Current year ---- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
