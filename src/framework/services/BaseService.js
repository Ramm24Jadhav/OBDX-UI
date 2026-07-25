define([
  'framework/configurations/config',
  'app-data',
  'platform',
  'framework/interrupt-handler'
], function (config, AppData, platform, InterruptHandler) {
  'use strict';

  var MOCK_MODE    = config.development.mockMode;
  var API_BASE     = config.sharding.apiBaseURL || '';
  var THROTTLE_MS  = (config.system.requestThrottleSeconds || 5) * 1000;

  // ── GET deduplication cache ───────────────────────────────────────
  // Prevents identical GET calls made within THROTTLE_MS from hitting the server twice.
  var _getCache = {};

  // ── CSRF nonce generator ──────────────────────────────────────────
  function _nonce() {
    var arr = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return Array.prototype.map.call(arr, function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  // ── Standard OBDX request headers ────────────────────────────────
  function _headers(extra) {
    var entity = AppData.currentEntity || config.system.defaultEntity;
    var h = {
      'Content-Type':  'application/json',
      'X-Token-Type':  'JWT',
      'X-Target-Unit': entity,
      'X-Channel-Id':  'MOBILE',
      'x-nonce':       _nonce()
    };
    platform.addAuthHeaders(h);
    return Object.assign(h, extra || {});
  }

  // ── URL builder ───────────────────────────────────────────────────
  function _url(resourcePath) {
    return API_BASE + resourcePath;
  }

  // ── HTTP status handler ───────────────────────────────────────────
  function _handleStatus(r) {
    if (r.status === 401) {
      document.dispatchEvent(new CustomEvent('obdx:auth:expired'));
      throw { status: 401, message: 'Unauthorized — session may have expired' };
    }
    if (r.status === 419) {
      document.dispatchEvent(new CustomEvent('obdx:session:expired'));
      throw { status: 419, message: 'Session expired' };
    }
    if (r.status === 420) {
      document.dispatchEvent(new CustomEvent('obdx:session:suspended'));
      throw { status: 420, message: 'Account suspended' };
    }
    if (r.status === 417) {
      return r.json().then(function (body) {
        return InterruptHandler.checkInterrupt(body);
      });
    }
    if (!r.ok) {
      return r.json()
        .then(function (e) { throw e; })
        .catch(function (e) {
          if (e && typeof e === 'object' && e.message) throw e;
          throw new Error('HTTP ' + r.status + ': ' + r.statusText);
        });
    }
    if (r.status === 204) return Promise.resolve(null);
    return r.json().then(function (data) {
      // Stash ETag for subsequent If-Match on PUT/PATCH
      var etag = r.headers.get('ETag');
      if (etag && data && typeof data === 'object') data.__etag = etag;
      return data;
    });
  }

  // ── Live API call ─────────────────────────────────────────────────
  function _apiFetch(method, resourcePath, body, extraHeaders) {
    var h = _headers(extraHeaders);
    // Optimistic concurrency: forward ETag stored on the payload object
    if (body && body.__etag) {
      h['If-Match'] = body.__etag;
    }
    var opts = { method: method, headers: h };
    if (body !== undefined && body !== null) {
      opts.body = JSON.stringify(body);
    }
    return fetch(_url(resourcePath), opts).then(_handleStatus);
  }

  // ── GET with deduplication ────────────────────────────────────────
  function _deduplicatedGet(resourcePath) {
    var key = resourcePath;
    var now = Date.now();
    var cached = _getCache[key];
    if (cached && cached.expiry > now) return cached.promise;

    var promise = _apiFetch('GET', resourcePath, null, null);
    _getCache[key] = { promise: promise, expiry: now + THROTTLE_MS };
    promise.then(
      function () { delete _getCache[key]; },
      function () { delete _getCache[key]; }
    );
    return promise;
  }

  // ── Mock resolver ─────────────────────────────────────────────────
  function _mockFetch(mockPath) {
    return fetch(mockPath).then(function (r) {
      if (!r.ok) throw new Error('Mock not found: ' + mockPath);
      return r.json();
    });
  }

  // ── Session event handlers ────────────────────────────────────────
  document.addEventListener('obdx:auth:expired', function () {
    platform.logout();
    if (window.obdxApp) window.obdxApp.navigate('login');
  });
  document.addEventListener('obdx:session:expired', function () {
    platform.logout();
    if (window.obdxApp) window.obdxApp.navigate('login');
  });
  document.addEventListener('obdx:session:suspended', function () {
    platform.logout();
    if (window.obdxApp) {
      window.obdxApp.showToast('Your account has been suspended. Please contact support.', 'error');
      window.obdxApp.navigate('login');
    }
  });

  // ── Public API ────────────────────────────────────────────────────
  var BaseService = {
    MOCK_MODE: MOCK_MODE,

    // GET — read a resource (deduplicated within THROTTLE_MS)
    fetch: function (apiPath, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _deduplicatedGet(apiPath);
    },

    // POST — create a resource
    add: function (apiPath, body, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('POST', apiPath, body);
    },

    // PUT — full update (sends If-Match if body.__etag is set)
    update: function (apiPath, body, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('PUT', apiPath, body);
    },

    // PATCH — partial update
    patch: function (apiPath, body, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('PATCH', apiPath, body);
    },

    // DELETE — remove a resource
    remove: function (apiPath, mockPath) {
      if (MOCK_MODE) return _mockFetch(mockPath);
      return _apiFetch('DELETE', apiPath);
    },

    // Flush the GET deduplication cache (useful after mutations)
    invalidateCache: function (apiPath) {
      if (apiPath) delete _getCache[apiPath];
      else _getCache = {};
    }
  };

  return BaseService;
});
