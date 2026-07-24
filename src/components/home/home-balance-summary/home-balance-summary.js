define(['shared-components/utils'], function (utils) {
  function HomeBalanceSummaryViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/home/home-balance-summary/home-balance-summary.css');
    this.displayTRV      = p.displayTRV;
    this.displayAvailBal = p.displayAvailBal;
    this.goToAccounts    = p.goToAccounts;
  }
  return HomeBalanceSummaryViewModel;
});
