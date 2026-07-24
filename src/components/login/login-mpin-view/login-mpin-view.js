define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function LoginMpinViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/login/login-mpin-view/login-mpin-view.css');
    this.authMode     = p.authMode;
    this.userInitial  = p.userInitial;
    this.userName     = p.userName;
    this.mpinVal      = p.mpinVal;
    this.mpinKeys     = p.mpinKeys;
    this.errorMsg     = p.errorMsg;
    this.setMode      = p.setMode;
    this.mpinKeyPress = p.mpinKeyPress;
  }
  return LoginMpinViewModel;
});
