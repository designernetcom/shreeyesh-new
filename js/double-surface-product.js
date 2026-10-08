(function () {
  'use strict';
  var gallery = document.querySelector('[data-phototherapy-expand]');
  var lightbox = document.querySelector('[data-lightbox]');
  if (!gallery || !lightbox) return;
  var image = document.querySelector('.product-hero__device-image');
  var lightboxImage = document.querySelector('[data-lightbox-image]');
  var closeLightbox = function () {
    lightbox.hidden = true;
    document.body.removeAttribute('data-lightbox-open');
  };
  gallery.addEventListener('click', function () {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.setAttribute('data-lightbox-open', '');
  });
  document.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
}());
