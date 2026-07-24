define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanEStatementViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open         = p.showEStatSub;
    self.loan         = p.loan;
    self.submitted    = p.submitted;
    self.submittedMsg = p.submittedMsg;
    self.frequency    = p.eStatFrequency;
    self.format       = p.eStatFormat;
    self.openPicker   = p.openPicker;
    self.onConfirm    = p.subscribeEStatement;
    self.onClose = function () { p.showEStatSub(false); p.submitted(false); };
  }
  return LoanEStatementViewModel;
});
