define(['shared-components/utils'], function (utils) {
  'use strict';
  function PayHubViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/pay/pay-hub/pay-hub.css');
    this.showHub            = p.showHub;
    this.beneficiaries      = p.beneficiaries;
    this.startPayFlow       = p.startPayFlow;
    this.selectBeneficiary  = p.selectBeneficiary;
    this.showQR             = p.showQR;
    this.openQR             = p.openQR;
    this.closeQR            = p.closeQR;
    this.showBeneficiaries  = p.showBeneficiaries;
    this.openBeneficiaries  = p.openBeneficiaries;
    this.closeBeneficiaries = p.closeBeneficiaries;
    this.showScheduled      = p.showScheduled;
    this.openScheduled      = p.openScheduled;
    this.closeScheduled     = p.closeScheduled;
    this.showBills          = p.showBills;
    this.openBills          = p.openBills;
    this.closeBills         = p.closeBills;
    this.showTracker        = p.showTracker;
    this.openTracker        = p.openTracker;
    this.closeTracker       = p.closeTracker;
  }
  return PayHubViewModel;
});
