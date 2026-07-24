define(['shared-components/utils'], function (utils) {
  function LoginPasswordViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/login/login-password-view/login-password-view.css');
    this.authMode     = p.authMode;
    this.username     = p.username;
    this.password     = p.password;
    this.showPassword = p.showPassword;
    this.errorMsg     = p.errorMsg;
    this.isLoading    = p.isLoading;
    this.setMode      = p.setMode;
    this.doLogin      = p.doLogin;
  }
  return LoginPasswordViewModel;
});
