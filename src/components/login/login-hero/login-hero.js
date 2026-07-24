define(['shared-components/utils'], function (utils) {
  function LoginHeroViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/login/login-hero/login-hero.css');
    this.toggleLang = p.toggleLang;
    this.currentLang = p.currentLang;
  }
  return LoginHeroViewModel;
});
