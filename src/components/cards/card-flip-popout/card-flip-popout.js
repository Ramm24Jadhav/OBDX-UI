define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardFlipPopoutViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-flip-popout/card-flip-popout.css');
    this.open            = p.showCpop;
    this.activeCard      = p.activeCard;
    this.cardFlipped     = p.cardFlipped;
    this.renderCardInner = p.renderCardInner;
    this.flipCard        = p.flipCard;
    this.onClose         = p.closeCpop;
  }
  return CardFlipPopoutViewModel;
});
