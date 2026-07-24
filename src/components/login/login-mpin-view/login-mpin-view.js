define(['shared-components/utils'], function (utils) {
  function LoginMpinViewModel(context) {
    var p = context.properties ? context.properties.params : context;
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
