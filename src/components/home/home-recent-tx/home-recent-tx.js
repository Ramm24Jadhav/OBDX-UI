define(['shared-components/utils'], function (utils) {
  function HomeRecentTxViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/home/home-recent-tx/home-recent-tx.css');
    this.transactions  = p.transactions;
    this.txIconBg      = p.txIconBg;
    this.txIconSvg     = p.txIconSvg;
    this.formatAmount  = p.formatAmount;
    this.goToAccounts  = p.goToAccounts;
  }
  return HomeRecentTxViewModel;
});
