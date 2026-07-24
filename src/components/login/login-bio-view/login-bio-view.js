define(['shared-components/utils', 'ojL10n!components/login/nls/strings'], function (utils, nls) {
  function LoginBioViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/login/login-bio-view/login-bio-view.css');
    this.authMode    = p.authMode;
    this.userInitial = p.userInitial;
    this.userName    = p.userName;
    this.setMode     = p.setMode;
    this.doLogin     = p.doLogin;
  }
  return LoginBioViewModel;
});
