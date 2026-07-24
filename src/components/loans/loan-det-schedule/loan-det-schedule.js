define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanDetScheduleViewModel(context) {
    var self = this;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open    = p.showDetSchedule;
    self.loan    = p.loan;
    self.fmt     = p.fmt;
    self.fmtNum  = p.fmtNum;
    self.onClose = function () { p.showDetSchedule(false); };
  }
  return LoanDetScheduleViewModel;
});
