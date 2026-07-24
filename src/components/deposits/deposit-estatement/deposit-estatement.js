define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositEStatementViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    this.open           = p.showEStatSub;
    this.dep            = p.dep;
    this.submitted      = p.submitted;
    this.submittedMsg   = p.submittedMsg;
    this.eStatFrequency = p.eStatFrequency;
    this.eStatFormat    = p.eStatFormat;
    this.openPicker     = p.openPicker;
    this.onConfirm      = p.subscribeEStatement;
    this.onClose = function () { p.showEStatSub(false); p.submitted(false); };
  }
  return DepositEStatementViewModel;
});
