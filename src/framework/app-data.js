/**
 * Aman Bank — Shared Application State Singleton
 * Mirrors OBDX framework/js/app-data.js.
 *
 * This module is the single source of truth for cross-component state.
 * All components require it via the 'app-data' alias rather than reading
 * from window.amanApp — keeping state structured and testable.
 *
 * Key values populated during bootstrap (Phase 1):
 *   userSegment   — set by computeSegment() after GET /me
 *   currentEntity — set to config.system.defaultEntity, switchable by corporate users
 *   userData      — raw /me response
 *   bankConfig    — raw /bankConfiguration response
 */
define(['knockout'], function (ko) {
  'use strict';

  // ── URL query-param utility ──────────────────────────────────
  var QueryParams = {
    _map: {},

    add: function (key, value) {
      this._map[key] = value;
    },
    get: function (key) {
      if (key) return this._map[key];
      return Object.assign({}, this._map);
    },
    remove: function (key) {
      delete this._map[key];
    }
  };

  // ── AppData singleton ────────────────────────────────────────
  var AppData = {

    // ── Raw server responses (set during bootstrap) ──────────────
    userData:          {},    // Response from GET /me
    appData:           {},    // Generic app-level key/value store
    allowedComponents: {},    // Keyed component map from GET /me/components (Phase 3)

    // ── User context (set by computeSegment after login) ─────────
    userSegment:  null,   // 'RETAIL' | 'CORP' | 'CORPADMIN' | 'ADMIN' | 'ANON'
    currentEntity: null,  // Banking entity code sent as X-Target-Unit header
    jsonContext:   null,  // 'retail' | 'corporate' | 'admin' | 'index'

    // ── KO observables ────────────────────────────────────────────
    bankConfig:     ko.observable(null),   // /bankConfiguration response
    currentRole:    ko.observable(null),
    currentView:    ko.observable(null),
    isUserDataSet:  ko.observable(false),
    lastUpdatedTime: ko.observable(null),

    // ── Right panel (slide-in panel shared by all components) ─────
    rightPanelData: {
      isOpen:        ko.observable(false),
      componentName: ko.observable(''),
      data:          ko.observable(null),
      header:        ko.observable(''),
      closeHandler:  ko.observable(null),
      hideCloseIcon: ko.observable(false)
    },

    // ── Session ───────────────────────────────────────────────────
    sessionExpireWarnTime: 60000,   // ms before expiry to show warning

    // ── Locale ────────────────────────────────────────────────────
    getLocale: function () {
      return localStorage.getItem('user-locale') ||
             (navigator.language ? navigator.language.replace(/_/g, '-') : 'en');
    },

    // ── Segment → context mapping ─────────────────────────────────
    // Drives which dashboard JSON, menu structure, and component paths load.
    computeContext: function (segment) {
      var map = {
        'RETAIL':    'retail',
        'CORP':      'corporate',
        'CORPADMIN': 'corporate',
        'ADMIN':     'admin'
      };
      return map[segment] || 'index';
    },

    // ── Segment computation from /me roles ────────────────────────
    // Called after login with the roles array from the /me response.
    // Returns one of: 'RETAIL' | 'CORP' | 'CORPADMIN' | 'ADMIN' | 'ANON'
    // Phase 1 will wire this into the bootstrap sequence.
    computeSegment: function (userProfile) {
      if (!userProfile || !userProfile.roles || !userProfile.roles.length) return 'ANON';
      var roles = userProfile.roles.map(function (r) { return (r.roleName || r).toLowerCase(); });
      if (userProfile.corpAdmin) return 'CORPADMIN';
      if (roles.indexOf('retailuser')     !== -1) return 'RETAIL';
      if (roles.indexOf('corporateuser')  !== -1) return 'CORP';
      if (roles.indexOf('administrator')  !== -1) return 'ADMIN';
      return 'ANON';
    },

    // ── Deep property accessor ────────────────────────────────────
    // getObjectProperty(obj, 'a.b.c') → obj.a.b.c
    getObjectProperty: function (object, stringKey) {
      return (stringKey || '').split('.').reduce(function (obj, key) {
        return obj && obj[key] !== undefined ? obj[key] : undefined;
      }, object);
    },

    QueryParams: QueryParams
  };

  return AppData;
});
