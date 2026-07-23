/**
 * Aman Bank — Component Access Registry
 * Mirrors OBDX componentRegistry — stores the list of components
 * the current user is entitled to, loaded from GET /me/components.
 *
 * Before load() is called (i.e. before bootstrap completes),
 * isAllowed() returns true so the app doesn't block pre-auth navigation.
 */
define([], function () {
  'use strict';

  var _registry = null;   // null = not loaded; object once loaded

  var ComponentRegistry = {

    // ── Called once during bootstrap with the /me/components response ──
    load: function (response) {
      _registry = {};
      var list = (response && response.components) || [];
      list.forEach(function (c) {
        _registry[c.id] = c;
      });
    },

    // ── Returns true if the user has access to the given component id ──
    // Defaults to true when the registry hasn't been loaded yet.
    isAllowed: function (componentId) {
      if (_registry === null) return true;
      return Object.prototype.hasOwnProperty.call(_registry, componentId);
    },

    // ── Returns all components that should appear in the nav menu ─────
    getMenuItems: function () {
      if (_registry === null) return [];
      return Object.keys(_registry)
        .map(function (k) { return _registry[k]; })
        .filter(function (c) { return c.showInMenu; });
    },

    // ── Returns the raw entry for a component id ──────────────────────
    get: function (componentId) {
      return _registry && _registry[componentId];
    },

    // ── Called on logout to clear entitlements ────────────────────────
    reset: function () {
      _registry = null;
    }
  };

  return ComponentRegistry;
});
