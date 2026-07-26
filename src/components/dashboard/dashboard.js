/**
 * Dashboard — keep-alive container ViewModel.
 *
 * Uses KO template binding (nodes + data) instead of nested oj-module elements
 * to avoid JET custom-element upgrade issues inside a parent oj-module view.
 *
 * Login template is parsed and its VM instantiated immediately.
 * The 5 authenticated tabs are pre-fetched (AMD cache warm) right away but
 * VMs are only instantiated after isAuthenticated fires, so API calls never
 * run without a valid token.
 */
define([
  'knockout',
  'components/login/loader',
  'ojs/ojknockout'
], function (ko, loginCfg) {
  'use strict';

  var AUTH_LOADER_IDS = [
    'components/home/loader',
    'components/accounts/accounts-main/loader',
    'components/pay/pay-main/loader',
    'components/cards/cards-main/loader',
    'components/more/loader'
  ];
  var AUTH_TAB_KEYS = ['home', 'accounts', 'pay', 'cards', 'more'];

  function parseNodes(htmlStr) {
    var div = document.createElement('div');
    div.innerHTML = htmlStr;
    return Array.from(div.childNodes);
  }

  function DashboardViewModel() {
    var self = this;

    self.currentTab      = window.obdxApp.currentTab;
    self.isAuthenticated = window.obdxApp.isAuthenticated;

    // JET oj-module normally calls connected() after the view is in the DOM.
    // We bypass oj-module, so fire it manually after a tick so KO finishes
    // applying bindings before the VM makes any API calls.
    function _fireConnected(vm) {
      var fn = vm.connected || vm.handleActivated;
      if (typeof fn === 'function') {
        setTimeout(fn.bind(vm), 0);
      }
    }

    // Login — always ready; parse once and keep
    var loginNodes = parseNodes(loginCfg.view);
    var loginVm    = new loginCfg.viewModel();
    _fireConnected(loginVm);

    // Per-tab observables: null until the tab is activated post-auth
    self.tabViews = {
      login:    ko.observable(loginNodes),
      home:     ko.observable(null),
      accounts: ko.observable(null),
      pay:      ko.observable(null),
      cards:    ko.observable(null),
      more:     ko.observable(null)
    };
    self.tabVms = {
      login:    ko.observable(loginVm),
      home:     ko.observable(null),
      accounts: ko.observable(null),
      pay:      ko.observable(null),
      cards:    ko.observable(null),
      more:     ko.observable(null)
    };

    // Fire AMD pre-fetch immediately to warm the module cache while the
    // user is on the login screen. No ViewModel construction yet.
    require(AUTH_LOADER_IDS, function () {});

    function _activateTabs() {
      // Modules are almost certainly cached by now; resolves synchronously.
      require(AUTH_LOADER_IDS, function () {
        var loaders = Array.prototype.slice.call(arguments);

        // Home — priority: construct synchronously so KO renders it first
        var homeCfg = loaders[0];
        var homeVm  = new homeCfg.viewModel();
        self.tabViews.home(parseNodes(homeCfg.view));
        self.tabVms.home(homeVm);
        _fireConnected(homeVm);

        // Other 4 — all construct in parallel one tick later (after Home renders)
        setTimeout(function () {
          ['accounts', 'pay', 'cards', 'more'].forEach(function (key, i) {
            var cfg = loaders[i + 1];
            var vm  = new cfg.viewModel();
            self.tabViews[key](parseNodes(cfg.view));
            self.tabVms[key](vm);
            _fireConnected(vm);
          });
        }, 50);
      });
    }

    // Tear down authenticated tab VMs on logout so they are rebuilt fresh on next login.
    function _clearTabs() {
      AUTH_TAB_KEYS.forEach(function (key) {
        var vm = self.tabVms[key]();
        if (vm && typeof vm.disconnected === 'function') vm.disconnected();
        self.tabVms[key](null);
        self.tabViews[key](null);
      });
    }

    // Persistent subscription: activate on every login, clear on every logout.
    self.isAuthenticated.subscribe(function (auth) {
      if (auth) {
        _activateTabs();
      } else {
        _clearTabs();
      }
    });

    // Handle the case where the dashboard mounts while already authenticated.
    if (self.isAuthenticated()) {
      _activateTabs();
    }
  }

  return DashboardViewModel;
});
