define(['shared-components/utils'], function (utils) {
  'use strict';
  function PayStepReviewViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/pay/pay-step-review/pay-step-review.css');
    this.showStep3       = p.showStep3;
    this.selectedBen     = p.selectedBen;
    this.selectedAccount = p.selectedAccount;
    this.amount          = p.amount;
    this.purpose         = p.purpose;
    this.scheduleEnabled = p.scheduleEnabled;
    this.scheduledDate   = p.scheduledDate;
    this.isLoading       = p.isLoading;
    this.formatAmount    = p.formatAmount;
    this.confirmTransfer = p.confirmTransfer;
  }
  return PayStepReviewViewModel;
});
