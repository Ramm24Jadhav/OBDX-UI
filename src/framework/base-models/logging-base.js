/**
 * OBDX Mobile — Logger Base (stub)
 * Mirrors OBDX framework/js/base-models/logging-base.js.
 * Provides the 'baseLogger' alias so ported component code resolves cleanly.
 * Phase 1 will connect this to config.system.loggingLevel.
 */
define(['framework/configurations/config'], function (config) {
  'use strict';

  var level = config.system.loggingLevel || 'LEVEL_ERROR';
  var _silent = (level === 'LEVEL_ERROR');

  return {
    log:   function () { if (!_silent) console.log.apply(console, arguments); },
    info:  function () { if (!_silent) console.info.apply(console, arguments); },
    warn:  function () { console.warn.apply(console, arguments); },
    error: function () { console.error.apply(console, arguments); }
  };
});
