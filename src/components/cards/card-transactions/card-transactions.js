define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardTransactionsViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-transactions/card-transactions.css');
    this.activeCard   = p.activeCard;
    this.formatAmount = p.formatAmount;
  }
  return CardTransactionsViewModel;
});
