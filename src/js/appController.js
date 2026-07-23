/**
 * Aman Bank OBDX — Root Application Controller
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
  'ojs/ojknockout'
], function (
  ko, Context,
  CoreRouter, KnockoutRouterAdapter,
  UrlParamAdapter, ArrayDataProvider
) {

  // ── OBDX component loader ────────────────────────────────────────────────
  // Loads view HTML and ViewModel directly from components/{name}/.
  // Using absolute-from-baseUrl paths avoids the text! relative-path
  // double-alias bug that occurs when loading through a loader.js intermediary.
  function _loadComponent(path, configObservable) {
    var viewId = 'text!../components/' + path + '/view.html';
    var vmId   = '../components/' + path + '/viewModel';
    require([viewId, vmId, 'ojs/ojknockout'], function (view, ViewModel) {
      configObservable({ view: view, viewModel: ViewModel });
    }, function (err) {
      console.error('[AmanBank] Component load failed: ' + path, err);
    });
  }

  function ControllerViewModel() {
    var self = this;

    // ── Accessibility ──────────────────────────────────────────
    self.manner  = ko.observable('polite');
    self.message = ko.observable('');
    document.getElementById('globalBody').addEventListener('announce', function (e) {
      self.message(e.detail.message);
      self.manner(e.detail.manner);
    }, false);

    // ── Auth state ─────────────────────────────────────────────
    self.isAuthenticated = ko.observable(false);
    self.anyPanelOpen   = ko.observable(false);  // hides nav when sheet/sub-panel is open
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

    // Use selection.path (KnockoutRouterAdapter's KO observable) — guaranteed API in JET 14.
    // Fires whenever the route changes; also read immediately for the initial load.
    self.selection.path.subscribe(function (path) {
      if (path) _loadComponent(path, _moduleConfig);
    });

    // Initial load: read the current path from the adapter (already synced via router.sync())
    var _initPath = (self.selection.path && self.selection.path()) || 'login';
    _loadComponent(_initPath, _moduleConfig);

    // Only show nav items that are not hidden (exclude login route)
    var visibleNavData = navData.filter(function (r) {
      return r.path && !r.detail.hidden;
    });
    self.navDataProvider = new ArrayDataProvider(visibleNavData, { keyAttributes: 'path' });

    // ── Routing helpers ────────────────────────────────────────
    self.navigate = function (path) {
      router.go({ path: path });
    };

    self.login = function () {
      self.isAuthenticated(true);
      self.navigate('home');
    };

    self.logout = function () {
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
      var el      = document.getElementById('amanLoader');
      var msg_el  = document.getElementById('amanLoaderMsg');
      var sub_el  = document.getElementById('amanLoaderSubMsg');
      if (el)     el.style.display = 'flex';
      if (msg_el) msg_el.textContent = msg || 'Processing';
      if (sub_el) sub_el.textContent = submsg || 'Please wait';
    };

    self.hideLoader = function () {
      var el = document.getElementById('amanLoader');
      if (el) el.style.display = 'none';
    };

    // ── Global Toast ──────────────────────────────────────────
    var _toastTimer = null;
    self.showToast = function (msg, type) {
      var el     = document.getElementById('amanToast');
      var msg_el = document.getElementById('amanToastMsg');
      if (!el || !msg_el) return;
      msg_el.textContent = msg;
      el.className = 'aman-toast aman-toast--' + (type || 'info') + ' aman-toast--show';
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function () {
        el.className = 'aman-toast';
      }, 3000);
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

    // ── Expose globals for child viewModels ────────────────────
    window.amanApp = {
      navigate:        self.navigate.bind(self),
      login:           self.login.bind(self),
      logout:          self.logout.bind(self),
      onLoginSuccess:  self.login.bind(self),
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
      closeCurrentSheet:    self.closeCurrentSheet.bind(self)
    };
  }

  // Standard JET pattern: signal bootstrap complete before returning the VM
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});
