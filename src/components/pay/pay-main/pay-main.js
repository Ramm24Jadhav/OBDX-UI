define([
  'knockout',
  'services/PaymentService',
  'services/AccountService',
  'shared-components/utils',
  'ojL10n!components/pay/nls/strings',
  'ojs/ojknockout',
  'pay-components/pay-hub/loader',
  'pay-components/pay-step-recipient/loader',
  'pay-components/pay-step-amount/loader',
  'pay-components/pay-step-review/loader',
  'pay-components/pay-step-otp/loader',
  'pay-components/pay-step-success/loader',
  'shared-components/pay_flow_header/loader'
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
    self.transferType    = ko.observable('WITHIN_OBDX');
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
      { id: 'WITHIN_OBDX', label: nls.pay_within_bank,    sub: nls.pay_within_bank_sub, color: 'primary' },
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

    self.flowType = ko.observable('transfer'); // 'own' | 'transfer'

    self.adhocMode         = ko.observable(false);
    self.selectedToAccount = ko.observable(null);
    self.adhocName         = ko.observable('');
    self.adhocBank         = ko.observable('');
    self.adhocAccountNo    = ko.observable('');

    self.startPayFlow = function (type) {
      var typeMap = { own:'WITHIN_OBDX', within:'WITHIN_OBDX', domestic:'OTHER_BANK', international:'SWIFT', gcc:'SWIFT', afaq:'OTHER_BANK', adhoc:'WITHIN_OBDX' };
      self.transferType(typeMap[type] || 'WITHIN_OBDX');
      self.flowType(type === 'own' ? 'own' : 'transfer');
      self.adhocMode(false);
      self.adhocName(''); self.adhocBank(''); self.adhocAccountNo('');
      self.selectedToAccount(null);
      self.step(1);
      window.obdxApp && window.obdxApp.setPanelOpen(true);
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

    self.backToHub = function () { self.step(0); window.obdxApp && window.obdxApp.setPanelOpen(false); };
    self.goBack    = function () { if (self.step() === 1) { self.backToHub(); } else { self.step(self.step() - 1); } };

    self.selectBeneficiary = function (ben) { self.selectedBen(ben); self.adhocMode(false); };

    self.selectOwnAccount = function (acc) {
      self.selectedBen({
        id: acc.id,
        name: acc.typeLabel || acc.type,
        initials: (acc.typeLabel || acc.type).substring(0, 2).toUpperCase(),
        bank: 'Own Account',
        accountNo: acc.number,
        avatarColor: '#7A1531'
      });
    };

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

    self.goToAmount = function () {
      if (self.flowType() === 'own') {
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
      self.step(0); self.selectedBen(null); self.selectedToAccount(null); self.amount('');
      self.purpose('Family Support'); self.note(''); self.otpVal('');
      clearInterval(self._otpTimer);
      window.obdxApp && window.obdxApp.setPanelOpen(false);
    };

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // ── Lifecycle ─────────────────────────────────────────────
    var _fallbackBens = [
      { id:'BEN-001', name:'Khalid Saeed Al Mansoori', initials:'KS', bank:'OBDX Bank',     accountNo:'OBDXAE33 0012 3456 789', type:'WITHIN_OBDX', avatarColor:'#7C3AED' },
      { id:'BEN-002', name:'Sara Ahmed Al Nuaimi',     initials:'SA', bank:'OBDX Bank',     accountNo:'•••• 7312',             type:'WITHIN_OBDX', avatarColor:'#2563EB' },
      { id:'BEN-003', name:'Rahul Kumar',              initials:'RK', bank:'Citibank UAE',  accountNo:'CITIAEAX 1234 5678',    type:'OTHER_BANK',  avatarColor:'#16A34A' },
      { id:'BEN-004', name:'Fatima Al Rashid',         initials:'FR', bank:'Emirates NBD',  accountNo:'ENBD4532 9876 5432',    type:'OTHER_BANK',  avatarColor:'#D97706' }
    ];

    self._load = function () {
      Promise.all([
        PaymentService.getBeneficiaries().catch(function () { return { beneficiaries: _fallbackBens }; }),
        AccountService.getAccounts().catch(function () { return { accounts: [] }; })
      ]).then(function (res) {
        self.beneficiaries((res[0].beneficiaries && res[0].beneficiaries.length) ? res[0].beneficiaries : _fallbackBens);
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
