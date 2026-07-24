define(['shared-components/utils'], function (utils) {
  'use strict';
  function PayStepSuccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/pay/pay-step-success/pay-step-success.css');
    this.showStep5       = p.showStep5;
    this.amount          = p.amount;
    this.selectedBen     = p.selectedBen;
    this.referenceNo     = p.referenceNo;
    this.successDateTime = p.successDateTime;
    this.formatAmount    = p.formatAmount;
    this.openTracker     = p.openTracker;
    this.resetFlow       = p.resetFlow;
  }
  return PayStepSuccessViewModel;
});
