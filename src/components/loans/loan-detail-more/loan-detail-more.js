define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanDetailMoreViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    self.open    = p.showMore;
    self.loan    = p.loan;
    self.onClose       = function () { p.showMore(false); };
    self.onDisbInquiry = function () { p.showMore(false); p.showDisbInquiry(true); };
    self.onSchedule    = function () { p.showMore(false); p.showDetSchedule(true); };
    self.onEStatSub    = function () { p.showMore(false); p.showEStatSub(true); p.submitted(false); };
    self.onInstCalc    = function () { p.showMore(false); p.showInstCalc(true); p.instCalcResult(null); };
    self.onEligCalc    = function () { p.showMore(false); p.showEligCalc(true); p.eligResult(null); };
    self.onNickname    = function () { p.showMore(false); p.showNickname(true); p.submitted(false); };
  }
  return LoanDetailMoreViewModel;
});
