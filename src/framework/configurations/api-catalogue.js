define(['framework/configurations/config'], function (config) {
  'use strict';

  var _base = config.sharding.apiBaseURL || '';

  // Each entry: { domain, app, version, path }
  // Full URL = apiBaseURL/domain/app/version/path
  var _catalogue = {
    // ── DDA / Accounts ────────────────────────────────────────────
    'accounts':           { domain: 'digx-dda',      app: 'dda',      version: 'v1', path: 'accounts' },
    'accountDetail':      { domain: 'digx-dda',      app: 'dda',      version: 'v1', path: 'accounts/{accountId}' },
    'accountTransactions':{ domain: 'digx-dda',      app: 'dda',      version: 'v1', path: 'accounts/{accountId}/transactions' },
    'deposits':           { domain: 'digx-td',       app: 'td',       version: 'v1', path: 'deposits' },
    'loans':              { domain: 'digx-loan',     app: 'loan',     version: 'v1', path: 'loans' },

    // ── Payments ──────────────────────────────────────────────────
    'beneficiaries':      { domain: 'digx-payments', app: 'payments', version: 'v1', path: 'beneficiaries' },
    'transfers':          { domain: 'digx-payments', app: 'payments', version: 'v1', path: 'payments/transfers' },
    'scheduledPayments':  { domain: 'digx-payments', app: 'payments', version: 'v1', path: 'payments/scheduled' },
    'standingInstructions':{ domain: 'digx-payments', app: 'payments', version: 'v1', path: 'payments/standing-instructions' },

    // ── Cards ─────────────────────────────────────────────────────
    'cards':              { domain: 'digx-cards',    app: 'cards',    version: 'v1', path: 'cards' },
    'cardBlock':          { domain: 'digx-cards',    app: 'cards',    version: 'v1', path: 'cards/{cardId}/block' },
    'cardLimits':         { domain: 'digx-cards',    app: 'cards',    version: 'v1', path: 'cards/{cardId}/limits' },
    'cardPinChange':      { domain: 'digx-cards',    app: 'cards',    version: 'v1', path: 'cards/{cardId}/pin/change' },

    // ── User / Party ──────────────────────────────────────────────
    'userProfile':        { domain: 'digx-user',     app: 'user',     version: 'v1', path: 'me' },
    'notifications':      { domain: 'digx-user',     app: 'user',     version: 'v1', path: 'notifications' },
    'bankConfiguration':  { domain: 'digx-config',   app: 'config',   version: 'v1', path: 'configurations' },

    // ── Auth ──────────────────────────────────────────────────────
    'authToken':          { domain: 'digx-auth',     app: 'auth',     version: 'v1', path: 'session/token' },
    'refreshToken':       { domain: 'digx-auth',     app: 'auth',     version: 'v1', path: 'session/token/refresh' },

    // ── OTP ───────────────────────────────────────────────────────
    'otpGenerate':        { domain: 'digx-otp',      app: 'otp',      version: 'v1', path: 'otp/generate' },
    'otpValidate':        { domain: 'digx-otp',      app: 'otp',      version: 'v1', path: 'otp/validate' }
  };

  function _interpolate(path, params) {
    return (path || '').replace(/\{(\w+)\}/g, function (_, key) {
      var val = params && params[key];
      if (val === undefined) throw new Error('[ApiCatalogue] Missing param: ' + key);
      return encodeURIComponent(val);
    });
  }

  return {
    // Full resolved URL including apiBaseURL
    resolve: function (name, params) {
      var e = _catalogue[name];
      if (!e) throw new Error('[ApiCatalogue] Unknown API entry: ' + name);
      var path = _interpolate(e.path, params);
      return _base + '/' + e.domain + '/' + e.app + '/' + e.version + '/' + path;
    },

    // Resource path only (apiBaseURL prefix is added by BaseService)
    getPath: function (name, params) {
      var e = _catalogue[name];
      if (!e) throw new Error('[ApiCatalogue] Unknown API entry: ' + name);
      return '/' + e.domain + '/' + e.app + '/' + e.version + '/' + _interpolate(e.path, params);
    },

    has: function (name) {
      return !!_catalogue[name];
    }
  };
});
