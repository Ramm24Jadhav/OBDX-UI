define(['shared-components/utils', 'ojL10n!components/home/nls/strings'], function (utils, nls) {
  function HomeNotificationsPanelViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/home/home-notifications-panel/home-notifications-panel.css');
    this.showNotifications  = p.showNotifications;
    this.closeNotifications = p.closeNotifications;
    this.markAllRead        = p.markAllRead;
    this.notifList          = p.notifList;
    this.unreadCount        = p.unreadCount;
  }
  return HomeNotificationsPanelViewModel;
});
