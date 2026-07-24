define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositRedeemViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    this.open         = p.showRedeem;
    this.dep          = p.selected;
    this.submitted    = p.submitted;
    this.submittedMsg = p.submittedMsg;
    this.redeemReason        = p.redeemReason;
    this.redeemCreditAccount = p.redeemCreditAccount;
    this.selectedAccount     = p.redeemCreditAccount;
    this.accounts            = p.accounts;
    this.fmt                 = p.fmt;
    this.openPicker          = p.openPicker;
    this.pickOption          = p.pickOption;
    this.dismissPicker       = p.dismissPicker;
    this.picker              = p.picker;
    this.onConfirm           = p.confirmRedeem;
    this.onClose = function () { p.showRedeem(false); p.submitted(false); };
  }
  return DepositRedeemViewModel;
});
