define([
  'knockout',
  'shared-components/utils',
  'ojL10n!resources/nls/strings',
  'ojs/ojknockout',
  'more-components/more-hero/loader',
  'more-components/more-profile/loader',
  'more-components/more-notifications/loader',
  'more-components/more-security/loader',
  'more-components/more-tracking/loader',
  'more-components/more-theme/loader',
  'more-components/more-investments/loader',
  'more-components/more-forex/loader',
  'more-components/more-statements/loader',
  'more-components/more-primary-account/loader',
  'origination-components/loader'
], function (ko, utils, nls) {
  'use strict';

  function MoreViewModel() {
    var self = this;
    self.nls = nls;
    utils.loadCss('/components/more/more.css');

    // ── Panel visibility ──────────────────────────────────────
    self.showSignOut       = ko.observable(false);
    self.showProfile       = ko.observable(false);
    self.showNotifications = ko.observable(false);
    self.showSecurity      = ko.observable(false);
    self.showTracking      = ko.observable(false);
    self.showTheme         = ko.observable(false);
    self.showInvestments   = ko.observable(false);
    self.showForex         = ko.observable(false);
    self.showStatements    = ko.observable(false);
    self.showOrigination      = ko.observable(false);
    self.showPrimaryAccount   = ko.observable(false);
    self.originationContext = ko.observable('account');

    // ── Openers / closers ─────────────────────────────────────
    self.openProfile        = function () { self.showProfile(true); };
    self.closeProfile       = function () { self.showProfile(false); };
    self.openNotifications  = function () { self.showNotifications(true); };
    self.closeNotifications = function () { self.showNotifications(false); };
    self.openSecurity       = function () { self.showSecurity(true); };
    self.closeSecurity      = function () { self.showSecurity(false); };
    self.openTracking       = function () { self.showTracking(true); };
    self.closeTracking      = function () { self.showTracking(false); };
    self.openTheme          = function () { self.showTheme(true); };
    self.closeTheme         = function () { self.showTheme(false); };
    self.openInvestments    = function () { self.showInvestments(true); };
    self.closeInvestments   = function () { self.showInvestments(false); };
    self.openForex          = function () { self.showForex(true); };
    self.closeForex         = function () { self.showForex(false); };
    self.openStatements     = function () { self.showStatements(true); };
    self.closeStatements    = function () { self.showStatements(false); };

    self.openSignOut  = function () { self.showSignOut(true); };
    self.closeSignOut = function () { self.showSignOut(false); };

    // ── Origination (Open New Account) ────────────────────────
    self.openNewAccount   = function () {
      self.originationContext('account');
      self.showOrigination(true);
    };
    self.closeOrigination = function () { self.showOrigination(false); };

    self.openPrimaryAccount  = function () { self.showPrimaryAccount(true); };
    self.closePrimaryAccount = function () { self.showPrimaryAccount(false); };

    self.openLoans = function () {
      window._obdxDeepLink = 'loans';
      window.obdxApp && window.obdxApp.navigate('accounts');
    };

    self.openChat = function () {
      var cb = window.obdxApp && window.obdxApp.chatbot;
      if (cb && cb.toggle) cb.toggle();
    };

    self.callCenter = function () {
      window.location.href = 'tel:920000000';
    };

    self.confirmSignOut = function () {
      self.showSignOut(false);
      window.obdxApp && window.obdxApp.logout();
    };

    // ── Params objects passed to CCAs ─────────────────────────
    self.heroParams = {
      onProfileTap: self.openProfile
    };

    self.profileParams = {
      open: self.showProfile,
      onClose: self.closeProfile
    };

    self.notifParams = {
      open: self.showNotifications,
      onClose: self.closeNotifications
    };

    self.securityParams = {
      open: self.showSecurity,
      onClose: self.closeSecurity
    };

    self.trackingParams = {
      open: self.showTracking,
      onClose: self.closeTracking
    };

    self.themeParams = {
      open: self.showTheme,
      onClose: self.closeTheme
    };

    self.investmentsParams = {
      open: self.showInvestments,
      onClose: self.closeInvestments
    };

    self.forexParams = {
      open: self.showForex,
      onClose: self.closeForex
    };

    self.statementsParams = {
      open: self.showStatements,
      onClose: self.closeStatements
    };

    self.primaryAccountParams = {
      open: self.showPrimaryAccount,
      onClose: self.closePrimaryAccount
    };

    self.originationParams = {
      open: self.showOrigination,
      close: self.closeOrigination,
      context: self.originationContext
    };

    self.handleActivated = function () {};
    self.connected = self.handleActivated;
  }

  return MoreViewModel;
});
