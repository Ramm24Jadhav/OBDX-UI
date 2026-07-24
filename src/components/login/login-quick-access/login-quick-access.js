define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function LoginQuickAccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/login/login-quick-access/login-quick-access.css');
    this.openTrackApp    = p.openTrackApp;
    this.openOrigination = p.openOrigination;
  }
  return LoginQuickAccessViewModel;
});
