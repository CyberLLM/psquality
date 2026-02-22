/* ============================================================
   PS Quality — gallery.js
   Lightbox for projects.html
============================================================ */

(function () {
  'use strict';

  var images = (function () {
    var srcs = [];
    document.querySelectorAll('.gallery-item img').forEach(function (img) {
      srcs.push(img.src);
    });
    return srcs;
  })();

  var total      = images.length;
  var current    = 0;

  var lightbox   = document.getElementById('lightbox');
  var backdrop   = document.getElementById('lightboxBackdrop');
  var closeBtn   = document.getElementById('lightboxClose');
  var prevBtn    = document.getElementById('lightboxPrev');
  var nextBtn    = document.getElementById('lightboxNext');
  var img        = document.getElementById('lightboxImg');
  var counter    = document.getElementById('lightboxCounter');

  /* --- Open --- */
  function open(index) {
    current = index;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    loadImage(current);
    lightbox.focus();
  }

  /* --- Close --- */
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  /* --- Load image --- */
  function loadImage(index) {
    img.classList.add('loading');
    var newImg = new Image();
    newImg.onload = function () {
      img.src = newImg.src;
      img.alt = 'PS Quality project ' + (index + 1);
      img.classList.remove('loading');
    };
    newImg.src = images[index];
    counter.textContent = (index + 1) + ' / ' + total;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
  }

  /* --- Navigate --- */
  function prev() { if (current > 0)           loadImage(--current); }
  function next() { if (current < total - 1)   loadImage(++current); }

  /* --- Event listeners --- */
  document.querySelectorAll('.gallery-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(parseInt(this.dataset.index, 10));
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* Touch swipe */
  var touchStartX = null;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    }
    touchStartX = null;
  }, { passive: true });

})();
