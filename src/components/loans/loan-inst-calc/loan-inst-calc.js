define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function LoanInstCalcViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open        = p.showInstCalc;
    self.amount      = p.instCalcAmount;
    self.tenure      = p.instCalcTenure;
    self.rate        = p.instCalcRate;
    self.result      = p.instCalcResult;
    self.onCalculate = p.calcInstallment;
    self.onClose = function () { p.showInstCalc(false); p.instCalcResult(null); };
  }
  return LoanInstCalcViewModel;
});
