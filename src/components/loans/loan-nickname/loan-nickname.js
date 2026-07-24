define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanNicknameViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open         = p.showNickname;
    self.loan         = p.loan;
    self.submitted    = p.submitted;
    self.submittedMsg = p.submittedMsg;
    self.nickname     = p.loanNickname;
    self.onConfirm    = p.saveLoanNickname;
    self.onClose = function () { p.showNickname(false); p.submitted(false); };
  }
  return LoanNicknameViewModel;
});
