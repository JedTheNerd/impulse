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
          status.textContent = 'Something went wrong sending your details. Please try again.';
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
    muteBtn.textContent = '🔇 TAP TO UNMUTE';
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
  // data-calendar-src: scheduler embed URL (Calendly, Cal.com, etc.). Set that
  // tool's "redirect after booking" option to impulse-page4-thank-you.html.
  var calendar = document.querySelector('[data-calendar-src]');
  if (calendar && calendar.getAttribute('data-calendar-src')) {
    var iframe = document.createElement('iframe');
    iframe.src = calendar.getAttribute('data-calendar-src');
    iframe.title = 'Pick a time for your positioning review';
    iframe.loading = 'lazy';
    calendar.innerHTML = '';
    calendar.appendChild(iframe);
  }

  // --- CTA click tracking ---
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () { track(el.getAttribute('data-track')); });
  });
})();
