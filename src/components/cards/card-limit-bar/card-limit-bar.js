define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardLimitBarViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-limit-bar/card-limit-bar.css');
    this.dailyLimit     = p.dailyLimit;
    this.monthlyLimit   = p.monthlyLimit;
    this.limitPercent   = p.limitPercent;
    this.openLimitSheet = p.openLimitSheet;
    this.formatAmount   = p.formatAmount;
  }
  return CardLimitBarViewModel;
});
