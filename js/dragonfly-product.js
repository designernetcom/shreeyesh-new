(function () {
  'use strict';
  var gallery = document.querySelector('.dragonfly-gallery');
  if (!gallery) return;
  var lightbox = document.querySelector('[data-lightbox]');
  var lightboxImage = document.querySelector('[data-lightbox-image]');
  var image = gallery.querySelector('.product-hero__device-image');
  function close() { lightbox.hidden = true; document.body.removeAttribute('data-lightbox-open'); }
  gallery.querySelector('[data-dragonfly-expand]').addEventListener('click', function () {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.setAttribute('data-lightbox-open', '');
  });
  document.querySelector('[data-lightbox-close]').addEventListener('click', close);
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !lightbox.hidden) close(); });
}());
