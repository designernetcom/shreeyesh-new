/* =============================================================================
   Shreeyash Electro Medicals — homepage behaviour
   Vanilla, no dependencies. Every enhancement degrades to a working page.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------------------------------------------------------------------
     Scrollbar width
     .shell is centred inside the content box; 100vw includes the scrollbar.
     Publishing the difference lets the hero's left edge line up with the
     logo above it instead of drifting by ~15px on Windows.
     ------------------------------------------------------------------ */
  function measureScrollbar() {
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--sbw', sbw + 'px');
  }
  measureScrollbar();


  /* ---------------------------------------------------------------------
     Sticky header state
     A zero-height sentinel is cheaper and smoother than a scroll listener.
     ------------------------------------------------------------------ */
  var header = document.getElementById('header');

  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }


  /* ---------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var burger = document.getElementById('burger');
  var panel = document.getElementById('nav-panel');

  if (burger && panel) {
    var openNav = function () {
      panel.hidden = false;
      // Next frame, so the transition runs from the hidden state.
      requestAnimationFrame(function () {
        document.body.setAttribute('data-nav-open', '');
      });
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
    };

    var closeNav = function () {
      document.body.removeAttribute('data-nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');

      if (reduceMotion) {
        panel.hidden = true;
      } else {
        window.setTimeout(function () {
          if (!document.body.hasAttribute('data-nav-open')) panel.hidden = true;
        }, 360);
      }
    };

    burger.addEventListener('click', function () {
      if (document.body.hasAttribute('data-nav-open')) closeNav();
      else openNav();
    });

    // Follow a link, then get out of the way.
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.hasAttribute('data-nav-open')) {
        closeNav();
        burger.focus();
      }
    });

    // Leaving the mobile breakpoint with the panel open would trap scroll.
    var desktop = window.matchMedia('(min-width: 1181px)');
    var onBreakpoint = function (e) {
      if (e.matches && document.body.hasAttribute('data-nav-open')) closeNav();
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }


  /* ---------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // No observer, or the visitor asked for stillness — show everything.
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);   // one-shot: never animate back out
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.1
    });

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });
  }


  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------------------------------------------------------------------
     Resize
     ------------------------------------------------------------------ */
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measureScrollbar, 150);
  });

})();
