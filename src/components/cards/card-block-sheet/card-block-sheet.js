define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardBlockSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-block-sheet/card-block-sheet.css');
    this.open         = p.showBlockSheet;
    this.blockReason  = p.blockReason;
    this.blockReasons = p.blockReasons;
    this.confirmBlock = p.confirmBlock;
    this.onClose      = p.closeBlockSheet;
  }
  return CardBlockSheetViewModel;
});
