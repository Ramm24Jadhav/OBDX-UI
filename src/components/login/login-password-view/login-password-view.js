define(['shared-components/utils', 'ojL10n!components/login/nls/strings'], function (utils, nls) {
  function LoginPasswordViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
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
