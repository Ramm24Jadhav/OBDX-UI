define(['shared-components/utils'], function (utils) {
  function LoginSplashViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/login/login-splash/login-splash.css');
    this.open = p.showSplash;
  }
  return LoginSplashViewModel;
});
