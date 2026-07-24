define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositEditMaturityViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    this.open                = p.showEditMaturity;
    this.dep                 = p.selected;
    this.submitted           = p.submitted;
    this.submittedMsg        = p.submittedMsg;
    this.maturityInstruction = p.maturityInstruction;
    this.renewTenure         = p.renewTenure;
    this.openPicker          = p.openPicker;
    this.onConfirm           = p.confirmMaturity;
    this.onClose = function () { p.showEditMaturity(false); p.submitted(false); };
  }
  return DepositEditMaturityViewModel;
});
