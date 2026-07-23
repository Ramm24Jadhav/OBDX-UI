/**
 * Aman Bank — Session Manager
 * Handles:
 *   - Inactivity timeout with warning before expiry
 *   - Heartbeat keep-alive on user activity
 *   - HTTP 419 (session expired) → expiry modal
 *   - HTTP 420 (session suspended) → suspended modal
 *   - Session extend via POST /session/extend
 */
define(['platform', 'framework/configurations/config'], function (platform, config) {
  'use strict';

  var INACTIVITY_MS   = 10 * 60 * 1000;  // 10 min before hard logout
  var WARN_BEFORE_MS  =  2 * 60 * 1000;  // warn 2 min before expiry
  var HEARTBEAT_MS    =  4 * 60 * 1000;  // extend session every 4 min of activity

  var _inactivityTimer = null;
  var _warnTimer       = null;
  var _heartbeatTimer  = null;
  var _active          = false;
  var _dirty           = false;   // activity since last heartbeat?

  // ── Activity events to track ────────────────────────────────────
  var ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];

  var SessionManager = {

    // ── Start tracking — called after successful login ────────────
    start: function () {
      if (_active) return;
      _active = true;

      ACTIVITY_EVENTS.forEach(function (evt) {
        document.addEventListener(evt, SessionManager._onActivity, { passive: true });
      });

      SessionManager._resetInactivity();
      SessionManager._startHeartbeat();
    },

    // ── Stop tracking — called on logout / session end ───────────
    stop: function () {
      _active = false;
      ACTIVITY_EVENTS.forEach(function (evt) {
        document.removeEventListener(evt, SessionManager._onActivity);
      });
      clearTimeout(_inactivityTimer);
      clearTimeout(_warnTimer);
      clearInterval(_heartbeatTimer);
    },

    // ── Activity handler — resets the inactivity clock ───────────
    _onActivity: function () {
      _dirty = true;
      SessionManager._resetInactivity();
    },

    // ── Reset the inactivity timeout ─────────────────────────────
    _resetInactivity: function () {
      clearTimeout(_inactivityTimer);
      clearTimeout(_warnTimer);

      _warnTimer = setTimeout(function () {
        SessionManager._showWarning();
      }, INACTIVITY_MS - WARN_BEFORE_MS);

      _inactivityTimer = setTimeout(function () {
        SessionManager._onInactivityExpiry();
      }, INACTIVITY_MS);
    },

    // ── Show warning banner 2 min before expiry ───────────────────
    _showWarning: function () {
      if (window.amanApp && window.amanApp.showToast) {
        window.amanApp.showToast('Your session will expire in 2 minutes due to inactivity.', 'warning');
      }
    },

    // ── Inactivity hard-logout ────────────────────────────────────
    _onInactivityExpiry: function () {
      SessionManager.stop();
      SessionManager._dispatchExpiry('INACTIVITY');
    },

    // ── HTTP 419 handler (session expired server-side) ────────────
    _onServerExpiry: function () {
      SessionManager.stop();
      SessionManager._dispatchExpiry('SERVER');
    },

    // ── HTTP 420 handler (account suspended) ──────────────────────
    _onSuspended: function () {
      SessionManager.stop();
      document.dispatchEvent(new CustomEvent('aman:show:suspended'));
    },

    // ── Dispatch expiry event — appController shows the modal ─────
    _dispatchExpiry: function (reason) {
      document.dispatchEvent(new CustomEvent('aman:show:expired', {
        detail: { reason: reason }
      }));
    },

    // ── Heartbeat — extends session while user is active ─────────
    _startHeartbeat: function () {
      clearInterval(_heartbeatTimer);
      _heartbeatTimer = setInterval(function () {
        if (!_dirty) return;
        _dirty = false;
        if (!config.development.mockMode) {
          // POST /session/extend — fire-and-forget
          platform.getToken && fetch('/digx/v1/session/extend', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + platform.getToken() }
          }).catch(function () {});
        }
      }, HEARTBEAT_MS);
    }
  };

  // ── Wire BaseService session events ─────────────────────────────
  document.addEventListener('aman:session:expired',   SessionManager._onServerExpiry.bind(SessionManager));
  document.addEventListener('aman:session:suspended', SessionManager._onSuspended.bind(SessionManager));

  return SessionManager;
});
