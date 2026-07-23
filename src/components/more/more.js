define([
  'knockout',
  'services/UserService',
  'ojs/ojknockout'
], function (ko, UserService) {

  function MoreViewModel() {
    var self = this;

    self.isLoading        = ko.observable(false);
    self.showSignOut      = ko.observable(false);
    self.showProfile      = ko.observable(false);
    self.showNotifications = ko.observable(false);
    self.showSecurity     = ko.observable(false);
    self.showTracking     = ko.observable(false);

    // Sub-panel openers / closers
    self.openProfile       = function () { self.showProfile(true); };
    self.closeProfile      = function () { self.showProfile(false); };
    self.openNotifications = function () { self.showNotifications(true); };
    self.closeNotifications = function () { self.showNotifications(false); };
    self.openSecurity      = function () { self.showSecurity(true); };
    self.closeSecurity     = function () { self.showSecurity(false); };
    self.openTracking      = function () { self.showTracking(true); };
    self.closeTracking     = function () { self.showTracking(false); };
    self.openInvestments   = function () { window.amanApp && window.amanApp.showToast('Investments — coming soon', 'info'); };
    self.openPrimaryAccount = function () { window.amanApp && window.amanApp.navigate('accounts'); };
    self.openNewAccount    = function () { window.amanApp && window.amanApp.showToast('Open new account — coming soon', 'info'); };
    self.openThemes        = function () { window.amanApp && window.amanApp.showToast('Theme settings — coming soon', 'info'); };

    self.openSignOut  = function () { self.showSignOut(true);  };
    self.closeSignOut = function () { self.showSignOut(false); };

    self.confirmSignOut = function () {
      self.showSignOut(false);
      sessionStorage.removeItem('aman_auth_token');
      window.amanApp && window.amanApp.logout();
    };

    self.handleActivated = function () {};
  }

  return MoreViewModel;
});
