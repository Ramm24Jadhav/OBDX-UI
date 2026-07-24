define(['shared-components/utils'], function (utils) {
  'use strict';
  function PayStepAmountViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/pay/pay-step-amount/pay-step-amount.css');
    this.showStep2       = p.showStep2;
    this.selectedBen     = p.selectedBen;
    this.selectedAccount = p.selectedAccount;
    this.amount          = p.amount;
    this.purpose         = p.purpose;
    this.note            = p.note;
    this.quickAmounts    = p.quickAmounts;
    this.scheduleEnabled = p.scheduleEnabled;
    this.scheduledDate   = p.scheduledDate;
    this.step            = p.step;
    this.toggleSchedule  = p.toggleSchedule;
    this.setQuickAmount  = p.setQuickAmount;
    this.goToReview      = p.goToReview;
    this.formatAmount    = p.formatAmount;
  }
  return PayStepAmountViewModel;
});
