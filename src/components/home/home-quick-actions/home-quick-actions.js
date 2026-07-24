define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function HomeQuickActionsViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-quick-actions/home-quick-actions.css');
    this.goToPay      = p.goToPay;
    this.goToAccounts = p.goToAccounts;
    this.goToMore     = p.goToMore;
  }
  return HomeQuickActionsViewModel;
});
