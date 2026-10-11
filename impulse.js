/* IMPULSE funnel behaviour: opt-in form, video players, calendar embed, tracking.
   Everything is configured with data- attributes in the HTML, so no edits are
   needed here when the backend, videos or calendar go live. */
(function () {
  'use strict';

  // Pushes funnel events to window.dataLayer (Google Tag Manager format).
  // Without a tag manager installed this just builds up an array, harmlessly.
  function track(event, props) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, props || {}));
  }

  track('funnel_page_view', { funnel_stage: document.body.getAttribute('data-stage') || '' });

  // --- Opt-in form (page 1) ---
  // data-endpoint: URL the lead is POSTed to. Leave empty for demo mode,
  //                which skips the POST and goes straight to data-next.
  // data-next:     page to send the visitor to after a successful opt-in.
  var form = document.getElementById('optin-form');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    form.querySelectorAll('input[data-utm]').forEach(function (input) {
      input.value = params.get(input.name) || '';
    });

    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn.textContent;
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint');
      var next = form.getAttribute('data-next');

      status.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      track('optin_submit', {
        monthly_profit: data.get('monthly_profit'),
        primary_challenge: data.get('primary_challenge'),
        sms_consent: data.get('sms_consent') === 'yes'
      });

      if (!endpoint) {
        console.warn('[impulse] No data-endpoint on #optin-form: demo mode, lead not saved.');
        window.location.href = next;
        return;
      }

      fetch(endpoint, { method: 'POST', body: data })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          window.location.href = next;
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
          status.textContent = 'Error: we couldn\'t send your details. Please try again.';
        });
    });
  }

  // --- Video players (pages 2 and 4) ---
  // data-video-src:    video file URL (MP4). Empty keeps the placeholder.
  // data-captions-src: optional WebVTT captions file, shown by default.
  document.querySelectorAll('.video-shell[data-video-src]').forEach(function (shell) {
    var src = shell.getAttribute('data-video-src');
    if (!src) return;

    var video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.controls = true;
    video.setAttribute('aria-label', shell.getAttribute('data-video-label') || 'Video');

    var captions = shell.getAttribute('data-captions-src');
    if (captions) {
      var trackEl = document.createElement('track');
      trackEl.kind = 'captions';
      trackEl.srclang = 'en';
      trackEl.label = 'English';
      trackEl.src = captions;
      trackEl.default = true;
      video.appendChild(trackEl);
    }

    var placeholder = shell.querySelector('.video-placeholder');
    if (placeholder) placeholder.remove();
    shell.appendChild(video);

    // Autoplay has to start muted, so offer a clear one-tap unmute.
    var muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'mute-toggle';
    muteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>Tap to unmute';
    muteBtn.addEventListener('click', function () {
      video.muted = false;
      video.play();
    });
    shell.appendChild(muteBtn);

    video.addEventListener('volumechange', function () {
      muteBtn.hidden = !video.muted;
      if (!video.muted) track('video_unmute', { video: src });
    });
    video.addEventListener('ended', function () { track('video_complete', { video: src }); });
  });

  // --- Calendar embed (page 3) ---
  // data-calendar-src:  scheduler link, e.g. https://calendly.com/you/positioning-review
  // data-calendar-next: page to send the visitor to once they've booked.
  var calendar = document.querySelector('[data-calendar-src]');
  var calUrl = null;
  if (calendar && calendar.getAttribute('data-calendar-src')) {
    // A malformed link would throw here and stop the rest of this script,
    // so keep the placeholder and warn instead.
    try {
      calUrl = new URL(calendar.getAttribute('data-calendar-src'));
      if (calUrl.protocol !== 'https:') throw new Error('not https');
    } catch (err) {
      calUrl = null;
      console.warn('[impulse] data-calendar-src must be a full https:// link, e.g. https://calendly.com/you/positioning-review');
    }
  }
  if (calUrl) {
    var isCalendly = /(^|\.)calendly\.com$/.test(calUrl.hostname);

    if (isCalendly) {
      // embed_domain makes Calendly post booking events back to this page.
      calUrl.searchParams.set('embed_domain', window.location.hostname || 'localhost');
      calUrl.searchParams.set('embed_type', 'Inline');
      // Pass this page's UTM tags through so bookings are attributed.
      new URLSearchParams(window.location.search).forEach(function (value, key) {
        if (key.indexOf('utm_') === 0) calUrl.searchParams.set(key, value);
      });
    }

    var iframe = document.createElement('iframe');
    iframe.src = calUrl.toString();
    iframe.title = 'Pick a time for your positioning review';
    calendar.innerHTML = '';
    calendar.appendChild(iframe);

    // Redirect after booking. Works on Calendly's free plan, so the paid
    // "redirect to external site" setting isn't needed.
    var calNext = calendar.getAttribute('data-calendar-next');
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://calendly.com' || !e.data || !e.data.event) return;
      // Calendly reports its content height; size the iframe to match so
      // phones don't get a scrolling box inside the scrolling page.
      if (e.data.event === 'calendly.page_height') {
        var h = parseInt(e.data.payload && e.data.payload.height, 10);
        if (h > 300 && h < 3000) iframe.style.height = h + 'px';
      }
      if (e.data.event === 'calendly.event_scheduled') {
        track('call_booked');
        if (calNext) window.location.href = calNext;
      }
    });
  }

  // --- Cut demo (page 1) ---
  // A magnifying glass reads across the generic copy, line by line, showing the
  // reframed copy under the lens; then the reveal widens to the whole card,
  // holds, and starts again. With a mouse, the lens follows the pointer.
  // Reduced-motion visitors get the finished (reframed) card with no movement.
  var cutStage = document.querySelector('[data-cut-demo]');
  if (cutStage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var PATH = [[0.1, 0.42], [0.9, 0.42], [0.1, 0.56], [0.9, 0.56], [0.1, 0.7], [0.9, 0.7]];
    var SEGMENT = 1100, REVEAL = 700, HOLD = 3000;
    var SCAN = (PATH.length - 1) * SEGMENT, CYCLE = SCAN + REVEAL + HOLD;
    var cutStart = null, cutFollowing = false, cutVisible = true, cutFrame = null;

    var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
    var setLens = function (x, y, r) {
      cutStage.style.setProperty('--x', x + 'px');
      cutStage.style.setProperty('--y', y + 'px');
      cutStage.style.setProperty('--r', r + 'px');
    };

    var cutTick = function (now) {
      cutFrame = null;
      if (cutFollowing || !cutVisible) return;
      if (cutStart === null) cutStart = now;
      var w = cutStage.clientWidth, h = cutStage.clientHeight;
      var lens = Math.max(36, Math.min(60, w * 0.12));
      cutStage.style.setProperty('--lens', lens + 'px');
      var t = (now - cutStart) % CYCLE;

      if (t < SCAN) {
        var i = Math.floor(t / SEGMENT), k = ease((t % SEGMENT) / SEGMENT);
        var a = PATH[i], b = PATH[i + 1];
        cutStage.classList.add('is-scanning');
        setLens((a[0] + (b[0] - a[0]) * k) * w, (a[1] + (b[1] - a[1]) * k) * h, lens - 3);
      } else {
        var end = PATH[PATH.length - 1];
        var grow = ease(Math.min(1, (t - SCAN) / REVEAL));
        cutStage.classList.remove('is-scanning');
        setLens(end[0] * w, end[1] * h, lens + (Math.hypot(w, h) - lens) * grow);
      }
      cutFrame = window.requestAnimationFrame(cutTick);
    };
    var cutRun = function () { if (cutFrame === null) cutFrame = window.requestAnimationFrame(cutTick); };

    cutStage.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var box = cutStage.getBoundingClientRect();
      var lens = parseFloat(cutStage.style.getPropertyValue('--lens')) || 56;
      cutFollowing = true;
      cutStage.classList.add('is-scanning');
      setLens(e.clientX - box.left, e.clientY - box.top, lens - 3);
    });
    cutStage.addEventListener('pointerleave', function () {
      if (!cutFollowing) return;
      cutFollowing = false;
      cutStart = null;
      cutRun();
    });

    // Only animate while the card is on screen.
    if (typeof window.IntersectionObserver === 'function') {
      new IntersectionObserver(function (entries) {
        cutVisible = entries[0].isIntersecting;
        if (cutVisible) cutRun();
      }).observe(cutStage);
    }
    cutRun();
  }

  // --- Exit-intent popup (pages 1 to 3) ---
  // Opens when the cursor leaves through the top of the window, or after
  // data-exit-delay ms. Shown at most once per browser session across the funnel.
  var exitModal = document.querySelector('[data-exit-modal]');
  if (exitModal) {
    var EXIT_KEY = 'impulse_popup_shown';
    var exitShown = false, exitReturnFocus = null;
    var exitSeen = function () {
      try { return !!window.sessionStorage.getItem(EXIT_KEY); } catch (err) { return false; }
    };

    var showExit = function (trigger) {
      if (exitShown || exitSeen()) return;
      // Don't interrupt someone who is filling in a form.
      var active = document.activeElement;
      if (active && /^(INPUT|SELECT|TEXTAREA)$/.test(active.tagName)) return;
      exitShown = true;
      try { window.sessionStorage.setItem(EXIT_KEY, '1'); } catch (err) { /* private mode */ }
      exitReturnFocus = active;
      exitModal.hidden = false;
      document.body.style.overflow = 'hidden';
      exitModal.querySelector('.exit-modal-close').focus();
      track('exit_modal_shown', { trigger: trigger });
    };

    var hideExit = function () {
      if (exitModal.hidden) return;
      exitModal.hidden = true;
      document.body.style.overflow = '';
      if (exitReturnFocus && exitReturnFocus.focus) exitReturnFocus.focus();
    };

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY < 10) showExit('exit_intent');
    });
    window.setTimeout(function () { showExit('timer'); },
      parseInt(exitModal.getAttribute('data-exit-delay'), 10) || 20000);

    // Backdrop click, the close button, the dismiss link and the CTA all close it.
    exitModal.addEventListener('click', function (e) {
      if (e.target === exitModal || e.target.closest('[data-exit-close]')) hideExit();
    });

    // Escape closes; Tab stays inside the dialog while it's open.
    document.addEventListener('keydown', function (e) {
      if (exitModal.hidden) return;
      if (e.key === 'Escape') { hideExit(); return; }
      if (e.key !== 'Tab') return;
      var focusable = exitModal.querySelectorAll('a[href], button');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // --- CTA click tracking ---
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () { track(el.getAttribute('data-track')); });
  });
})();
