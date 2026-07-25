define([
  'knockout',
  'services/PaymentService',
  'ojL10n!components/pay/nls/strings'
], function (ko, PaymentService, nls) {
  'use strict';

  function BaseFlowViewModel(params) {
    var self = this;

    // ── Shared data from pay-main ─────────────────────────────────
    self.nls             = nls;
    self.flowType        = params.flowType        || ko.observable('within');
    self.beneficiaries   = params.beneficiaries   || ko.observableArray([]);
    self.accounts        = params.accounts        || ko.observableArray([]);
    self.selectedAccount = params.selectedAccount || ko.observable(null);
    self.onBackToHub     = params.onBackToHub     || function () {};

    // ── Transfer type setup ───────────────────────────────────────
    self.transferType  = ko.observable(params.defaultTransferType || 'WITHIN_OBDX');
    self.transferTypes = [
      { id: 'WITHIN_OBDX', label: nls.pay_within_bank,  sub: nls.pay_within_bank_sub, color: 'primary' },
      { id: 'OTHER_BANK',  label: nls.pay_other_banks,  sub: nls.pay_other_banks_sub, color: 'info' },
      { id: 'SWIFT',       label: nls.pay_intl,          sub: nls.pay_intl_sub,        color: 'purple' }
    ];
    self.selectTransferType = function (t) { self.transferType(t.id); };

    // ── Step state ────────────────────────────────────────────────
    self.step      = ko.observable(1);
    self.isLoading = ko.observable(false);

    self.showStep1 = ko.computed(function () { return self.step() === 1; });
    self.showStep2 = ko.computed(function () { return self.step() === 2; });
    self.showStep3 = ko.computed(function () { return self.step() === 3; });
    self.showStep4 = ko.computed(function () { return self.step() === 4; });
    self.showStep5 = ko.computed(function () { return self.step() === 5; });

    // ── Transfer payload state ────────────────────────────────────
    self.selectedBen       = ko.observable(null);
    self.selectedToAccount = ko.observable(null);
    self.amount            = ko.observable('');
    self.purpose           = ko.observable('Family Support');
    self.note              = ko.observable('');
    self.referenceNo       = ko.observable('');
    self.successDateTime   = ko.observable('');
    self.transferStatus    = ko.observable('success');
    self.scheduleEnabled   = ko.observable(false);
    self.scheduledDate     = ko.observable('');
    self.quickAmounts      = [500, 1000, 2000, 5000];

    self.toggleSchedule  = function () { self.scheduleEnabled(!self.scheduleEnabled()); };
    self.setQuickAmount  = function (amt) { self.amount(String(amt)); };
    self.selectBeneficiary = function (ben) { self.selectedBen(ben); self.adhocMode(false); };

    // ── Adhoc state ───────────────────────────────────────────────
    self.adhocMode      = ko.observable(params.startAdhoc || false);
    self.adhocName      = ko.observable('');
    self.adhocBank      = ko.observable('');
    self.adhocAccountNo = ko.observable('');

    self.toggleAdhoc = function () {
      self.adhocMode(!self.adhocMode());
      if (self.adhocMode()) self.selectedBen(null);
    };

    self.proceedAdhoc = function () {
      var name  = self.adhocName().trim();
      var accNo = self.adhocAccountNo().trim();
      if (!name || !accNo) {
        window.obdxApp && window.obdxApp.showToast('Please fill in payee name and account number', 'error');
        return;
      }
      self.selectedBen({
        id: 'ADHOC-' + Date.now(),
        name: name,
        initials: name.substring(0, 2).toUpperCase(),
        bank: self.adhocBank().trim() || 'New Payee',
        accountNo: accNo,
        avatarColor: '#DC2626'
      });
      self.step(2);
    };

    // ── OTP state ─────────────────────────────────────────────────
    self.otpVal       = ko.observable('');
    self.otpDots      = ko.computed(function () { return self.otpVal().length; });
    self.otpCountdown = ko.observable(300);
    self._otpTimer    = null;

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

    // ── Navigation ────────────────────────────────────────────────
    self.goBack = function () {
      if (self.step() === 1) { self.onBackToHub(); } else { self.step(self.step() - 1); }
    };

    self.goToAmount = function () {
      var ft = ko.isObservable(self.flowType) ? self.flowType() : self.flowType;
      if (ft === 'own') {
        var acc = self.selectedToAccount();
        if (!acc) return;
        self.selectedBen({
          id: acc.id,
          name: acc.typeLabel || acc.type,
          initials: (acc.typeLabel || acc.type).substring(0, 2).toUpperCase(),
          bank: 'Own Account',
          accountNo: acc.number,
          avatarColor: '#7A1531'
        });
      }
      if (self.selectedBen()) self.step(2);
    };

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
      PaymentService.initiateTransfer({
        beneficiaryId: self.selectedBen() ? self.selectedBen().id : null,
        accountId:     self.selectedAccount() ? self.selectedAccount().id : 'ACC-4829',
        amount:        parseFloat(self.amount()),
        currency:      'LYD',
        purpose:       self.purpose(),
        note:          self.note(),
        type:          self.transferType()
      }).then(function (data) {
        self.referenceNo(data.referenceNo);
        return PaymentService.generateOTP(data.referenceNo);
      }).then(function () {
        self.step(4);
        self._startOTPCountdown();
      }).catch(function () {
        window.obdxApp && window.obdxApp.showToast('Transfer failed. Please try again.', 'error');
      }).finally(function () { self.isLoading(false); window.obdxApp && window.obdxApp.hideLoader(); });
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

    self._verifyOTP = function () {
      self.isLoading(true);
      window.obdxApp && window.obdxApp.showLoader('Verifying OTP', 'Please wait…');
      PaymentService.validateOTP(self.otpVal(), self.referenceNo())
        .then(function (data) {
          if (data.status === 'SUCCESS') {
            var now = new Date();
            self.successDateTime(now.toLocaleDateString('en-LY', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-LY', { hour: '2-digit', minute: '2-digit' }));
            self.transferStatus('success');
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
      clearInterval(self._otpTimer);
      self.step(1);
      self.selectedBen(null);
      self.selectedToAccount(null);
      self.amount('');
      self.purpose('Family Support');
      self.note('');
      self.otpVal('');
      self.adhocMode(params.startAdhoc || false);
      self.onBackToHub();
    };

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    self.dispose = function () { clearInterval(self._otpTimer); };
  }

  return BaseFlowViewModel;
});
