/* ============================================================
   PS Quality — script.js
   psquality.uk
============================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. NAV — transparent → solid on scroll
  ------------------------------------------------------- */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately in case page loads mid-scroll

  /* -------------------------------------------------------
     2. MOBILE MENU — hamburger toggle
  ------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* -------------------------------------------------------
     3. SMOOTH SCROLL — offset for fixed nav
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = nav.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* -------------------------------------------------------
     4. CONTACT FORM — AJAX submit via Formspree
  ------------------------------------------------------- */
  var form      = document.getElementById('contactForm');
  var statusEl  = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic client-side guard — all required fields
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      if (!valid) {
        setStatus('Please fill in all required fields.', '#e07070');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026'; // "Sending…"
      setStatus('', '');

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          setStatus('Thank you — we\u2019ll be in touch shortly.', 'var(--copper-light)');
          form.reset();
        } else {
          var data = await response.json().catch(function () { return {}; });
          var msg = (data.errors && data.errors.map(function (e) { return e.message; }).join(', '))
            || 'Something went wrong. Please try calling us directly.';
          setStatus(msg, '#e07070');
        }
      } catch (err) {
        setStatus('Unable to send. Please check your connection and try again.', '#e07070');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });

    // Remove error class on input
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) field.classList.remove('error');
      });
    });
  }

  function setStatus(msg, color) {
    statusEl.textContent = msg;
    statusEl.style.color = color;
  }

})();
