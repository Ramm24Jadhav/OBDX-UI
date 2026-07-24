define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function LoginHeroViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/login/login-hero/login-hero.css');
    this.toggleLang = p.toggleLang;
    this.currentLang = p.currentLang;
  }
  return LoginHeroViewModel;
});
