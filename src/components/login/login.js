/**
 * Login ViewModel — Splash + Biometric / MPIN / Password auth
 * OBDX MVVM pattern: AMD define, KO observables, handleActivated lifecycle
 */
define([
  'knockout',
  'platform',
  'ojs/ojknockout'
], function (ko, platform) {

  function LoginViewModel() {
    var self = this;

    // ── Splash state ───────────────────────────────────────────
    self.showSplash = ko.observable(true);
    var _splashTimer = null;

    // Start splash countdown immediately — KO will hide it when the timer fires
    _splashTimer = setTimeout(function () {
      self.showSplash(false);
    }, 2200);

    // ── Auth mode: 'bio' | 'mpin' | 'password' ────────────────
    self.authMode   = ko.observable('bio');
    self.isLoading  = ko.observable(false);
    self.errorMsg   = ko.observable('');

    // ── MPIN ──────────────────────────────────────────────────
    self.mpinVal = ko.observable('');
    self.mpinKeys = [
      {k:'1',sub:null},{k:'2',sub:'ABC'},{k:'3',sub:'DEF'},
      {k:'4',sub:'GHI'},{k:'5',sub:'JKL'},{k:'6',sub:'MNO'},
      {k:'7',sub:'PQRS'},{k:'8',sub:'TUV'},{k:'9',sub:'WXYZ'},
      {k:'',sub:null},{k:'0',sub:null},{k:'⌫',sub:null}
    ];

    self.mpinKeyPress = function (key) {
      if (key === '⌫') {
        self.mpinVal(self.mpinVal().slice(0, -1));
      } else if (key === '') {
        return;
      } else {
        if (self.mpinVal().length >= 6) return;
        self.mpinVal(self.mpinVal() + key);
        if (self.mpinVal().length === 6) {
          setTimeout(function () { self.doLogin(); }, 150);
        }
      }
    };

    // ── Password ──────────────────────────────────────────────
    self.username     = ko.observable('');
    self.password     = ko.observable('');
    self.showPassword = ko.observable(false);

    // ── User info (from global app state) ─────────────────────
    self.userName = ko.computed(function () {
      return window.amanApp ? window.amanApp.currentUser().name : 'Mohammed Al Jasem';
    });
    self.userInitial = ko.computed(function () {
      return self.userName().charAt(0);
    });

    // ── Language ──────────────────────────────────────────────
    self.currentLang = ko.computed(function () {
      return window.amanApp ? window.amanApp.currentLang() : 'en';
    });
    self.toggleLang = function () {
      window.amanApp && window.amanApp.toggleLang();
    };

    // ── Actions ───────────────────────────────────────────────
    self.setMode = function (mode) {
      self.authMode(mode);
      self.errorMsg('');
      self.mpinVal('');
    };

    self.openTrackApp = function () {
      window.amanApp && window.amanApp.showToast('Track Application — no login needed', 'info');
    };

    self.doLogin = function () {
      self.isLoading(true);
      self.errorMsg('');
      window.amanApp && window.amanApp.showLoader('Authenticating', 'Verifying your credentials');

      var credentials = {
        type:   self.authMode() === 'mpin'     ? 'MPIN'
               : self.authMode() === 'password' ? 'PASSWORD'
               : 'BIOMETRIC',
        userId: self.username() || 'CUST-0047829',
        mpin:   self.mpinVal(),
        password: self.password()
      };

      platform.login(credentials).then(function () {
        self.isLoading(false);
        window.amanApp && window.amanApp.hideLoader();
        window.amanApp && window.amanApp.login();
      }).catch(function (err) {
        self.isLoading(false);
        window.amanApp && window.amanApp.hideLoader();
        var msg = (err && (err.message || err.errorCode)) || 'Authentication failed. Please try again.';
        self.errorMsg(msg);
      });
    };

    // ── Lifecycle ─────────────────────────────────────────────
    self.handleActivated = function () {
      self.showSplash(true);
      self.authMode('bio');
      self.mpinVal('');
      self.errorMsg('');
      self.username('');
      self.password('');
      console.log('[Login] handleActivated called');
    };

    // handleBindingsApplied fires after KO has bound the view — safe to update observables
    self.handleBindingsApplied = function () {
      console.log('[Login] handleBindingsApplied — starting splash timer');
      clearTimeout(_splashTimer);
      _splashTimer = setTimeout(function () {
        console.log('[Login] splash timer fired — hiding splash');
        self.showSplash(false);
      }, 2200);
    };

    self.handleDeactivated = function () {
      clearTimeout(_splashTimer);
    };
  }

  return LoginViewModel;
});
