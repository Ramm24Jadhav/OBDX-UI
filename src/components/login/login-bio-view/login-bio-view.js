define(['shared-components/utils'], function (utils) {
  function LoginBioViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/login/login-bio-view/login-bio-view.css');
    this.authMode    = p.authMode;
    this.userInitial = p.userInitial;
    this.userName    = p.userName;
    this.setMode     = p.setMode;
    this.doLogin     = p.doLogin;
  }
  return LoginBioViewModel;
});
