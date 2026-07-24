define([
  'framework/configurations/config',
  'base-models/logging-base'
], function (config, logger) {
  'use strict';

  var _TOKEN_KEY        = 'obdx_auth_token';
  var _REFRESH_KEY      = 'obdx_refresh_token';
  var _TOKEN_EXPIRY_KEY = 'obdx_token_expiry';
  var _authType         = config.authentication.type;

  // ── Auth URL helper (bypasses api-catalogue to avoid circular dep) ──
  function _authUrl(path) {
    return (config.sharding.apiBaseURL || '') + '/digx-auth/auth/v1/' + path;
  }

  function _baseHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Channel-Id': 'MOBILE',
      'X-Target-Unit': config.system.defaultEntity,
      'X-Token-Type': 'JWT'
    };
  }

  var JWTAuthenticator = {
    authType: _authType,

    // ── Token accessors ──────────────────────────────────────────
    getToken: function () {
      return sessionStorage.getItem(_TOKEN_KEY);
    },

    isTokenExpired: function () {
      var expiry = parseInt(sessionStorage.getItem(_TOKEN_EXPIRY_KEY) || '0', 10);
      return expiry > 0 && Date.now() > expiry;
    },

    // ── Login ────────────────────────────────────────────────────
    // credentials: { type:'MPIN'|'PASSWORD'|'BIOMETRIC', userId, mpin, password }
    login: function (credentials) {
      if (config.development.mockMode) {
        var payload = JSON.stringify({
          sub: (credentials && credentials.userId) || 'CUST-0047829',
          exp: Math.floor(Date.now() / 1000) + 3600,
          segment: 'RETAIL'
        });
        var mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(payload) + '.mock_sig';
        sessionStorage.setItem(_TOKEN_KEY, mockToken);
        sessionStorage.setItem(_TOKEN_EXPIRY_KEY, String(Date.now() + 3600000));
        logger.info('[Platform] Mock login OK');
        return Promise.resolve({ status: 'SUCCESS', token: mockToken });
      }

      return fetch(_authUrl('session/token'), {
        method: 'POST',
        headers: _baseHeaders(),
        body: JSON.stringify(credentials)
      }).then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw e; });
        return r.json();
      }).then(function (data) {
        if (data.token) {
          sessionStorage.setItem(_TOKEN_KEY, data.token);
          if (data.refreshToken) sessionStorage.setItem(_REFRESH_KEY, data.refreshToken);
          var expiry = data.expiresIn
            ? Date.now() + data.expiresIn * 1000
            : Date.now() + 3600000;
          sessionStorage.setItem(_TOKEN_EXPIRY_KEY, String(expiry));
        }
        return data;
      });
    },

    // ── Token refresh ────────────────────────────────────────────
    refresh: function () {
      var refreshToken = sessionStorage.getItem(_REFRESH_KEY);
      if (!refreshToken) return Promise.reject(new Error('No refresh token'));

      return fetch(_authUrl('session/token/refresh'), {
        method: 'POST',
        headers: Object.assign({}, _baseHeaders(), {
          'Authorization': 'Bearer ' + refreshToken
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('Token refresh failed: ' + r.status);
        return r.json();
      }).then(function (data) {
        if (data.token) {
          sessionStorage.setItem(_TOKEN_KEY, data.token);
          var expiry = data.expiresIn
            ? Date.now() + data.expiresIn * 1000
            : Date.now() + 3600000;
          sessionStorage.setItem(_TOKEN_EXPIRY_KEY, String(expiry));
        }
        return data;
      });
    },

    // ── Logout ───────────────────────────────────────────────────
    logout: function () {
      var token = sessionStorage.getItem(_TOKEN_KEY);
      sessionStorage.removeItem(_TOKEN_KEY);
      sessionStorage.removeItem(_REFRESH_KEY);
      sessionStorage.removeItem(_TOKEN_EXPIRY_KEY);

      if (config.development.mockMode || !token) return Promise.resolve();

      // Best-effort — don't block UI on failure
      return fetch(_authUrl('session/token'), {
        method: 'DELETE',
        headers: Object.assign({}, _baseHeaders(), { 'Authorization': 'Bearer ' + token })
      }).catch(function () { /* silent */ });
    },

    // ── Called by BaseService before every request ────────────────
    addAuthHeaders: function (headers) {
      var token = sessionStorage.getItem(_TOKEN_KEY);
      if (token) headers['Authorization'] = 'Bearer ' + token;
      return headers;
    }
  };

  return JWTAuthenticator;
});
