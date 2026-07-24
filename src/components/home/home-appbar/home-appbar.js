define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  function HomeAppbarViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-appbar/home-appbar.css');
    this.userName     = p.userName;
    this.greeting     = p.greeting;
    this.unreadCount  = p.unreadCount;
    this.toggleBalance = p.toggleBalance;
    this.toggleLang   = p.toggleLang;
    this.goToNotifs   = p.goToNotifs;
  }
  return HomeAppbarViewModel;
});
