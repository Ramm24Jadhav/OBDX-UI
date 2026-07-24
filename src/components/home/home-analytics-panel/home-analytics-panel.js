define(['shared-components/utils', 'ojL10n!components/home/nls/strings'], function (utils, nls) {
  function HomeAnalyticsPanelViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-analytics-panel/home-analytics-panel.css');
    this.showAnalytics        = p.showAnalytics;
    this.closeAnalytics       = p.closeAnalytics;
    this.anPeriod             = p.anPeriod;
    this.anSetPeriod          = p.anSetPeriod;
    this.anSummary            = p.anSummary;
    this.analyticsCategories  = p.analyticsCategories;
  }
  return HomeAnalyticsPanelViewModel;
});
