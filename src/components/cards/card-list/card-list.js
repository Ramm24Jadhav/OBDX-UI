define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardListViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-list/card-list.css');
    this.activeTab       = p.activeTab;
    this.activeIndex     = p.activeIndex;
    this.debitCards      = p.debitCards;
    this.creditCards     = p.creditCards;
    this.virtualCards    = p.virtualCards;
    this.activeCard      = p.activeCard;
    this.tabClass        = p.tabClass;
    this.selectTab       = p.selectTab;
    this.onCardTap       = p.onCardTap;
    this.renderCardInner = p.renderCardInner;
    this.openNewCard     = p.openNewCard;
  }
  return CardListViewModel;
});
