define(['shared-components/utils'], function (utils) {
  function LoginQuickAccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/login/login-quick-access/login-quick-access.css');
    this.openTrackApp    = p.openTrackApp;
    this.openOrigination = p.openOrigination;
  }
  return LoginQuickAccessViewModel;
});
