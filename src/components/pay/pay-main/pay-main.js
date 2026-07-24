define([
  'knockout',
  'services/PaymentService',
  'services/AccountService',
  'shared-components/utils',
  'ojL10n!resources/nls/strings',
  'ojs/ojknockout',
  'pay-components/pay-hub/loader',
  'pay-components/pay-step-recipient/loader',
  'pay-components/pay-step-amount/loader',
  'pay-components/pay-step-review/loader',
  'pay-components/pay-step-otp/loader',
  'pay-components/pay-step-success/loader'
], function (ko, PaymentService, AccountService, utils, nls) {
  'use strict';

  function PayViewModel() {
    var self = this;
    self.nls = nls;

    utils.loadCss('/components/pay/pay-main/pay-main.css');

    // ── Transfer wizard state ─────────────────────────────────
    self.step            = ko.observable(0);
    self.isLoading       = ko.observable(false);
    self.beneficiaries   = ko.observableArray([]);
    self.accounts        = ko.observableArray([]);

    self.selectedBen     = ko.observable(null);
    self.selectedAccount = ko.observable(null);
    self.amount          = ko.observable('');
    self.purpose         = ko.observable('Family Support');
    self.note            = ko.observable('');
    self.transferType    = ko.observable('WITHIN_AMAN');
    self.referenceNo     = ko.observable('');

    self.scheduleEnabled = ko.observable(false);
    self.scheduledDate   = ko.observable('');
    self.successDateTime = ko.observable('');

    self.toggleSchedule  = function () { self.scheduleEnabled(!self.scheduleEnabled()); };

    self.otpVal       = ko.observable('');
    self.otpDots      = ko.computed(function () { return self.otpVal().length; });
    self.otpCountdown = ko.observable(300);
    self._otpTimer    = null;

    self.quickAmounts  = [500, 1000, 2000, 5000];

    self.transferTypes = [
      { id: 'WITHIN_AMAN', label: nls.pay_within_bank,    sub: nls.pay_within_bank_sub, color: 'primary' },
      { id: 'OTHER_BANK',  label: nls.pay_other_banks,    sub: nls.pay_other_banks_sub, color: 'info' },
      { id: 'SWIFT',       label: nls.pay_intl,           sub: nls.pay_intl_sub,        color: 'purple' }
    ];

    // Hub sub-panel state
    self.showQR            = ko.observable(false);
    self.showBeneficiaries = ko.observable(false);
    self.showScheduled     = ko.observable(false);
    self.showBills         = ko.observable(false);
    self.showTracker       = ko.observable(false);

    self.openQR             = function () { self.showQR(true); };
    self.closeQR            = function () { self.showQR(false); };
    self.openBeneficiaries  = function () { self.showBeneficiaries(true); };
    self.closeBeneficiaries = function () { self.showBeneficiaries(false); };
    self.openScheduled      = function () { self.showScheduled(true); };
    self.closeScheduled     = function () { self.showScheduled(false); };
    self.openBills          = function () { self.showBills(true); };
    self.closeBills         = function () { self.showBills(false); };
    self.openTracker        = function () { self.showTracker(true); };
    self.closeTracker       = function () { self.showTracker(false); };

    self.startPayFlow = function (type) {
      var typeMap = { own:'WITHIN_AMAN', within:'WITHIN_AMAN', domestic:'OTHER_BANK', international:'SWIFT', gcc:'SWIFT', afaq:'OTHER_BANK', adhoc:'WITHIN_AMAN' };
      self.transferType(typeMap[type] || 'WITHIN_AMAN');
      self.step(1);
    };

    // ── Step helpers ──────────────────────────────────────────
    self.showHub   = ko.computed(function () { return self.step() === 0; });
    self.showStep1 = ko.computed(function () { return self.step() === 1; });
    self.showStep2 = ko.computed(function () { return self.step() === 2; });
    self.showStep3 = ko.computed(function () { return self.step() === 3; });
    self.showStep4 = ko.computed(function () { return self.step() === 4; });
    self.showStep5 = ko.computed(function () { return self.step() === 5; });

    self.stepLabel = function (n) { return ['Recipient','Amount','Review','OTP'][n - 1] || ''; };

    self.stepClass = function (n) {
      var s = self.step();
      if (s > n)  return 'pay-step--done';
      if (s === n) return 'pay-step--active';
      return 'pay-step--pending';
    };

    self.backToHub = function () { self.step(0); };
    self.goBack    = function () { if (self.step() === 1) { self.backToHub(); } else { self.step(self.step() - 1); } };

    self.selectBeneficiary = function (ben) { self.selectedBen(ben); self.step(2); };
    self.setQuickAmount    = function (amt) { self.amount(String(amt)); };
    self.selectTransferType = function (t) { self.transferType(t.id); };

    self.goToReview = function () {
      if (!self.amount() || isNaN(parseFloat(self.amount()))) {
        window.obdxApp && window.obdxApp.showToast('Enter a valid amount', 'error');
        return;
      }
      self.step(3);
    };

    self.confirmTransfer = function () {
      self.isLoading(true);
      window.obdxApp && window.obdxApp.showLoader('Processing transfer', 'Please wait…');
      var payload = {
        beneficiaryId: self.selectedBen() ? self.selectedBen().id : null,
        accountId:     self.selectedAccount() ? self.selectedAccount().id : 'ACC-4829',
        amount:        parseFloat(self.amount()),
        currency:      'LYD',
        purpose:       self.purpose(),
        note:          self.note(),
        type:          self.transferType()
      };
      PaymentService.initiateTransfer(payload)
        .then(function (data) {
          self.referenceNo(data.referenceNo);
          return PaymentService.generateOTP(data.referenceNo);
        })
        .then(function () {
          self.step(4);
          self._startOTPCountdown();
        })
        .catch(function () {
          window.obdxApp && window.obdxApp.showToast('Transfer failed. Please try again.', 'error');
        })
        .finally(function () { self.isLoading(false); window.obdxApp && window.obdxApp.hideLoader(); });
    };

    self._startOTPCountdown = function () {
      self.otpCountdown(300);
      clearInterval(self._otpTimer);
      self._otpTimer = setInterval(function () {
        var c = self.otpCountdown();
        if (c <= 0) { clearInterval(self._otpTimer); return; }
        self.otpCountdown(c - 1);
      }, 1000);
    };

    self.otpCountdownDisplay = ko.computed(function () {
      var c = self.otpCountdown();
      return Math.floor(c / 60) + ':' + String(c % 60).padStart(2, '0');
    });

    self.otpKey = function (k) {
      if (k === '⌫') { self.otpVal(self.otpVal().slice(0, -1)); return; }
      if (k === '' || self.otpVal().length >= 6) return;
      self.otpVal(self.otpVal() + k);
      if (self.otpVal().length === 6) self._verifyOTP();
    };

    self._verifyOTP = function () {
      self.isLoading(true);
      window.obdxApp && window.obdxApp.showLoader('Verifying OTP', 'Please wait…');
      PaymentService.validateOTP(self.otpVal(), self.referenceNo())
        .then(function (data) {
          if (data.status === 'SUCCESS') {
            var now = new Date();
            self.successDateTime(now.toLocaleDateString('en-LY', {day:'2-digit',month:'short',year:'numeric'}) + ', ' + now.toLocaleTimeString('en-LY', {hour:'2-digit',minute:'2-digit'}));
            self.step(5);
            clearInterval(self._otpTimer);
          } else {
            window.obdxApp && window.obdxApp.showToast('Invalid OTP. Try again.', 'error');
            self.otpVal('');
          }
        })
        .catch(function () {
          window.obdxApp && window.obdxApp.showToast('OTP verification failed.', 'error');
          self.otpVal('');
        })
        .finally(function () { self.isLoading(false); window.obdxApp && window.obdxApp.hideLoader(); });
    };

    self.resetFlow = function () {
      self.step(0); self.selectedBen(null); self.amount('');
      self.purpose('Family Support'); self.note(''); self.otpVal('');
      clearInterval(self._otpTimer);
    };

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // ── Lifecycle ─────────────────────────────────────────────
    self._load = function () {
      Promise.all([
        PaymentService.getBeneficiaries(),
        AccountService.getAccounts()
      ]).then(function (res) {
        self.beneficiaries(res[0].beneficiaries || []);
        self.accounts(res[1].accounts || []);
        if (res[1].accounts && res[1].accounts.length > 0) {
          self.selectedAccount(res[1].accounts.find(function (a) { return a.type === 'CURRENT'; }) || res[1].accounts[0]);
        }
      });
    };

    self.handleActivated   = function () { self._load(); };
    self.handleDeactivated = function () { clearInterval(self._otpTimer); };

    self._load();
  }

  return PayViewModel;
});
