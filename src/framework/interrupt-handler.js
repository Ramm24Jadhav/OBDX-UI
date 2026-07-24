define(['knockout'], function (ko) {
  'use strict';

  var _pending   = null;
  var _otpTimer  = null;
  var OTP_TTL    = 300;   // seconds

  var InterruptHandler = {

    // ── UI State — KO observables bound to index.html overlay ─────
    isVisible:     ko.observable(false),
    interruptType: ko.observable(''),    // 'OTP' | 'SOFTTOKEN' | 'APPROVAL'
    interruptData: ko.observable(null),
    otpValue:      ko.observable(''),
    otpCountdown:  ko.observable(OTP_TTL),

    otpCountdownDisplay: null,   // set below after object is assigned

    // ── Called by BaseService on HTTP 417 ────────────────────────
    checkInterrupt: function (responseBody) {
      return new Promise(function (resolve, reject) {
        var type = (responseBody && (responseBody.interruptType || responseBody.type)) || '';

        if (!type) {
          reject(responseBody);
          return;
        }

        _pending = { resolve: resolve, reject: reject };

        InterruptHandler.interruptType(type);
        InterruptHandler.interruptData(responseBody);
        InterruptHandler.otpValue('');
        InterruptHandler.isVisible(true);

        if (type === 'OTP' || type === 'SOFTTOKEN') {
          InterruptHandler._startCountdown();
        }
      });
    },

    // ── OTP keypad input ──────────────────────────────────────────
    keyPress: function (key) {
      if (key === '⌫') {
        InterruptHandler.otpValue(InterruptHandler.otpValue().slice(0, -1));
        return;
      }
      if (key === '' || InterruptHandler.otpValue().length >= 6) return;
      InterruptHandler.otpValue(InterruptHandler.otpValue() + key);
      if (InterruptHandler.otpValue().length === 6) {
        InterruptHandler._verifyOTP();
      }
    },

    // ── Auto-verify when 6 digits entered ────────────────────────
    _verifyOTP: function () {
      var otp  = InterruptHandler.otpValue();
      var data = InterruptHandler.interruptData();
      var refNo = data && data.referenceNo;

      // In mock mode, any 6-digit OTP succeeds
      if (!refNo || window._AMAN_MOCK_MODE) {
        clearInterval(_otpTimer);
        InterruptHandler.isVisible(false);
        if (_pending) {
          _pending.resolve({ otp: otp, status: 'SUCCESS' });
          _pending = null;
        }
        return;
      }

      require(['services/UserService'], function (UserService) {
        UserService.validateOTP(otp, refNo)
          .then(function (res) {
            if (res && res.status === 'SUCCESS') {
              clearInterval(_otpTimer);
              InterruptHandler.isVisible(false);
              if (_pending) {
                _pending.resolve(res);
                _pending = null;
              }
            } else {
              InterruptHandler.otpValue('');
              if (window.obdxApp) window.obdxApp.showToast('Invalid OTP. Try again.', 'error');
            }
          })
          .catch(function () {
            InterruptHandler.otpValue('');
            if (window.obdxApp) window.obdxApp.showToast('OTP verification failed.', 'error');
          });
      });
    },

    // ── Resend OTP ────────────────────────────────────────────────
    resendOTP: function () {
      if (InterruptHandler.otpCountdown() > 0) return;
      var data  = InterruptHandler.interruptData();
      var refNo = data && data.referenceNo;
      if (refNo && !window._AMAN_MOCK_MODE) {
        require(['services/UserService'], function (UserService) {
          UserService.generateOTP(refNo).catch(function () {
            if (window.obdxApp) window.obdxApp.showToast('Could not resend OTP.', 'error');
          });
        });
      }
      InterruptHandler.otpValue('');
      InterruptHandler._startCountdown();
    },

    // ── Approval confirm ──────────────────────────────────────────
    confirmApproval: function () {
      InterruptHandler.isVisible(false);
      if (_pending) {
        _pending.resolve({ status: 'SUBMITTED_FOR_APPROVAL' });
        _pending = null;
      }
    },

    // ── Cancel ───────────────────────────────────────────────────
    cancelInterrupt: function () {
      clearInterval(_otpTimer);
      InterruptHandler.isVisible(false);
      InterruptHandler.otpValue('');
      if (_pending) {
        _pending.reject({ cancelled: true });
        _pending = null;
      }
    },

    // ── OTP countdown timer ───────────────────────────────────────
    _startCountdown: function () {
      clearInterval(_otpTimer);
      InterruptHandler.otpCountdown(OTP_TTL);
      _otpTimer = setInterval(function () {
        var c = InterruptHandler.otpCountdown();
        if (c <= 0) { clearInterval(_otpTimer); return; }
        InterruptHandler.otpCountdown(c - 1);
      }, 1000);
    }
  };

  InterruptHandler.otpCountdownDisplay = ko.pureComputed(function () {
    var c = InterruptHandler.otpCountdown();
    return Math.floor(c / 60) + ':' + String(c % 60).padStart(2, '0');
  });

  return InterruptHandler;
});
