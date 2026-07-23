/**
 * Aman Bank — Analytics Event Bus
 * Lightweight wrapper around the bank's analytics endpoint.
 *
 * In mock mode: events are logged to console only.
 * In live mode: events are batched and POSTed to /analytics/events.
 *
 * Standard event schema:
 *   { event, userId, sessionId, timestamp, properties }
 *
 * Usage:
 *   analytics.track('page_view',           { page: 'home' });
 *   analytics.track('transaction_initiated', { type: 'NEFT', amount: 5000 });
 */
define(['framework/configurations/config', 'app-data', 'platform'], function (config, AppData, platform) {
  'use strict';

  var _sessionId = _genId();
  var _queue     = [];
  var _flushTimer = null;
  var FLUSH_INTERVAL = 10000;  // 10s batch window
  var MAX_QUEUE = 20;

  function _genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function _userId() {
    var u = AppData.userData;
    return (u && u.customer && u.customer.id) || 'anon';
  }

  function _build(event, properties) {
    return {
      event:     event,
      userId:    _userId(),
      sessionId: _sessionId,
      segment:   AppData.userSegment || 'ANON',
      timestamp: new Date().toISOString(),
      properties: properties || {}
    };
  }

  function _flush() {
    if (!_queue.length) return;
    var batch = _queue.splice(0, _queue.length);

    if (config.development.mockMode) {
      batch.forEach(function (e) {
        console.log('[Analytics]', e.event, e.properties);
      });
      return;
    }

    var token = platform.getToken ? platform.getToken() : '';
    fetch('/digx/v1/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      body: JSON.stringify({ events: batch })
    }).catch(function () {
      // Re-queue on network failure (up to MAX_QUEUE)
      if (_queue.length < MAX_QUEUE) {
        _queue.unshift.apply(_queue, batch);
      }
    });
  }

  var Analytics = {

    // ── Track an event ────────────────────────────────────────────
    track: function (event, properties) {
      _queue.push(_build(event, properties));

      // Flush immediately for high-priority events; batch others
      var immediate = ['session_start', 'session_end', 'transaction_completed', 'error'];
      if (immediate.indexOf(event) !== -1) {
        clearTimeout(_flushTimer);
        _flush();
        return;
      }

      if (!_flushTimer) {
        _flushTimer = setTimeout(function () {
          _flushTimer = null;
          _flush();
        }, FLUSH_INTERVAL);
      }

      // Safety cap — flush early if queue grows large
      if (_queue.length >= MAX_QUEUE) {
        clearTimeout(_flushTimer);
        _flushTimer = null;
        _flush();
      }
    },

    // ── Track a page view (called by appController on route change) ──
    page: function (pageName) {
      Analytics.track('page_view', { page: pageName });
    },

    // ── Reset session (called on logout) ──────────────────────────
    resetSession: function () {
      _flush();
      _sessionId = _genId();
      _queue = [];
      clearTimeout(_flushTimer);
      _flushTimer = null;
    }
  };

  return Analytics;
});
