define(['shared-components/utils'], function (utils) {
  'use strict';
  function LoanListViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.loans         = p.loans;
    self.fmt           = p.fmt;
    self.onOpen        = p.open;
    self.onOpenDetail  = p.openLoanDetail;
    self.onOrigination = p.openOrigination;
  }
  return LoanListViewModel;
});
