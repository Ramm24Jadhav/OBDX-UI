define(['shared-components/utils', 'ojL10n!components/cards/nls/strings'], function (utils, nls) {
  'use strict';
  function CardTransactionsViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-transactions/card-transactions.css');
    this.activeCard   = p.activeCard;
    this.formatAmount = p.formatAmount;
  }
  return CardTransactionsViewModel;
});
