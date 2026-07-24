define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardNewSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-new-sheet/card-new-sheet.css');
    this.open    = p.showNewCard;
    this.onClose = p.closeNewCard;
  }
  return CardNewSheetViewModel;
});
