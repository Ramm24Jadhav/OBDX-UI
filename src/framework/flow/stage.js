define(['knockout'], function (ko) {
  'use strict';

  // ── Flow Stage Base ───────────────────────────────────────────────
  // Mirrors OBDX framework/js/flow/stage.js.
  // Each stage in a contract flow is a Stage instance.
  // It holds the stage's data model and validation rules,
  // and notifies its contract when it is ready to advance.
  //
  // Usage:
  //   var InitiateStage = Stage.extend({
  //     name: 'initiate',
  //     validate: function() { return this.model.amount() > 0; }
  //   });

  function Stage(contract, options) {
    var opts      = options || {};
    this.name     = opts.name     || '';
    this.contract = contract;
    this.model    = opts.model    || {};    // stage-specific KO observables
    this.isActive = ko.observable(false);
    this.errors   = ko.observableArray([]);
  }

  // ── Activate this stage ───────────────────────────────────────────
  Stage.prototype.activate = function (data) {
    this.errors([]);
    this.isActive(true);
    if (this.onActivate) this.onActivate(data);
  };

  // ── Deactivate (navigating away) ─────────────────────────────────
  Stage.prototype.deactivate = function () {
    this.isActive(false);
    if (this.onDeactivate) this.onDeactivate();
  };

  // ── Validate and advance to next stage ───────────────────────────
  Stage.prototype.submit = function (context) {
    this.errors([]);
    var valid = this.validate ? this.validate() : true;
    if (!valid) return false;
    if (this.beforeNext) this.beforeNext(context);
    this.deactivate();
    this.contract.next(context);
    return true;
  };

  // ── Go back to previous stage ─────────────────────────────────────
  Stage.prototype.back = function () {
    this.deactivate();
    this.contract.back();
  };

  // ── Add a validation error ────────────────────────────────────────
  Stage.prototype.addError = function (msg) {
    this.errors.push(msg);
  };

  Stage.prototype.hasErrors = ko.pureComputed(function () {
    return false; // overridden per-instance after construction
  });

  // ── Subclassing helper ────────────────────────────────────────────
  Stage.extend = function (proto) {
    function Sub(contract, options) {
      Stage.call(this, contract, Object.assign({ name: proto.name }, options));
      this.hasErrors = ko.pureComputed(function () {
        return this.errors().length > 0;
      }, this);
      if (proto.init) proto.init.call(this, contract, options);
    }
    Sub.prototype = Object.create(Stage.prototype);
    Sub.prototype.constructor = Sub;
    ['validate', 'onActivate', 'onDeactivate', 'beforeNext'].forEach(function (m) {
      if (proto[m]) Sub.prototype[m] = proto[m];
    });
    Sub.extend = Stage.extend;
    return Sub;
  };

  return Stage;
});
