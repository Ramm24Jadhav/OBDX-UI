/**
 * OBDX Mobile — Root Application Controller
 * Follows Oracle OBDX ControllerViewModel pattern.
 * Manages: routing, auth state, language/RTL, global loader, toast.
 */
define([
  'knockout',
  'ojs/ojcontext',
  'ojs/ojcorerouter',
  'ojs/ojknockoutrouteradapter',
  'ojs/ojurlparamadapter',
  'ojs/ojarraydataprovider',
  'app-data',
  'platform',
  'framework/configurations/config',
  'services/UserService',
  'framework/interrupt-handler',
  'framework/component-registry',
  'framework/session-manager',
  'framework/extensions/extension-registry',
  'framework/analytics',
  'framework/chatbot',
  'ojs/ojknockout',
  'components/shared/obdx-toast/loader',
  'components/shared/session-countdown/loader'
], function (
  ko, Context,
  CoreRouter, KnockoutRouterAdapter,
  UrlParamAdapter, ArrayDataProvider,
  AppData, platform, config, UserService, InterruptHandler,
  ComponentRegistry, SessionManager, ExtensionRegistry,
  Analytics, Chatbot
) {

  // ── Dashboard keep-alive loader ──────────────────────────────────────────
  // The dashboard component is loaded exactly once and stays mounted for the
  // entire session. All 6 tab screens live inside it as persistent oj-module
  // slots; switching tabs is a pure CSS visibility toggle — no destroy/recreate.
  var _dashboardLoaded = false;

  function _loadDashboard(configObservable) {
    if (_dashboardLoaded) return;
    _dashboardLoaded = true;
    require([
      'text!../components/dashboard/dashboard.html',
      '../components/dashboard/dashboard',
      'ojs/ojknockout'
    ], function (view, DashboardVM) {
      // Pass the constructor, not an instance — oj-module instantiates it internally.
      configObservable({ view: view, viewModel: DashboardVM });
    }, function (err) {
      console.error('[OBDX] Dashboard load failed:', err);
    });
  }

  // ── Restore persisted theme on every boot ─────────────────────────────────
  (function () {
    try {
      var prefs = JSON.parse(localStorage.getItem('obdxThemePrefs') || '{}');
      var mode = prefs.themeMode;
      if (mode === 'dark')  document.documentElement.setAttribute('data-theme', 'dark');
      else if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      if (prefs.fontSize === 'large') document.documentElement.style.setProperty('font-size', '17px');
    } catch (e) {}
  }());

  function ControllerViewModel() {
    var self = this;

    // ── Accessibility ──────────────────────────────────────────
    self.manner  = ko.observable('polite');
    self.message = ko.observable('');
    document.getElementById('globalBody').addEventListener('announce', function (e) {
      self.message(e.detail.message);
      self.manner(e.detail.manner);
    }, false);

    // ── Force-clear session on every page boot ─────────────────
    // Hard reload / fresh tab must always start from login with a clean state.
    platform.logout();
    AppData.userData          = {};
    AppData.userSegment       = null;
    AppData.jsonContext        = null;
    AppData.currentEntity     = null;
    AppData.allowedComponents = {};
    AppData.isUserDataSet(false);
    document.body.classList.remove(
      'segment-retail', 'segment-corporate', 'segment-admin', 'segment-anon'
    );

    // ── Auth state ─────────────────────────────────────────────
    self.isAuthenticated = ko.observable(false);
    // Which tab slot the dashboard should display — set before dashboard loads
    // so it is immediately correct when the dashboard ViewModel reads it.
    self.currentTab = ko.observable('login');
    self.anyPanelOpen   = ko.observable(false);  // hides nav when sheet/sub-panel is open

    // ── Session modal state ────────────────────────────────────
    self.sessionExpired   = ko.observable(false);
    self.sessionSuspended = ko.observable(false);

    document.addEventListener('obdx:show:expired', function () {
      self.sessionExpired(true);
    });
    document.addEventListener('obdx:show:suspended', function () {
      self.sessionSuspended(true);
    });
    self.currentUser = ko.observable({
      name:       'Mohammed Al Jasem',
      initials:   'MJ',
      tier:       'Gold Member',
      customerId: 'CUST-0047829'
    });

    // ── Language / RTL ─────────────────────────────────────────
    self.currentLang = ko.observable('en');   // 'en' | 'ar'
    self.isRTL = ko.computed(function () {
      return self.currentLang() === 'ar';
    });
    self.isRTL.subscribe(function (rtl) {
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', rtl ? 'ar' : 'en');
    });

    self.toggleLanguage = function () {
      self.currentLang(self.currentLang() === 'en' ? 'ar' : 'en');
    };

    // ── Navigation routes ──────────────────────────────────────
    var navData = [
      { path: '',       redirect: 'login' },
      { path: 'login',  detail: { label: 'Login',    iconClass: 'home',     hidden: true  } },
      { path: 'home',   detail: { label: 'Home',     iconClass: 'home'     } },
      { path: 'accounts', detail: { label: 'Accounts', iconClass: 'accounts' } },
      { path: 'pay',    detail: { label: 'Pay',      iconClass: 'pay'      } },
      { path: 'cards',  detail: { label: 'Cards',    iconClass: 'cards'    } },
      { path: 'more',   detail: { label: 'More',     iconClass: 'more'     } }
    ];

    var router = new CoreRouter(navData, {
      urlAdapter: new UrlParamAdapter()
    });
    router.sync();

    self.selection = new KnockoutRouterAdapter(router);

    // currentRoute — used by nav bindings for active-state CSS
    self.currentRoute = ko.computed(function () {
      return self.selection.path ? self.selection.path() : '';
    });

    // ── OBDX component module config (replaces ModuleRouterAdapter) ─────────
    // Each route maps to components/{name}/loader.js which returns { view, viewModel }.
    var _moduleConfig = ko.observable({ view: [], viewModel: {} });
    self.moduleAdapter = { koObservableConfig: _moduleConfig };

    // Protected routes — require an authenticated session.
    var _protectedRoutes = ['home', 'accounts', 'pay', 'cards', 'more'];

    function _guardedLoad(path) {
      if (!path) return;
      if (_protectedRoutes.indexOf(path) !== -1 && !platform.getToken()) {
        router.go({ path: 'login' });
        return;
      }
      // Tell the dashboard which slot to show — pure observable update, no reload.
      self.currentTab(path || 'login');
      // Load the dashboard shell once; subsequent calls are no-ops.
      _loadDashboard(_moduleConfig);
    }

    // Use selection.path (KnockoutRouterAdapter's KO observable) — guaranteed API in JET 14.
    // Fires whenever the route changes; also read immediately for the initial load.
    self.selection.path.subscribe(function (path) {
      _guardedLoad(path);
    });

    // Initial load: read the current path from the adapter (already synced via router.sync())
    var _initPath = (self.selection.path && self.selection.path()) || 'login';
    _guardedLoad(_initPath);

    // Only show nav items that are not hidden (exclude login route)
    var visibleNavData = navData.filter(function (r) {
      return r.path && !r.detail.hidden;
    });
    self.navDataProvider = new ArrayDataProvider(visibleNavData, { keyAttributes: 'path' });

    // ── Routing helpers ────────────────────────────────────────
    self.navigate = function (path) {
      router.go({ path: path });
    };

    // ── Post-login bootstrap ───────────────────────────────────────
    // Called by login ViewModel after credentials are verified.
    // Loads /me, computes user segment, sets body class, then navigates home.
    self.login = function () {
      AppData.currentEntity = config.system.defaultEntity;
      self.isAuthenticated(true);
      self.sessionExpired(false);
      self.sessionSuspended(false);

      // Bootstrap: /me + /me/components in parallel
      Promise.all([
        UserService.getProfile(),
        UserService.getComponents()
      ]).then(function (results) {
        var profile    = results[0];
        var components = results[1];

        // Segment + context
        AppData.userData    = profile;
        var segment         = AppData.computeSegment(profile);
        AppData.userSegment = segment;
        AppData.jsonContext  = AppData.computeContext(segment);
        AppData.isUserDataSet(true);

        // Load entitlements into ComponentRegistry
        ComponentRegistry.load(components);
        AppData.allowedComponents = components;

        // Apply segment-specific extensions (e.g. corporate overrides)
        var segmentExts = ExtensionRegistry.evaluateSegment(segment);
        if (segmentExts.componentMappings) {
          ExtensionRegistry.setComponentMappings(segmentExts.componentMappings);
        }

        // Segment body class drives CSS theming
        document.body.classList.remove(
          'segment-retail', 'segment-corporate', 'segment-admin', 'segment-anon'
        );
        document.body.classList.add('segment-' + AppData.jsonContext);

        // Update the global current-user observable from real profile data
        if (profile && profile.customer) {
          var c = profile.customer;
          self.currentUser({
            name:       c.displayName  || c.fullName || self.currentUser().name,
            initials:   (c.displayName || c.fullName || 'MJ').charAt(0),
            tier:       c.tier         || self.currentUser().tier,
            customerId: c.id           || self.currentUser().customerId
          });
        }
      }).catch(function (err) {
        console.warn('[AppController] Bootstrap fetch failed — using defaults', err);
        AppData.userSegment = 'RETAIL';
        AppData.jsonContext  = 'retail';
        document.body.classList.add('segment-retail');
      }).then(function () {
        SessionManager.start();
        Analytics.track('session_start', { segment: AppData.userSegment });
        Chatbot.init();
        self.navigate('home');
      });
    };

    self.logout = function () {
      Analytics.track('session_end');
      Analytics.resetSession();
      SessionManager.stop();
      ComponentRegistry.reset();
      ExtensionRegistry.reset();
      Chatbot.reset();
      platform.logout();
      AppData.userData          = {};
      AppData.userSegment       = null;
      AppData.jsonContext        = null;
      AppData.currentEntity     = null;
      AppData.allowedComponents = {};
      AppData.isUserDataSet(false);
      document.body.classList.remove(
        'segment-retail', 'segment-corporate', 'segment-admin', 'segment-anon'
      );
      self.sessionExpired(false);
      self.sessionSuspended(false);
      self.isAuthenticated(false);
      self.navigate('login');
    };

    // ── Global Balance Mask ───────────────────────────────────
    self.balanceMasked = false;
    self.toggleBalanceMask = function () {
      self.balanceMasked = !self.balanceMasked;
      document.body.classList.toggle('sens-hidden', self.balanceMasked);
    };

    // ── Global Loader ──────────────────────────────────────────
    self.showLoader = function (msg, submsg) {
      var el      = document.getElementById('obdxLoader');
      var msg_el  = document.getElementById('obdxLoaderMsg');
      var sub_el  = document.getElementById('obdxLoaderSubMsg');
      if (el)     el.style.display = 'flex';
      if (msg_el) msg_el.textContent = msg || 'Processing';
      if (sub_el) sub_el.textContent = submsg || 'Please wait';
    };

    self.hideLoader = function () {
      var el = document.getElementById('obdxLoader');
      if (el) el.style.display = 'none';
    };

    // ── Toast — delegates to obdx-toast CCA (src/components/shared/obdx-toast/)
    self.showToast = function (msgOrOpts, type) {
      if (window.obdxToast) window.obdxToast.show(msgOrOpts, type);
    };
    self.clearToasts = function () {
      if (window.obdxToast) window.obdxToast.clearToasts();
    };

    // ── Global Picker ──────────────────────────────────────────
    self.pickerOpen    = ko.observable(false);
    self.pickerTitle   = ko.observable('');
    self.pickerOptions = ko.observableArray([]);
    self.pickerSelected = ko.observable('');
    self._pickerCb     = null;

    self.openPicker = function (title, options, callback) {
      self.pickerTitle(title);
      self.pickerOptions(options);
      self._pickerCb = callback;
      self.pickerOpen(true);
      self._sheetCloser = self.closePicker.bind(self);
    };
    self.closePicker = function () { self.pickerOpen(false); };
    self.selectPickerOption = function (option) {
      if (self._pickerCb) self._pickerCb(option);
      self.pickerOpen(false);
    };

    // ── Sheet drag-to-dismiss registry ────────────────────────
    self._sheetCloser = null;
    self.registerSheetClose = function (fn) { self._sheetCloser = fn; };
    self.closeCurrentSheet = function () {
      if (self._sheetCloser) { self._sheetCloser(); self._sheetCloser = null; }
      else self.pickerOpen(false);
    };

    // ── Interrupt handler — exposed to index.html KO bindings ─────
    self.interruptHandler = InterruptHandler;
    self.interruptKeyPress = function (key) { InterruptHandler.keyPress(key); };

    // Set global mock-mode flag so interrupt handler's _verifyOTP can skip the live call
    window._OBDX_MOCK_MODE = config.development.mockMode;

    // ── Service Worker registration ───────────────────────────────
    if (config.serviceWorker.enabled && 'serviceWorker' in navigator) {
      var _doRegisterSW = function () {
        navigator.serviceWorker.register(config.serviceWorker.path).then(function (reg) {
          console.log('[SW] Registered, scope:', reg.scope);
        }).catch(function (err) {
          console.warn('[SW] Registration failed:', err);
        });
      };
      // By the time RequireJS finishes loading appController, window.load
      // has usually already fired — register immediately in that case.
      if (document.readyState === 'complete') {
        _doRegisterSW();
      } else {
        window.addEventListener('load', _doRegisterSW);
      }
    }

    // ── Analytics — track route changes ──────────────────────────
    self.selection.path.subscribe(function (path) {
      if (path && path !== 'login') Analytics.page(path);
    });

    // ── Chatbot — exposed to index.html KO bindings ───────────────
    self.chatbot = Chatbot;
    self.chatbotSend = function () { Chatbot.send(); };
    self.chatbotKeyPress = function (data, event) {
      if (event.key === 'Enter') { Chatbot.send(); }
      return true;
    };

    // ── Expose globals for child viewModels ────────────────────
    window.obdxApp = {
      navigate:        self.navigate.bind(self),
      login:           self.login.bind(self),
      logout:          self.logout.bind(self),
      onLoginSuccess:  self.login.bind(self),
      // KO observables shared with the dashboard ViewModel
      currentTab:      self.currentTab,
      isAuthenticated: self.isAuthenticated,
      toggleLang:      self.toggleLanguage.bind(self),
      showLoader:      self.showLoader.bind(self),
      hideLoader:      self.hideLoader.bind(self),
      toggleBalanceMask: self.toggleBalanceMask.bind(self),
      showToast:       self.showToast.bind(self),
      currentUser:     self.currentUser,
      currentLang:     self.currentLang,
      setPanelOpen:    function(open) { self.anyPanelOpen(open); },
      openPicker:           self.openPicker.bind(self),
      closePicker:          self.closePicker.bind(self),
      selectPickerOption:   self.selectPickerOption.bind(self),
      registerSheetClose:   self.registerSheetClose.bind(self),
      closeCurrentSheet:    self.closeCurrentSheet.bind(self),
      // Phase 3 — access control and session
      componentRegistry:    ComponentRegistry,
      isComponentAllowed:   ComponentRegistry.isAllowed.bind(ComponentRegistry),
      // Phase 4 — analytics + chatbot
      track:                Analytics.track.bind(Analytics),
      chatbot:              Chatbot
    };
  }

  // Standard JET pattern: signal bootstrap complete before returning the VM
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});
