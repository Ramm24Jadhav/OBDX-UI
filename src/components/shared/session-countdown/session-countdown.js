/**
 * session-countdown ViewModel
 * Uses the CountdownTracker pattern (direct DOM + reflow trick) from the
 * approved artifact — not KO observables — for reliable flip animation.
 *
 * Events:
 *   obdx:session:countdown  { detail: { secondsLeft: N } }  — show popup
 *   obdx:session:reset                                        — hide popup
 */
define(['text!./session-countdown.css'], function (css) {
  'use strict';

  /* ── Inject component CSS once ─────────────────────────────────── */
  (function () {
    if (document.getElementById('sc-style')) return;
    var s = document.createElement('style');
    s.id = 'sc-style';
    s.textContent = css;
    document.head.appendChild(s);
  }());

  /* ── CountdownTracker — per digit-pair tile ─────────────────────
   * Adapted directly from the approved artifact.
   * Creates the card DOM, wires the flip animation via class toggle + reflow.
   */
  function CountdownTracker(label, initialValue) {
    var el = document.createElement('div');
    el.className = 'sc-piece';
    el.innerHTML =
      '<b class="sc-card">' +
        '<b class="sc-card__top"></b>' +
        '<b class="sc-card__bottom"></b>' +
        '<b class="sc-card__back"><b class="sc-card__bottom"></b></b>' +
      '</b>' +
      '<span class="sc-piece__slot">' + label + '</span>';

    this.el           = el;
    this.currentValue = null;

    var top     = el.querySelector('.sc-card__top');
    var bottom  = el.querySelector('.sc-card > .sc-card__bottom');
    var back    = el.querySelector('.sc-card__back');
    var backBot = el.querySelector('.sc-card__back .sc-card__bottom');
    var card    = el.querySelector('.sc-card');

    this.update = function (val) {
      val = ('0' + val).slice(-2);
      if (val === this.currentValue) return;

      if (this.currentValue !== null) {
        /* Stamp OLD value on the back overlay and static bottom */
        back.setAttribute('data-value', this.currentValue);
        bottom.setAttribute('data-value', this.currentValue);
      }

      this.currentValue = val;

      /* Stamp NEW value on top face and back's bottom */
      top.innerText = this.currentValue;
      backBot.setAttribute('data-value', this.currentValue);

      /* Restart flip animation via class remove → reflow → add */
      card.classList.remove('flip');
      void card.offsetWidth;   /* force reflow so animation restarts */
      card.classList.add('flip');
    };

    /* Initialise without animating */
    this.update(initialValue);
    card.classList.remove('flip');
  }

  /* ── ViewModel ──────────────────────────────────────────────────── */
  function SessionCountdownViewModel() {}

  SessionCountdownViewModel.prototype.connected = function (context) {
    var self    = this;
    var root    = context.element;

    self._overlay  = root.querySelector('#sc-overlay');
    self._clockEl  = root.querySelector('#sc-clock');
    self._stayBtn  = root.querySelector('#sc-stay-btn');
    self._trackers = {};
    self._interval = null;
    self._total    = 0;

    /* Build the two flip-clock tiles */
    self._buildClock(0, 0);

    /* Wire "Stay Logged In" */
    self._stayBtn.addEventListener('click', function () {
      self._hide();
      /* Simulate user activity so session-manager resets its inactivity timers */
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    /* Listen for session events */
    self._onCountdown = function (e) {
      var secs = (e.detail && e.detail.secondsLeft) || 120;
      self._show(secs);
    };
    self._onReset = function () { self._hide(); };

    document.addEventListener('obdx:session:countdown', self._onCountdown);
    document.addEventListener('obdx:session:reset',     self._onReset);
  };

  SessionCountdownViewModel.prototype._buildClock = function (mins, secs) {
    var self = this;
    self._clockEl.innerHTML = '';
    self._trackers = {};

    self._trackers.Minutes = new CountdownTracker('Minutes', mins);
    self._clockEl.appendChild(self._trackers.Minutes.el);

    var sep = document.createElement('span');
    sep.className   = 'sc-sep';
    sep.textContent = ':';
    self._clockEl.appendChild(sep);

    self._trackers.Seconds = new CountdownTracker('Seconds', secs);
    self._clockEl.appendChild(self._trackers.Seconds.el);
  };

  SessionCountdownViewModel.prototype._show = function (seconds) {
    var self = this;
    self._total = seconds;

    var m = Math.floor(seconds / 60);
    var s = seconds % 60;

    /* Rebuild tiles at the starting value without animation */
    self._buildClock(m, s);
    self._setUrgent(seconds < 30);

    self._overlay.classList.add('sc-overlay--visible');
    self._startTick();
  };

  SessionCountdownViewModel.prototype._hide = function () {
    this._overlay.classList.remove('sc-overlay--visible');
    this._stopTick();
  };

  SessionCountdownViewModel.prototype._startTick = function () {
    var self = this;
    self._stopTick();
    self._interval = setInterval(function () { self._tick(); }, 1000);
  };

  SessionCountdownViewModel.prototype._stopTick = function () {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
  };

  SessionCountdownViewModel.prototype._tick = function () {
    var self = this;
    if (self._total <= 0) {
      self._stopTick();
      self._overlay.classList.remove('sc-overlay--visible');
      if (window.obdxApp && window.obdxApp.logout) window.obdxApp.logout();
      return;
    }

    self._total--;
    var mins = Math.floor(self._total / 60);
    var secs = self._total % 60;

    self._trackers.Minutes.update(mins);
    self._trackers.Seconds.update(secs);
    self._setUrgent(self._total < 30);
  };

  SessionCountdownViewModel.prototype._setUrgent = function (urgent) {
    var pieces = this._clockEl.querySelectorAll('.sc-piece');
    pieces.forEach(function (p) { p.classList.toggle('urgent', urgent); });
  };

  SessionCountdownViewModel.prototype.disconnectedCallback = function () {
    document.removeEventListener('obdx:session:countdown', this._onCountdown);
    document.removeEventListener('obdx:session:reset',     this._onReset);
    this._stopTick();
  };

  return SessionCountdownViewModel;
});
