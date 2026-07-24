define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardFlipPopoutViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
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
