define(['shared-components/utils', 'ojL10n!components/login/nls/strings'], function (utils, nls) {
  function LoginSplashViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/login/login-splash/login-splash.css');
    this.open = p.showSplash;
  }
  return LoginSplashViewModel;
});
