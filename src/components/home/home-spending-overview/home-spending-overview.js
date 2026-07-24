define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function HomeSpendingOverviewViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-spending-overview/home-spending-overview.css');
    this.openAnalytics = p.openAnalytics;
  }
  return HomeSpendingOverviewViewModel;
});
