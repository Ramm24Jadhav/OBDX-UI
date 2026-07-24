define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function LoanDisbInquiryViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    self.open    = p.showDisbInquiry;
    self.loan    = p.loan;
    self.fmt     = p.fmt;
    self.onClose = function () { p.showDisbInquiry(false); };
  }
  return LoanDisbInquiryViewModel;
});
