define([], function () {
  'use strict';

  // ── Flow Contract Base ────────────────────────────────────────────
  // Mirrors OBDX framework/js/flow/contract.js.
  // A contract defines the stage sequence, title, and navigation rules
  // for a multi-step transaction flow (e.g. Fund Transfer, Bill Pay).
  //
  // Usage:
  //   var MyContract = Contract.extend({
  //     title: 'Fund Transfer',
  //     stages: ['initiate', 'review', 'confirm', 'success'],
  //     startStage: 'initiate'
  //   });

  function Contract(options) {
    var opts = options || {};
    this.title       = opts.title      || '';
    this.stages      = opts.stages     || [];
    this.startStage  = opts.startStage || (this.stages[0] || '');
    this._callbacks  = {};             // stage lifecycle hooks
  }

  // ── Navigate to a stage by name ──────────────────────────────────
  Contract.prototype.goTo = function (stageName, context) {
    var idx = this.stages.indexOf(stageName);
    if (idx === -1) throw new Error('[Contract] Unknown stage: ' + stageName);
    this._currentStage = stageName;
    this._currentIndex = idx;
    this._fire('change', stageName, context);
  };

  // ── Navigate forward one step ─────────────────────────────────────
  Contract.prototype.next = function (context) {
    var nextIdx = (this._currentIndex || 0) + 1;
    if (nextIdx >= this.stages.length) return;
    this.goTo(this.stages[nextIdx], context);
  };

  // ── Navigate backward one step ────────────────────────────────────
  Contract.prototype.back = function (context) {
    var prevIdx = (this._currentIndex || 0) - 1;
    if (prevIdx < 0) return this._fire('exit', this.startStage, context);
    this.goTo(this.stages[prevIdx], context);
  };

  // ── Check if currently on a given stage ──────────────────────────
  Contract.prototype.isOn = function (stageName) {
    return this._currentStage === stageName;
  };

  Contract.prototype.currentStage = function () {
    return this._currentStage || this.startStage;
  };

  // Stage index (0-based), useful for progress indicator
  Contract.prototype.currentIndex = function () {
    return this._currentIndex || 0;
  };

  // ── Event hooks: 'change', 'exit' ────────────────────────────────
  Contract.prototype.on = function (event, fn) {
    this._callbacks[event] = this._callbacks[event] || [];
    this._callbacks[event].push(fn);
    return this;
  };

  Contract.prototype._fire = function (event, stageName, context) {
    var cbs = this._callbacks[event] || [];
    cbs.forEach(function (fn) { fn(stageName, context); });
  };

  // ── Reset back to start ───────────────────────────────────────────
  Contract.prototype.reset = function () {
    this._currentStage = this.startStage;
    this._currentIndex = 0;
    this._callbacks    = {};
  };

  // ── Subclassing helper ────────────────────────────────────────────
  Contract.extend = function (proto) {
    function Sub(options) {
      Contract.call(this, Object.assign({
        title:      proto.title,
        stages:     proto.stages,
        startStage: proto.startStage
      }, options));
      if (proto.init) proto.init.call(this, options);
    }
    Sub.prototype = Object.create(Contract.prototype);
    Sub.prototype.constructor = Sub;
    Object.keys(proto).forEach(function (k) {
      if (['title', 'stages', 'startStage', 'init'].indexOf(k) === -1) {
        Sub.prototype[k] = proto[k];
      }
    });
    Sub.extend = Contract.extend;
    return Sub;
  };

  return Contract;
});
