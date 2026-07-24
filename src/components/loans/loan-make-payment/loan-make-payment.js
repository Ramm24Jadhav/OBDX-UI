define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanMakePaymentViewModel(context) {
    var self = this;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open                = p.showPayment;
    self.loan                = p.selected;
    self.submitted           = p.submitted;
    self.submittedMsg        = p.submittedMsg;
    self.payAmount           = p.payAmount;
    self.paymentType         = p.paymentType;
    self.deductFrom          = p.deductFrom;
    self.selectedAccount     = p.deductFrom;
    self.payAccounts         = p.payAccounts;
    self.accounts            = p.payAccounts;
    self.settlementBreakdown = p.settlementBreakdown;
    self.fmt                 = p.fmt;
    self.openPicker          = p.openPicker;
    self.onPaymentTypeSelect = p.onPaymentTypeSelect;
    self.onConfirm           = p.makePayment;
    self.onClose = function () {
      p.showPayment(false); p.submitted(false);
      p.paymentType('Regular EMI'); p.settlementBreakdown(null);
    };
  }
  return LoanMakePaymentViewModel;
});
