/* =============================================================================
   Shreeyash Electro Medicals — homepage behaviour
   Vanilla, no dependencies. Every enhancement degrades to a working page.
   ========================================================================== */
(function () {
  'use strict';

  // Tells the failsafe in <head> that entrance animations are under control.
  window.SEM_READY = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };


  /* ---------------------------------------------------------------------
     Header
     Gains a hairline once it sticks; slides away while reading down the
     page and returns the moment the visitor scrolls back up.
     ------------------------------------------------------------------ */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  var ticking = false;

  function updateHeader() {
    var y = window.scrollY;
    var delta = y - lastY;
    var navOpen = document.body.hasAttribute('data-nav-open');

    header.classList.toggle('is-stuck', header.getBoundingClientRect().top <= 0 && y > 0);

    if (!navOpen && y > 560 && delta > 4 && !header.contains(document.activeElement)) {
      header.classList.add('is-hidden');
    } else if (delta < -4 || y <= 560) {
      header.classList.remove('is-hidden');
    }

    lastY = y;
    ticking = false;
  }

  if (header) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    header.addEventListener('focusin', function () {
      header.classList.remove('is-hidden');
    });

    updateHeader();
  }


  /* ---------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var burger = document.getElementById('burger');
  var panel = document.getElementById('nav-panel');
  var behind = document.querySelectorAll('main, footer, .utility');

  if (burger && panel) {
    var setInert = function (on) {
      each(behind, function (el) {
        if (on) el.setAttribute('inert', '');
        else el.removeAttribute('inert');
      });
    };

    var openNav = function () {
      panel.hidden = false;
      header.classList.remove('is-hidden');
      // Next frame, so the transition runs from the hidden state.
      requestAnimationFrame(function () {
        document.body.setAttribute('data-nav-open', '');
      });
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      setInert(true);
    };

    var closeNav = function (restoreFocus) {
      document.body.removeAttribute('data-nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      setInert(false);
      if (restoreFocus) burger.focus();

      if (reduceMotion) {
        panel.hidden = true;
      } else {
        window.setTimeout(function () {
          if (!document.body.hasAttribute('data-nav-open')) panel.hidden = true;
        }, 450);
      }
    };

    burger.addEventListener('click', function () {
      if (document.body.hasAttribute('data-nav-open')) closeNav(false);
      else openNav();
    });

    // Follow a link, then get out of the way.
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.hasAttribute('data-nav-open')) closeNav(true);
    });

    // Leaving the mobile breakpoint with the panel open would trap scroll.
    var desktop = window.matchMedia('(min-width: 1081px)');
    var onBreakpoint = function (e) {
      if (e.matches && document.body.hasAttribute('data-nav-open')) closeNav(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }


  /* ---------------------------------------------------------------------
     Headline word split
     Each word gets its own clipping box so it can rise into place. The
     heading keeps its plain-text name for assistive tech.
     ------------------------------------------------------------------ */
  each(document.querySelectorAll('[data-split]'), function (el) {
    var index = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

    (function walk(node) {
      each(Array.prototype.slice.call(node.childNodes), function (child) {
        if (child.nodeType === 1) { walk(child); return; }
        if (child.nodeType !== 3) return;

        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var outer = document.createElement('span');
          var inner = document.createElement('span');
          outer.className = 'w';
          inner.textContent = part;
          inner.style.setProperty('--wi', index++);
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      });
    })(el);

    el.classList.add('is-split');
  });


  /* ---------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('[data-reveal], [data-split]');

  if (reduceMotion || !hasIO) {
    each(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);   // one-shot: never animate back out
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    each(revealables, function (el) { revealObserver.observe(el); });
  }


  /* ---------------------------------------------------------------------
     Care index
     Hover or focus a row and its product takes the stage.
     ------------------------------------------------------------------ */
  each(document.querySelectorAll('[data-care]'), function (care) {
    var items = care.querySelectorAll('.care__item');
    var activate = function (item) {
      each(items, function (other) { other.classList.toggle('is-active', other === item); });
    };
    each(items, function (item) {
      var row = item.querySelector('.care__row');
      row.addEventListener('pointerenter', function () { activate(item); });
      row.addEventListener('focusin', function () { activate(item); });
    });
  });


  /* ---------------------------------------------------------------------
     Monitor trace
     An illustrative bubble-CPAP pressure trace, drawn the way a bedside
     monitor draws: a sweep head moves left to right, overwriting the
     previous pass just ahead of it. The bubble amplitude swells and
     settles on a slow cycle — the one thing Humming Bee lets you adjust.

     The signal is a pure function of time, so a sweep is computed once
     when it starts and each frame only has to stroke two polylines.
     ------------------------------------------------------------------ */
  function Monitor(el) {
    var canvas = el.querySelector('canvas');
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var bars = el.querySelectorAll('.meter i');
    var color = getComputedStyle(el).getPropertyValue('--trace').trim() || '#18885c';

    var SPEED = 96;          // px per second
    var GAP = 26;            // erased band ahead of the sweep head
    var ENVELOPE = 13;       // seconds for one low → high → low amplitude cycle
    var TAU = Math.PI * 2;

    var W = 0, H = 0;
    var curr = null, prev = null;   // signal values for this sweep and the last
    var sweepStart = 0;             // clock time at which the head was at x = 0
    var clock = 0, lastFrame = 0;
    var raf = 0, onScreen = true;
    var lastLevel = -1;

    function envelope(t) {
      return 0.58 - 0.42 * Math.cos(t * TAU / ENVELOPE);   // 0.16 … 1
    }

    function signal(t) {
      // slow component: the infant's breathing riding on the set pressure
      var breath = Math.sin(t * TAU * 0.82) * 0.55 + Math.sin(t * TAU * 1.64 + 0.9) * 0.12;
      // fast component: bubbling — several incommensurate tones, so it
      // never settles into a visibly repeating pattern
      var bubble = Math.sin(t * TAU * 8.7) * 0.5 +
                   Math.sin(t * TAU * 13.3 + 1.7) * 0.3 +
                   Math.sin(t * TAU * 4.9 + 0.4) * 0.28 +
                   Math.sin(t * TAU * 21.1 + 2.3) * 0.12;
      bubble *= 0.72 + 0.28 * Math.sin(t * TAU * 1.9 + 0.3);
      return breath * 0.34 + bubble * envelope(t) * 0.66;
    }

    function fill(arr, start) {
      for (var x = 0; x < arr.length; x++) arr[x] = signal(start + x / SPEED);
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      curr = new Float32Array(W + 1);
      prev = new Float32Array(W + 1);
    }

    // Place the sweep head at a fraction of the width and rebuild both passes.
    function cue(at) {
      sweepStart = clock - (W * at) / SPEED;
      fill(curr, sweepStart);
      fill(prev, sweepStart - (W + 1) / SPEED);
    }

    function y(v) {
      return H / 2 - v * H * 0.3;
    }

    function stroke(arr, from, to, alpha) {
      if (to - from < 2) return;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(from, y(arr[from]));
      for (var x = from + 1; x <= to; x++) ctx.lineTo(x, y(arr[x]));
      ctx.stroke();
    }

    function draw() {
      var head = Math.min(W, Math.floor((clock - sweepStart) * SPEED));

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      stroke(prev, Math.min(W, head + GAP), W, 0.32);   // previous pass, fading out
      stroke(curr, 0, head, 1);                        // this pass

      var hy = y(curr[head]);
      ctx.globalAlpha = 0.16;
      ctx.beginPath(); ctx.arc(head, hy, 7, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(head, hy, 2.75, 0, TAU); ctx.fill();

      var level = Math.max(1, Math.min(5, Math.ceil(envelope(clock) * 5)));
      if (level !== lastLevel) {
        each(bars, function (bar, i) { bar.classList.toggle('is-on', i < level); });
        lastLevel = level;
      }
    }

    function frame(now) {
      raf = 0;
      var dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
      lastFrame = now;
      clock += dt;

      // Head ran off the right edge: this sweep becomes the old one.
      if ((clock - sweepStart) * SPEED > W) {
        sweepStart += (W + 1) / SPEED;
        var swap = prev; prev = curr; curr = swap;
        fill(curr, sweepStart);
      }

      draw();
      schedule();
    }

    function schedule() {
      if (!raf && onScreen && !document.hidden && !reduceMotion) {
        raf = window.requestAnimationFrame(frame);
      }
    }

    function pause() {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    }

    // Start with a sweep already in progress so the strip is never empty.
    clock = 20;
    resize();
    cue(reduceMotion ? 0.72 : 0.55);
    draw();
    schedule();

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) schedule(); else pause();
      }).observe(el);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else schedule();
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var rect = canvas.getBoundingClientRect();
        if (Math.round(rect.width) === W && Math.round(rect.height) === H) return;
        var at = Math.min(0.95, (clock - sweepStart) * SPEED / W);
        resize();
        cue(at);
        draw();
      }, 120);
    });
  }

  each(document.querySelectorAll('[data-monitor]'), Monitor);


  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
