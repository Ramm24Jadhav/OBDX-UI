define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardLimitsSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-limits-sheet/card-limits-sheet.css');
    this.open         = p.showLimitSheet;
    this.dailyLimit   = p.dailyLimit;
    this.monthlyLimit = p.monthlyLimit;
    this.saveLimits   = p.saveLimits;
    this.onClose      = p.closeLimitSheet;
  }
  return CardLimitsSheetViewModel;
});
