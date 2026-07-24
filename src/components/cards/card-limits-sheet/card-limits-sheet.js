define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardLimitsSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-limits-sheet/card-limits-sheet.css');
    this.open         = p.showLimitSheet;
    this.dailyLimit   = p.dailyLimit;
    this.monthlyLimit = p.monthlyLimit;
    this.saveLimits   = p.saveLimits;
    this.onClose      = p.closeLimitSheet;
  }
  return CardLimitsSheetViewModel;
});
