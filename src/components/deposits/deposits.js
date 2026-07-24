define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  var DEPOSITS = [
    {
      id: 1, name: '12-Month Fixed', ref: 'TD-00412-001',
      opened: '15 Jan 2025', status: 'Active', statusClass: 'pill-success',
      principal: 100000, rate: 5.00, maturity: '15 Jan 2026', progress: 50, profit: 2500,
      actions: ['Edit Maturity','Top-Up','Redeem'],
      productName: 'FD-Fixed Rate', nickname: 'Not Assigned',
      currentBalance: 102500, originalPrincipal: 100000, currentPrincipal: 100000,
      depositTerm: '12 Month(s)', valueDate: '15 Jan 2025',
      maturityAmount: 105000, maturityInstruction2: 'Reinvest Principal and Profit',
      holdAmount: 0, holdingPattern: 'Single', primaryHolder: 'Ahmed Al-Mansouri',
      nominee: 'Not Registered', sweepIn: false, branch: 'Tripoli Main Branch'
    },
    {
      id: 2, name: '6-Month Fixed', ref: 'TD-00412-002',
      opened: '01 Apr 2025', status: 'Due Oct', statusClass: 'pill-warning',
      principal: 100000, rate: 4.75, maturity: '01 Oct 2025', progress: 75, profit: 1781,
      actions: ['Edit Maturity','Top-Up','Redeem'],
      productName: 'FD-Fixed Rate', nickname: 'Not Assigned',
      currentBalance: 101781, originalPrincipal: 100000, currentPrincipal: 100000,
      depositTerm: '6 Month(s)', valueDate: '01 Apr 2025',
      maturityAmount: 102375, maturityInstruction2: 'Credit to Account on Maturity',
      holdAmount: 0, holdingPattern: 'Single', primaryHolder: 'Ahmed Al-Mansouri',
      nominee: 'Not Registered', sweepIn: false, branch: 'Tripoli Main Branch'
    },
    {
      id: 3, name: '3-Month Flexi', ref: 'TD-00412-003',
      opened: '10 Jun 2025', status: 'Active', statusClass: 'pill-success',
      principal: 50000, rate: 4.50, maturity: '10 Sep 2025', progress: 37, profit: 562,
      actions: ['Edit Maturity','Top-Up','Redeem'],
      productName: 'FD-Flexi Rate', nickname: 'Not Assigned',
      currentBalance: 50562, originalPrincipal: 50000, currentPrincipal: 50000,
      depositTerm: '3 Month(s)', valueDate: '10 Jun 2025',
      maturityAmount: 50563, maturityInstruction2: 'Reinvest Principal and Profit',
      holdAmount: 0, holdingPattern: 'Single', primaryHolder: 'Ahmed Al-Mansouri',
      nominee: 'Not Registered', sweepIn: false, branch: 'Tripoli Main Branch'
    }
  ];

  var fmt = utils.fmt;

  function DepositsViewModel(context) {
    var self = this;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/deposits/deposits.css');

    self.deposits = ko.observableArray(DEPOSITS);
    self.selected = ko.observable(null);

    // ── Detail panel ──────────────────────────────────────
    self.depDetail = ko.observable(false);
    self.openDepDetail = function (dep) {
      self.selected(dep);
      self.depDetail(true);
    };
    self.closeDepDetail = function () { self.depDetail(false); };

    // ── List action panel flags ───────────────────────────
    self.showRedeem       = ko.observable(false);
    self.showEditMaturity = ko.observable(false);
    self.showTopUp        = ko.observable(false);
    self.showMore         = ko.observable(false);

    // ── Form fields for list-level panels ────────────────
    // Shared accounts list (used by all account dropdowns)
    var ACCOUNTS = [
      { type: 'Current Account', number: '•••• 2341', nickname: 'Primary',  balance: 24750 },
      { type: 'Savings Account', number: '•••• 7312', nickname: null,        balance: 8920  }
    ];
    self.accounts = ko.observableArray(ACCOUNTS);

    self.redeemReason        = ko.observable('Liquidity needs');
    self.redeemCreditAccount = ko.observable(ACCOUNTS[0]);
    self.maturityInstruction = ko.observable('Reinvest Principal + Profit');
    self.renewTenure         = ko.observable('Same tenure');
    self.topUpAmount         = ko.observable('');
    self.topUpDeductFrom     = ko.observable(ACCOUNTS[0]);

    // ── Submission state for list-level panels ────────────
    self.submitted    = ko.observable(false);
    self.submittedMsg = ko.observable('');

    self.open = function (dep, panel) {
      self.selected(dep);
      self.submitted(false);
      self.closeAll();
      self[panel](true);
    };

    self.closeAll = function () {
      self.showRedeem(false);
      self.showEditMaturity(false);
      self.showTopUp(false);
      self.showMore(false);
      self.submitted(false);
    };

    self.confirmRedeem = function () {
      self.submittedMsg('Redemption request submitted. Funds credited within 1 business day.');
      self.submitted(true);
    };
    self.confirmMaturity = function () {
      self.submittedMsg('Maturity instruction updated successfully.');
      self.submitted(true);
    };
    self.confirmTopUp = function () {
      if (!self.topUpAmount()) { window.obdxApp && window.obdxApp.showToast('Enter top-up amount', 'error'); return; }
      self.submittedMsg('Top-up of ' + fmt(+self.topUpAmount()) + ' initiated. Processed within 24 hours.');
      self.submitted(true);
      self.topUpAmount('');
    };

    self.downloadCertificate = function () {
      window.obdxApp && window.obdxApp.showToast('Profit certificate downloading…', 'success');
      self.showMore(false);
    };

    // ── Global picker sheet ───────────────────────────────
    self.picker = {
      open:    ko.observable(false),
      title:   ko.observable(''),
      options: ko.observableArray([]),
      current: ko.observable(''),
      _target: null
    };
    self.openPicker = function (title, options, targetObs) {
      self.picker.title(title);
      self.picker.options(options);
      self.picker.current(ko.unwrap(targetObs));
      self.picker._target = targetObs;
      self.picker.open(true);
    };
    self.pickOption = function (opt) {
      if (self.picker._target) self.picker._target(opt);
      self.picker.current(opt);
      self.picker.open(false);
    };
    self.dismissPicker = function () { self.picker.open(false); };

    self.openOrigination = function () {
      window.dispatchEvent(new CustomEvent('app-origination', { detail: 'deposit' }));
    };

    self.fmt = fmt;

    ko.computed(function () {
      var any = self.showRedeem() || self.showEditMaturity() || self.showTopUp() ||
                self.showMore() || self.depDetail();
      window.obdxApp && window.obdxApp.setPanelOpen(any);
    }).extend({ deferred: true });
  }

  return DepositsViewModel;
});
