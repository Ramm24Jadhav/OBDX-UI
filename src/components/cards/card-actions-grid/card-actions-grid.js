define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardActionsGridViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-actions-grid/card-actions-grid.css');
    this.activeCard     = p.activeCard;
    this.openBlockSheet = p.openBlockSheet;
    this.openLimitSheet = p.openLimitSheet;
    this.openPINSheet   = p.openPINSheet;
    this.onCardTap      = p.onCardTap;
    this.toggleFreeze   = p.toggleFreeze;
    this.formatAmount   = p.formatAmount;
  }
  return CardActionsGridViewModel;
});
