define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanEligCalcViewModel(context) {
    var self = this;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open        = p.showEligCalc;
    self.income      = p.eligIncome;
    self.obligation  = p.eligObligation;
    self.tenure      = p.eligTenure;
    self.rate        = p.eligRate;
    self.result      = p.eligResult;
    self.onCalculate = p.calcEligibility;
    self.onClose = function () { p.showEligCalc(false); p.eligResult(null); };
  }
  return LoanEligCalcViewModel;
});
