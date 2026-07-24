define(['shared-components/utils'], function (utils) {
  function HomeSpendingOverviewViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/home/home-spending-overview/home-spending-overview.css');
    this.openAnalytics = p.openAnalytics;
  }
  return HomeSpendingOverviewViewModel;
});
