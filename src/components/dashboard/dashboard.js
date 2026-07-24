/**
 * Dashboard — keep-alive container ViewModel.
 *
 * Loads the login screen eagerly (always needed).
 * Pre-fetches the 5 authenticated tab modules immediately to warm the AMD
 * cache, but defers ViewModel instantiation until after the user logs in
 * so API calls never fire without a valid token.
 */
define([
  'knockout',
  'components/login/loader',
  'ojs/ojknockout'
], function (ko, loginCfg) {
  'use strict';

  var EMPTY = { view: [], viewModel: null };

  var AUTH_LOADER_IDS = [
    'components/home/loader',
    'components/accounts/accounts-main/loader',
    'components/pay/pay-main/loader',
    'components/cards/cards-main/loader',
    'components/more/loader'
  ];
  var AUTH_TAB_KEYS = ['home', 'accounts', 'pay', 'cards', 'more'];

  function DashboardViewModel() {
    var self = this;

    // Shared observables from appController — set before dashboard loads.
    self.currentTab      = window.obdxApp.currentTab;
    self.isAuthenticated = window.obdxApp.isAuthenticated;

    // Login is always ready; authenticated tabs start empty and are
    // populated once auth completes.
    self.tabs = {
      login:    ko.observable(loginCfg),
      home:     ko.observable(EMPTY),
      accounts: ko.observable(EMPTY),
      pay:      ko.observable(EMPTY),
      cards:    ko.observable(EMPTY),
      more:     ko.observable(EMPTY)
    };

    // Immediately kick off AMD fetch for all authenticated tabs so the
    // module code is cached and ready before the user finishes logging in.
    require(AUTH_LOADER_IDS, function () {}); // fire-and-forget prefetch

    function _activateTabs() {
      // By this point the modules are almost certainly already cached.
      // require() resolves synchronously from cache when available.
      require(AUTH_LOADER_IDS, function () {
        var loaders = Array.prototype.slice.call(arguments);
        AUTH_TAB_KEYS.forEach(function (key, i) {
          self.tabs[key](loaders[i]);
        });
      });
    }

    if (self.isAuthenticated()) {
      // Session already active (e.g. deep-link or dev reload).
      _activateTabs();
    } else {
      var _authSub = self.isAuthenticated.subscribe(function (auth) {
        if (auth) {
          _activateTabs();
          _authSub.dispose();
        }
      });
    }
  }

  return DashboardViewModel;
});
