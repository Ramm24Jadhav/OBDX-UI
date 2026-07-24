/**
 * OBDX Mobile — Extension / Override Registry
 * Mirrors OBDX extensions pattern.
 *
 * Allows segment-specific or bank-specific code to:
 *  1. Register overrides for a user segment (evaluateSegment)
 *  2. Remap which component handles a route at runtime (setComponentMappings)
 *
 * Usage:
 *   // In a segment extension module:
 *   ExtensionRegistry.registerSegment('CORP', { dashboardComponent: 'corp/corp-home' });
 *
 *   // In appController when loading a component:
 *   var override = ExtensionRegistry.getComponentPath('home');   // → 'corp/corp-home' or null
 */
define([], function () {
  'use strict';

  var _segmentExtensions = {};   // segment → extension object
  var _componentMappings = {};   // routeName → overrideComponentPath

  var ExtensionRegistry = {

    // ── Register segment-specific extension object ──────────────
    registerSegment: function (segment, extensions) {
      _segmentExtensions[segment] = Object.assign(
        _segmentExtensions[segment] || {},
        extensions
      );
    },

    // ── Retrieve extensions for the current user's segment ──────
    // Returns {} if no extensions registered for this segment.
    evaluateSegment: function (segment) {
      return _segmentExtensions[segment] || {};
    },

    // ── Override which component path handles a route ────────────
    // mappings: { routeName: 'components/path/to/comp', ... }
    setComponentMappings: function (mappings) {
      Object.assign(_componentMappings, mappings);
    },

    // ── Returns overridden component path, or null if no override ─
    getComponentPath: function (route) {
      return _componentMappings[route] || null;
    },

    // ── Called on logout ──────────────────────────────────────────
    reset: function () {
      _segmentExtensions = {};
      _componentMappings = {};
    }
  };

  return ExtensionRegistry;
});
