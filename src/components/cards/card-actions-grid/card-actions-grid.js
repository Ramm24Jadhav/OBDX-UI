define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardActionsGridViewModel(context) {
    var p = context.properties ? context.properties.params : context;
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
