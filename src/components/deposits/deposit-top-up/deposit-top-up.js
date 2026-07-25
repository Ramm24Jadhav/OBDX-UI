define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositTopUpViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    this.open         = p.showTopUp;
    this.dep          = p.selected;
    this.submitted    = p.submitted;
    this.submittedMsg = p.submittedMsg;
    this.topUpAmount     = p.topUpAmount;
    this.topUpDeductFrom = p.topUpDeductFrom;
    this.selectedAccount = p.topUpDeductFrom;
    this.accounts        = p.accounts;
    this.fmt             = p.fmt;
    this.onConfirm       = p.confirmTopUp;
    this.onClose = function () { p.showTopUp(false); p.submitted(false); p.topUpAmount(''); };
  }
  return DepositTopUpViewModel;
});
