define(['knockout', 'ojL10n!components/more/nls/strings'], function (ko, nls) {
  'use strict';

  function SecurityViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    // ── Toggles ───────────────────────────────────────────────
    self.faceId    = ko.observable(true);
    self.mpinLock  = ko.observable(true);
    self.twoFactor = ko.observable(true);
    self.toggleFaceId    = function () { self.faceId(!self.faceId()); };
    self.toggleMpin      = function () { self.mpinLock(!self.mpinLock()); };
    self.toggleTwoFactor = function () { self.twoFactor(!self.twoFactor()); };

    // ── Active view: 'main' | 'mpin' | 'password' ─────────────
    self.view = ko.observable('main');
    self.goView = function (v) { self.view(v); self._clearForms(); };

    // ── Change MPIN ───────────────────────────────────────────
    self.mpinCurrent = ko.observable('');
    self.mpinNew     = ko.observable('');
    self.mpinConfirm = ko.observable('');
    self.mpinError   = ko.observable('');

    self.mpinNewValid = ko.computed(function () {
      return /^\d{6}$/.test(self.mpinNew());
    });
    self.mpinMatch = ko.computed(function () {
      return self.mpinNew() === self.mpinConfirm() && self.mpinConfirm().length > 0;
    });
    self.mpinCanSave = ko.computed(function () {
      return self.mpinCurrent().length === 6 && self.mpinNewValid() && self.mpinMatch();
    });

    self.saveMpin = function () {
      if (!self.mpinCanSave()) return;
      self.view('main');
      self._clearForms();
      window.obdxApp && window.obdxApp.showToast('MPIN updated successfully', 'success');
    };

    // ── Change Password ───────────────────────────────────────
    self.pwdCurrent  = ko.observable('');
    self.pwdNew      = ko.observable('');
    self.pwdConfirm  = ko.observable('');
    self.showPwdCurrent = ko.observable(false);
    self.showPwdNew     = ko.observable(false);
    self.showPwdConfirm = ko.observable(false);

    self.pwdStrength = ko.computed(function () {
      var p = self.pwdNew();
      if (!p) return 0;
      var score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      return score;
    });
    self.pwdStrengthLabel = ko.computed(function () {
      return ['', 'Weak', 'Fair', 'Good', 'Strong'][self.pwdStrength()] || '';
    });
    self.pwdStrengthColor = ko.computed(function () {
      return ['','#DC2626','#D97706','#2563EB','#16A34A'][self.pwdStrength()] || '';
    });
    self.pwdMatch = ko.computed(function () {
      return self.pwdNew() === self.pwdConfirm() && self.pwdConfirm().length > 0;
    });
    self.pwdCanSave = ko.computed(function () {
      return self.pwdCurrent().length > 0 && self.pwdStrength() >= 2 && self.pwdMatch();
    });

    self.savePassword = function () {
      if (!self.pwdCanSave()) return;
      self.view('main');
      self._clearForms();
      window.obdxApp && window.obdxApp.showToast('Password updated successfully', 'success');
    };

    // ── Active Sessions ───────────────────────────────────────
    self.sessions = ko.observableArray([
      { id: 1, device: 'iPhone 14 Pro', os: 'iOS 17', location: 'Tripoli, Libya', time: 'Active now',       current: true  },
      { id: 2, device: 'Chrome — Windows 11', os: 'Desktop', location: 'Tripoli, Libya', time: '2 hours ago', current: false },
      { id: 3, device: 'Samsung Galaxy S24', os: 'Android 14', location: 'Benghazi, Libya', time: 'Yesterday, 8:30 PM', current: false }
    ]);

    self.endSession = function (session, e) {
      e && e.stopPropagation();
      self.sessions.remove(session);
      window.obdxApp && window.obdxApp.showToast('Session ended', 'success');
    };

    self.endAllSessions = function () {
      var others = self.sessions().filter(function (s) { return !s.current; });
      others.forEach(function (s) { self.sessions.remove(s); });
      window.obdxApp && window.obdxApp.showToast('All other sessions ended', 'success');
    };

    // ── Trusted Devices ───────────────────────────────────────
    self.trustedDevices = ko.observableArray([
      { id: 1, name: 'iPhone 14 Pro', added: 'Added 12 Jan 2026'  },
      { id: 2, name: 'Chrome — MacBook Pro', added: 'Added 3 Mar 2026' }
    ]);
    self.removeTrusted = function (device, e) {
      e && e.stopPropagation();
      self.trustedDevices.remove(device);
      window.obdxApp && window.obdxApp.showToast('Trusted device removed', 'info');
    };

    // ── Helpers ───────────────────────────────────────────────
    self._clearForms = function () {
      self.mpinCurrent(''); self.mpinNew(''); self.mpinConfirm(''); self.mpinError('');
      self.pwdCurrent(''); self.pwdNew(''); self.pwdConfirm('');
      self.showPwdCurrent(false); self.showPwdNew(false); self.showPwdConfirm(false);
    };
  }

  return SecurityViewModel;
});
