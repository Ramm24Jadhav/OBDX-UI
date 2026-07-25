define(['shared-components/utils', 'ojL10n!components/pay/nls/strings'], function (utils, nls) {
  'use strict';
  function PayStepRecipientViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/pay/pay-step-recipient/pay-step-recipient.css');
    this.showStep1          = p.showStep1;
    this.beneficiaries      = p.beneficiaries;
    this.accounts           = p.accounts;
    this.transferTypes      = p.transferTypes;
    this.transferType       = p.transferType;
    this.flowType           = p.flowType;
    this.selectedBen        = p.selectedBen;
    this.selectTransferType = p.selectTransferType;
    this.selectBeneficiary  = p.selectBeneficiary;
    this.selectOwnAccount   = p.selectOwnAccount;
    this.goToAmount         = p.goToAmount;
    this.adhocMode          = p.adhocMode;
    this.adhocName          = p.adhocName;
    this.adhocBank          = p.adhocBank;
    this.adhocAccountNo     = p.adhocAccountNo;
    this.toggleAdhoc        = p.toggleAdhoc;
    this.proceedAdhoc       = p.proceedAdhoc;
    this.step               = p.step;
    this.selectedToAccount  = p.selectedToAccount;
  }
  return PayStepRecipientViewModel;
});
