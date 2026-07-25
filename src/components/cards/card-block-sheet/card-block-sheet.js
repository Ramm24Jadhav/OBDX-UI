define(['shared-components/utils', 'ojL10n!components/cards/nls/strings'], function (utils, nls) {
  'use strict';
  function CardBlockSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/cards/card-block-sheet/card-block-sheet.css');
    this.open         = p.showBlockSheet;
    this.blockReason  = p.blockReason;
    this.blockReasons = p.blockReasons;
    this.confirmBlock = p.confirmBlock;
    this.onClose      = p.closeBlockSheet;
  }
  return CardBlockSheetViewModel;
});
