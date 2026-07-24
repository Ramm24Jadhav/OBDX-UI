define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardPinSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-pin-sheet/card-pin-sheet.css');
    this.open    = p.showPINSheet;
    this.pinDots = p.pinDots;
    this.keys    = p.keys;
    this.pinKey  = p.pinKey;
    this.onClose = p.closePINSheet;
  }
  return CardPinSheetViewModel;
});
