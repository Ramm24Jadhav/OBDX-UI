define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function PayStepRecipientViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/pay/pay-step-recipient/pay-step-recipient.css');
    this.showStep1          = p.showStep1;
    this.beneficiaries      = p.beneficiaries;
    this.transferTypes      = p.transferTypes;
    this.transferType       = p.transferType;
    this.selectTransferType = p.selectTransferType;
    this.selectBeneficiary  = p.selectBeneficiary;
    this.step               = p.step;
  }
  return PayStepRecipientViewModel;
});
