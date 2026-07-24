define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardNewSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-new-sheet/card-new-sheet.css');
    this.open    = p.showNewCard;
    this.onClose = p.closeNewCard;
  }
  return CardNewSheetViewModel;
});
