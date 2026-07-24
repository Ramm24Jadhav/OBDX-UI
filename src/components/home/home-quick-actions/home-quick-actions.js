define(['shared-components/utils'], function (utils) {
  function HomeQuickActionsViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/home/home-quick-actions/home-quick-actions.css');
    this.goToPay      = p.goToPay;
    this.goToAccounts = p.goToAccounts;
    this.goToMore     = p.goToMore;
  }
  return HomeQuickActionsViewModel;
});
