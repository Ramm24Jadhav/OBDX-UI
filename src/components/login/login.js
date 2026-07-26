define([
  'knockout',
  'platform',
  'shared-components/utils',
  'ojL10n!components/login/nls/strings',
  'ojs/ojknockout',
  'login-components/login-splash/loader',
  'login-components/login-hero/loader',
  'login-components/login-bio-view/loader',
  'login-components/login-mpin-view/loader',
  'login-components/login-password-view/loader',
  'login-components/login-quick-access/loader',
  'origination-components/loader'
], function (ko, platform, utils, nls) {

  function LoginViewModel() {
    var self = this;
    self.nls = nls;

    utils.loadCss('/components/login/login.css');

    // ── Splash ────────────────────────────────────────────────
    self.showSplash = ko.observable(true);
    var _splashTimer = null;

    _splashTimer = setTimeout(function () {
      self.showSplash(false);
    }, 1800);

    // ── Auth mode: 'bio' | 'faceid' | 'mpin' | 'password' ───
    self.authMode  = ko.observable('bio');
    self.isLoading = ko.observable(false);
    self.errorMsg  = ko.observable('');

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

    // ── User info ─────────────────────────────────────────────
    self.userName = ko.computed(function () {
      return window.obdxApp ? window.obdxApp.currentUser().name : 'Mohammed Al Jasem';
    });
    self.userInitial = ko.computed(function () {
      return self.userName().charAt(0);
    });

    // ── Language ──────────────────────────────────────────────
    self.currentLang = ko.computed(function () {
      return window.obdxApp ? window.obdxApp.currentLang() : 'en';
    });
    self.toggleLang = function () {
      window.obdxApp && window.obdxApp.toggleLang();
    };

    // ── Origination (pre-login) ───────────────────────────────
    self.showOrigination     = ko.observable(false);
    self.originationContext  = ko.observable('account');
    self.openOrigination     = function (ctx) {
      self.originationContext(ctx || 'account');
      self.showOrigination(true);
    };
    self.closeOrigination    = function () { self.showOrigination(false); };
    self.originationParams   = {
      open:    self.showOrigination,
      close:   self.closeOrigination,
      context: self.originationContext
    };

    // ── Actions ───────────────────────────────────────────────
    self.setMode = function (mode) {
      self.authMode(mode);
      self.errorMsg('');
      self.mpinVal('');
    };

    self.openTrackApp = function () {
      window.obdxApp && window.obdxApp.showToast('Track Application — no login needed', 'info');
    };

    function _performLogin(credentials) {
      self.isLoading(true);
      self.errorMsg('');
      window.obdxApp && window.obdxApp.showLoader('Authenticating', 'Verifying your credentials');
      platform.login(credentials).then(function () {
        self.isLoading(false);
        // Loader stays visible — appController.login() hides it after home data is ready
        window.obdxApp && window.obdxApp.login();
      }).catch(function (err) {
        self.isLoading(false);
        window.obdxApp && window.obdxApp.hideLoader();
        self.errorMsg((err && (err.message || err.errorCode)) || 'Authentication failed. Please try again.');
      });
    }

    self.doLogin = function () {
      var mode = self.authMode();

      // Native biometric via cordova-plugin-fingerprint-aio
      if ((mode === 'bio' || mode === 'faceid') && window.Fingerprint) {
        window.Fingerprint.show({
          clientId:              'OBDX Mobile Banking',
          clientSecret:          'obdx_bio_key',
          disableBackup:         false,
          localizedFallbackTitle: 'Use PIN',
          localizedReason:       'Authenticate to access your account'
        }, function () {
          _performLogin({ type: 'BIOMETRIC', userId: self.username() || 'CUST-0047829' });
        }, function (err) {
          self.errorMsg((err && err.message) || 'Biometric authentication failed');
        });
        return;
      }

      // Web / mock fallback — simulate native biometric delay for testing
      if (mode === 'bio' || mode === 'faceid') {
        self.errorMsg('');
        window.obdxApp && window.obdxApp.showLoader('Authenticating', 'Verifying your credentials');
        setTimeout(function () {
          _performLogin({ type: 'BIOMETRIC', userId: self.username() || 'CUST-0047829' });
        }, 2500);
        return;
      }

      _performLogin({
        type:     mode === 'mpin'     ? 'MPIN'
                : mode === 'password' ? 'PASSWORD'
                : 'BIOMETRIC',
        userId:   self.username() || 'CUST-0047829',
        mpin:     self.mpinVal(),
        password: self.password()
      });
    };

    // Auto-trigger native biometric when switching to bio/faceid mode
    self.authMode.subscribe(function (mode) {
      if ((mode === 'bio' || mode === 'faceid') && window.Fingerprint) {
        setTimeout(function () { self.doLogin(); }, 400);
      }
    });

    // ── Lifecycle ─────────────────────────────────────────────
    self.handleActivated = function () {
      self.showSplash(true);
      self.authMode('bio');
      self.mpinVal('');
      self.errorMsg('');
      self.username('');
      self.password('');
      self.showOrigination(false);
    };

    self.handleBindingsApplied = function () {
      clearTimeout(_splashTimer);
      _splashTimer = setTimeout(function () {
        self.showSplash(false);
      }, 1800);

      // Swipe gesture on language pill (left or right swipe toggles language)
      var pill = document.querySelector('.login-lang-btn');
      if (pill) {
        var _swipeStartX = 0;
        pill.addEventListener('touchstart', function (e) {
          _swipeStartX = e.touches[0].clientX;
        }, { passive: true });
        pill.addEventListener('touchend', function (e) {
          var dx = e.changedTouches[0].clientX - _swipeStartX;
          if (Math.abs(dx) > 15) {
            e.preventDefault();
            self.toggleLang();
          }
        }, { passive: false });
      }
    };

    self.handleDeactivated = function () {
      clearTimeout(_splashTimer);
    };
  }

  return LoginViewModel;
});
