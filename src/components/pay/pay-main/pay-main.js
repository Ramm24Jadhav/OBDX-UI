define([
  'knockout',
  'services/PaymentService',
  'services/AccountService',
  'shared-components/utils',
  'ojs/ojknockout',
  'pay-components/pay-hub/loader',
  'shared-components/pay_flow_header/loader',
  'shared-components/pay_confirmation/loader',
  'pay-flows/within-flow/loader',
  'pay-flows/own-flow/loader',
  'pay-flows/domestic-flow/loader',
  'pay-flows/intl-flow/loader',
  'pay-flows/gcc-flow/loader',
  'pay-flows/afaq-flow/loader',
  'pay-flows/adhoc-flow/loader',
  'pay-panels/qr-pay/loader',
  'pay-panels/bene-panel/loader',
  'pay-panels/scheduled-panel/loader',
  'pay-panels/standing-panel/loader',
  'pay-panels/bills-panel/loader',
  'pay-panels/tracker-panel/loader',
  'pay-panels/bulk-panel/loader',
  'pay-components/pay-step-recipient/loader',
  'pay-components/pay-step-amount/loader',
  'pay-components/pay-step-review/loader',
  'pay-components/pay-step-otp/loader'
], function (ko, PaymentService, AccountService, utils) {
  'use strict';

  function PayViewModel() {
    var self = this;

    utils.loadCss('/components/pay/pay-main/pay-main.css');

    // ── Shared data ───────────────────────────────────────────────
    self.beneficiaries   = ko.observableArray([]);
    self.accounts        = ko.observableArray([]);
    self.selectedAccount = ko.observable(null);

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // ── Flow router ───────────────────────────────────────────────
    self.flowType = ko.observable(null);
    self.showHub  = ko.computed(function () { return !self.flowType(); });

    self.startPayFlow = function (type) {
      self.flowType(type || 'within');
      window.obdxApp && window.obdxApp.setPanelOpen(true);
    };

    self.backToHub = function () {
      self.flowType(null);
      window.obdxApp && window.obdxApp.setPanelOpen(false);
    };

    // ── Hub panel state ───────────────────────────────────────────
    self.showQR        = ko.observable(false);
    self.showBene      = ko.observable(false);
    self.showScheduled = ko.observable(false);
    self.showStanding  = ko.observable(false);
    self.showBills     = ko.observable(false);
    self.showTracker   = ko.observable(false);
    self.showBulk      = ko.observable(false);

    // alias used by pay-hub.js param destructuring
    self.showBeneficiaries  = self.showBene;
    self.openQR             = function () { self.showQR(true); };
    self.closeQR            = function () { self.showQR(false); };
    self.openBeneficiaries  = function () { self.showBene(true); };
    self.closeBeneficiaries = function () { self.showBene(false); };
    self.openScheduled      = function () { self.showScheduled(true); };
    self.closeScheduled     = function () { self.showScheduled(false); };
    self.openStanding       = function () { self.showStanding(true); };
    self.closeStanding      = function () { self.showStanding(false); };
    self.openBills          = function () { self.showBills(true); };
    self.closeBills         = function () { self.showBills(false); };
    self.openTracker        = function () { self.showTracker(true); };
    self.closeTracker       = function () { self.showTracker(false); };
    self.openBulk           = function () { self.showBulk(true); };
    self.closeBulk          = function () { self.showBulk(false); };

    self.selectBeneficiary = function (ben) {
      // Used by bene-panel — starts the within-bank flow with chosen beneficiary pre-selected
      self.startPayFlow('within');
    };

    // ── Lifecycle ─────────────────────────────────────────────────
    var _fallbackBens = [
      { id: 'BEN-001', name: 'Khalid Saeed Al Mansoori', initials: 'KS', bank: 'OBDX Bank',    accountNo: 'OBDXAE33 0012 3456 789', type: 'WITHIN_OBDX', avatarColor: '#7C3AED' },
      { id: 'BEN-002', name: 'Sara Ahmed Al Nuaimi',     initials: 'SA', bank: 'OBDX Bank',    accountNo: '•••• 7312',             type: 'WITHIN_OBDX', avatarColor: '#2563EB' },
      { id: 'BEN-003', name: 'Rahul Kumar',              initials: 'RK', bank: 'Citibank UAE', accountNo: 'CITIAEAX 1234 5678',    type: 'OTHER_BANK',  avatarColor: '#16A34A' },
      { id: 'BEN-004', name: 'Fatima Al Rashid',         initials: 'FR', bank: 'Emirates NBD', accountNo: 'ENBD4532 9876 5432',    type: 'OTHER_BANK',  avatarColor: '#D97706' }
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
    self.handleDeactivated = function () {};

    self._load();
  }

  return PayViewModel;
});
