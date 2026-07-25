define(['knockout'], function (ko) {
  'use strict';

  function PayFlowHeaderViewModel(params) {
    var self = this;
    self.title       = ko.isObservable(params.title)       ? params.title       : ko.observable(params.title || '');
    self.currentStep = ko.isObservable(params.currentStep) ? params.currentStep : ko.observable(params.currentStep || 1);
    self.stepItems   = ko.isObservable(params.steps)       ? params.steps       : ko.observableArray(params.steps || []);
    self.onBack      = params.onBack || function () {};

    var hideOn = params.hideBackOn || [];

    self.showBack = ko.computed(function () {
      return hideOn.indexOf(self.currentStep()) === -1;
    });

    self.dotClass = function (n) {
      var s = self.currentStep();
      if (s > n)  return 'pay-step--done';
      if (s === n) return 'pay-step--active';
      return 'pay-step--pending';
    };
  }

  return PayFlowHeaderViewModel;
});
