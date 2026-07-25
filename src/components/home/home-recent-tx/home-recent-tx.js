define(['shared-components/utils', 'ojL10n!components/home/nls/strings'], function (utils, nls) {
  function HomeRecentTxViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-recent-tx/home-recent-tx.css');
    this.transactions  = p.transactions;
    this.txIconBg      = p.txIconBg;
    this.txIconSvg     = p.txIconSvg;
    this.formatAmount  = p.formatAmount;
    this.goToAccounts  = p.goToAccounts;
  }
  return HomeRecentTxViewModel;
});
