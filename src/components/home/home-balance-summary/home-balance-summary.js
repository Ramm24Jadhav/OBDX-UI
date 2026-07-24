define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function HomeBalanceSummaryViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-balance-summary/home-balance-summary.css');
    this.displayTRV      = p.displayTRV;
    this.displayAvailBal = p.displayAvailBal;
    this.goToAccounts    = p.goToAccounts;
  }
  return HomeBalanceSummaryViewModel;
});
