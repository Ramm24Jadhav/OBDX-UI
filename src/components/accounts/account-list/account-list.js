define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  function AccountListViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;
    _loadCss('/components/accounts/account-list/account-list.css');
    self.currentAccounts  = params.currentAccounts;
    self.transactions     = params.transactions;
    self.cardView         = params.cardView;
    self.carouselIndex    = params.carouselIndex;
    self.openAccountDetail    = params.openAccountDetail;
    self.openAccountAnalytics = params.openAccountAnalytics;
    self.openStatementFor  = params.openStatementFor;
    self.openShareIBANFor  = params.openShareIBANFor;
    self.setListView       = params.setListView;
    self.setCardView       = params.setCardView;
    self.goToCard          = params.goToCard;
    self.formatAmount      = params.formatAmount;
    self.txIconBg          = params.txIconBg;
    self.txIconSvg         = params.txIconSvg;
  }

  return AccountListViewModel;
});
