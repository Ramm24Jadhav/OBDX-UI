/**
 * OBDX BaseService — central fetch wrapper
 * All service modules extend this pattern.
 * Set MOCK_MODE = true to serve from src/mocks/*.json.
 * Switch to real OBDX: change BASE_URL, set MOCK_MODE = false.
 */
define([], function () {

  var MOCK_MODE = true;
  var BASE_URL  = '/api/v1';   // real OBDX endpoint base (unused in MOCK_MODE)

  function _headers() {
    var token = sessionStorage.getItem('aman_auth_token') || '';
    return {
      'Content-Type':  'application/json',
      'X-Token-Type':  'JWT',
      'Authorization': token ? 'Bearer ' + token : '',
      'X-Channel-Id':  'MOBILE'
    };
  }

  function _mockFetch(mockPath) {
    return fetch(mockPath).then(function (r) {
      if (!r.ok) throw new Error('Mock not found: ' + mockPath);
      return r.json();
    });
  }

  function _apiFetch(method, path, body) {
    var opts = {
      method:  method,
      headers: _headers()
    };
    if (body) opts.body = JSON.stringify(body);
    return fetch(BASE_URL + path, opts).then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw e; });
      return r.json();
    });
  }

  return {
    MOCK_MODE: MOCK_MODE,

    get: function (apiPath, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('GET', apiPath);
    },

    post: function (apiPath, body, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('POST', apiPath, body);
    },

    put: function (apiPath, body, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('PUT', apiPath, body);
    }
  };
});
