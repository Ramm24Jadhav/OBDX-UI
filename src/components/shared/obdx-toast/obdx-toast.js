/**
 * Aman Toast / Snackbar — Global singleton ViewModel
 *
 * On init this VM registers itself as window.obdxToast so that any
 * component can fire a toast without importing this module directly:
 *
 *   window.obdxApp.showToast('Saved', 'success');           // simple
 *   window.obdxApp.showToast({                              // full API
 *     message:  'Transfer failed.',
 *     type:     'error',           // success|error|warning|info|push
 *     action:   'Retry',
 *     duration: 4000,              // ms; 0 = sticky until dismissed
 *     onAction: function(close) { myFn(); close(); },
 *     onClose:  function() { ... }
 *   });
 *   window.obdxApp.clearToasts();  // dismiss all with cascade animation
 *
 * To customise appearance edit obdx-toast.css only — do not touch
 * appController.js or app.css for toast-related changes.
 */
define(['knockout'], function (ko) {
  'use strict';

  /* ── SVG icons for each type ─────────────────────────────── */
  var ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    push:    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
  };

  function ToastViewModel(Context) {
    var self = this;
    var _items = []; // active toast entries

    /* ── Load component CSS ────────────────────────────────── */
    (function loadCss() {
      var id = 'obdx-toast-css';
      if (document.getElementById(id)) return;
      var link = document.createElement('link');
      link.id   = id;
      link.rel  = 'stylesheet';
      link.href = 'components/shared/obdx-toast/obdx-toast.css';
      document.head.appendChild(link);
    }());

    /* ── Internal helpers ──────────────────────────────────── */
    function _syncUI() {
      var bd       = document.getElementById('obdxToastBackdrop');
      var clearBar = document.getElementById('obdxToastClearAll');
      var clearBtn = document.getElementById('obdxToastClearBtn');
      var count    = _items.length;

      if (bd)       bd.className = count > 0
                      ? 'obdx-toast-backdrop obdx-toast-backdrop--show'
                      : 'obdx-toast-backdrop';
      if (clearBar) clearBar.style.display = count > 1 ? '' : 'none';
      if (clearBtn) clearBtn.onclick = function () { self.clearToasts(); };
    }

    function _remove(entry) {
      if (entry._removing) return;
      entry._removing = true;
      clearTimeout(entry.timer);
      entry.el.className = 'obdx-toast obdx-toast--' + entry.kind + ' obdx-toast--exit';
      setTimeout(function () {
        if (entry.el.parentNode) entry.el.parentNode.removeChild(entry.el);
        _items = _items.filter(function (e) { return e !== entry; });
        _syncUI();
        if (entry.onClose) entry.onClose();
      }, 130);
    }

    /* ── Public API ────────────────────────────────────────── */

    /**
     * show(msgOrOpts, type)
     * Adds a new toast to the stack.
     */
    self.show = function (msgOrOpts, type) {
      var opts = (typeof msgOrOpts === 'object' && msgOrOpts !== null)
        ? msgOrOpts
        : { message: msgOrOpts, type: type };

      var message  = opts.message  || '';
      var kind     = opts.type     || 'info';
      var action   = opts.action   || null;
      var duration = opts.duration !== undefined ? opts.duration : 4000;
      var onAction = opts.onAction || null;
      var onClose  = opts.onClose  || null;

      var container = document.getElementById('obdxToastContainer');
      if (!container) return;

      /* build DOM node */
      var el = document.createElement('div');
      el.className = 'obdx-toast obdx-toast--' + kind;
      el.setAttribute('role', 'status');
      el.innerHTML =
        '<div class="obdx-toast__icon">' + (ICONS[kind] || ICONS.info) + '</div>' +
        '<span class="obdx-toast__msg">' + message + '</span>' +
        (action
          ? '<button class="obdx-toast__action">' + action + '</button>'
          : '') +
        '<button class="obdx-toast__close" aria-label="Dismiss">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="14" height="14">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>';

      /* insert below the clear-all bar */
      var clearBar = document.getElementById('obdxToastClearAll');
      container.insertBefore(el, clearBar ? clearBar.nextSibling : null);

      var entry = { el: el, kind: kind, timer: null, onClose: onClose };
      _items.push(entry);

      /* wire action button */
      var actionBtn = el.querySelector('.obdx-toast__action');
      if (actionBtn) {
        actionBtn.onclick = function () {
          if (onAction) onAction(function () { _remove(entry); });
          else _remove(entry);
        };
      }

      /* wire close button */
      el.querySelector('.obdx-toast__close').onclick = function () {
        _remove(entry);
      };

      /* spring-in animation (next frame so transition fires) */
      requestAnimationFrame(function () {
        el.className = 'obdx-toast obdx-toast--' + kind + ' obdx-toast--show';
      });

      /* auto-dismiss */
      if (duration > 0) {
        entry.timer = setTimeout(function () { _remove(entry); }, duration);
      }

      _syncUI();
    };

    /**
     * clearToasts()
     * Dismiss every visible toast with a 60ms cascade stagger.
     */
    self.clearToasts = function () {
      _items.slice().forEach(function (entry, i) {
        setTimeout(function () { _remove(entry); }, i * 60);
      });
    };

    /* ── Register on window so appController can delegate ──── */
    window.obdxToast = {
      show:        self.show,
      clearToasts: self.clearToasts
    };
  }

  return ToastViewModel;
});
