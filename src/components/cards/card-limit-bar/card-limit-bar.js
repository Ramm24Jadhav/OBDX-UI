define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardLimitBarViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-limit-bar/card-limit-bar.css');
    this.dailyLimit     = p.dailyLimit;
    this.monthlyLimit   = p.monthlyLimit;
    this.limitPercent   = p.limitPercent;
    this.openLimitSheet = p.openLimitSheet;
    this.formatAmount   = p.formatAmount;
  }
  return CardLimitBarViewModel;
});
