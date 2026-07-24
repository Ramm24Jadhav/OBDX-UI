define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function PayStepSuccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
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
