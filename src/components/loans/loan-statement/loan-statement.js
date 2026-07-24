define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function LoanStatementViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open            = p.showStatement;
    self.loan            = p.selected;
    self.submitted       = p.submitted;
    self.submittedMsg    = p.submittedMsg;
    self.statementPeriod = p.statementPeriod;
    self.statementFormat = p.statementFormat;
    self.openPicker      = p.openPicker;
    self.onConfirm       = p.requestStatement;
    self.onClose = function () { p.showStatement(false); p.submitted(false); };
  }
  return LoanStatementViewModel;
});
