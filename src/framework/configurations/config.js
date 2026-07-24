/**
 * OBDX Mobile — Application Configuration Singleton
 * Mirrors the OBDX framework/js/configurations/config.js pattern.
 * Deep-frozen at module load time — no runtime mutation.
 * Phase 1 will merge api-catalogue into this object.
 */
define([], function () {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      var val = obj[name];
      if (val && typeof val === 'object') deepFreeze(val);
    });
    return Object.freeze(obj);
  }

  var configurations = {

    // ── Authentication ───────────────────────────────────────────
    // type: 'JWTAuthenticator' | 'OAMAuthenticator' | 'OBDXAuthenticator' | 'SAML-JWTAuthenticator'
    // Selects the implementation loaded by platform.js in Phase 1.
    authentication: {
      type:        'JWTAuthenticator',
      providerURL: '',
      pages: {
        securePage: 'home',
        publicPage: 'login'
      }
    },

    // ── System ───────────────────────────────────────────────────
    system: {
      componentAccessControlEnabled: false,  // Phase 3: enable after /me/components wired
      requestThrottleSeconds:        5,       // GET dedup window in BaseService
      defaultEntity:                 'AMAN_BU',
      sslEnabled:                    false,
      loggingLevel:                  'LEVEL_ERROR'
    },

    // ── i18n ─────────────────────────────────────────────────────
    i18n: {
      rtlLocales: ['ar', 'he', 'ku', 'fa', 'ur', 'dv', 'ha', 'ps', 'yi']
    },

    // ── Domain-based URL routing ──────────────────────────────────
    // When true, BaseService constructs: {apiBaseURL}/{domain}/{application}/{version}/{path}
    // Phase 1 will activate this with the real API base URL.
    domainDeployment: {
      enabled: true
    },

    // ── URL / resource paths ─────────────────────────────────────
    sharding: {
      apiBaseURL:          '',              // Set to OBDX middleware host in Phase 1
      imageResourcePath:   './images',
      webHelpContentURL:   ''
    },

    // ── Service worker ────────────────────────────────────────────
    serviceWorker: {
      enabled: true,
      path:    '/sw.js'
    },

    // ── Analytics ─────────────────────────────────────────────────
    analytics: {
      enabled:          true,
      eventsThreshold:  5,
      inactivityTimeout: 600000,
      obdxAnalytics: { enabled: false, eventsThreshold: 5, inactivityTimeout: 600000 }
    },

    // ── Third-party integrations ──────────────────────────────────
    thirdPartyAPIs: {
      oda: { uri: '', channelId: '', userId: '', secret: '' }  // Oracle Digital Assistant
    },

    // ── Oracle Digital Assistant ──────────────────────────────────
    // sdkUrl:    full URL to oda-web-sdk.js on the ODA tenant
    // channelId: Web channel ID from ODA console
    // uri:       ODA instance URI  e.g. 'https://oda-xxx.data.digitalassistant.oci.oraclecloud.com'
    oda: {
      sdkUrl:    '',
      channelId: '',
      uri:       ''
    },

    // ── Development ───────────────────────────────────────────────
    development: {
      enabled: true,
      mockMode: true    // BaseService reads this; Phase 1 sets to false for live APIs
    }
  };

  return deepFreeze(configurations);
});
