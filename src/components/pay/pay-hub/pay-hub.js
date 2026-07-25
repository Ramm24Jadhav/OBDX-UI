define(['shared-components/utils', 'ojL10n!components/pay/nls/strings'], function (utils, nls) {
  'use strict';
  function PayHubViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
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
    this.showStanding       = p.showStanding;
    this.openStanding       = p.openStanding;
    this.closeStanding      = p.closeStanding;
    this.showBulk           = p.showBulk;
    this.openBulk           = p.openBulk;
    this.closeBulk          = p.closeBulk;
  }
  return PayHubViewModel;
});
