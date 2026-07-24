define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function LoanScheduleViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');
    self.open    = p.showSchedule;
    self.loan    = p.selected;
    self.fmt     = p.fmt;
    self.onClose = function () { p.showSchedule(false); };
  }
  return LoanScheduleViewModel;
});
