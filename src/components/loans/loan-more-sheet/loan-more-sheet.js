define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanMoreSheetViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    self.open    = p.showDetails;
    self.loan    = p.selected;
    self.onClose = function () { p.showDetails(false); };
    self.onOpenDetail = function () { p.showDetails(false); p.openLoanDetail(p.selected()); };
    self.onDisbInquiry = function () { p.showDetails(false); };
  }
  return LoanMoreSheetViewModel;
});
