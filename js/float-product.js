(function () {
  'use strict';
  var gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;
  var images = [
    { src: 'assets/img/float2.jpg', alt: 'Float Warmer complete system by Shreeyash Electro Medicals' },
    { src: 'assets/img/float4.jpg', alt: 'Float Warmer storage drawer detail' },
    { src: 'assets/img/float5.jpg', alt: 'Float Warmer baby bed detail' },
    { src: 'assets/img/float6.jpg', alt: 'Float Warmer radiant bed detail' }
  ];
  var image = gallery.querySelector('[data-gallery-image]');
  var current = gallery.querySelector('[data-gallery-current]');
  var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
  var index = 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(next) {
    index = (next + images.length) % images.length;
    var item = images[index];
    image.style.opacity = '0';
    window.setTimeout(function () {
      image.src = item.src;
      image.alt = item.alt;
      image.style.opacity = '1';
    }, reduceMotion ? 0 : 140);
    current.textContent = String(index + 1).padStart(2, '0');
    Array.prototype.forEach.call(thumbs, function (thumb, i) {
      var active = i === index;
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  gallery.querySelector('[data-gallery-prev]').addEventListener('click', function () { render(index - 1); });
  gallery.querySelector('[data-gallery-next]').addEventListener('click', function () { render(index + 1); });
  Array.prototype.forEach.call(thumbs, function (thumb) {
    thumb.addEventListener('click', function () { render(Number(thumb.getAttribute('data-gallery-thumb'))); });
  });

  var lightbox = document.querySelector('[data-lightbox]');
  var lightboxImage = document.querySelector('[data-lightbox-image]');
  var closeLightbox = function () {
    lightbox.hidden = true;
    document.body.removeAttribute('data-lightbox-open');
  };
  gallery.querySelector('[data-gallery-expand]').addEventListener('click', function () {
    lightboxImage.src = images[index].src;
    lightboxImage.alt = images[index].alt;
    lightbox.hidden = false;
    document.body.setAttribute('data-lightbox-open', '');
  });
  document.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    if (event.key === 'ArrowLeft' && gallery.contains(document.activeElement)) render(index - 1);
    if (event.key === 'ArrowRight' && gallery.contains(document.activeElement)) render(index + 1);
  });

  var touchStart = 0;
  var stage = gallery.querySelector('.product-gallery__main');
  stage.addEventListener('touchstart', function (event) { touchStart = event.changedTouches[0].screenX; }, { passive: true });
  stage.addEventListener('touchend', function (event) {
    var distance = event.changedTouches[0].screenX - touchStart;
    if (Math.abs(distance) > 45) render(index + (distance < 0 ? 1 : -1));
  }, { passive: true });
}());
