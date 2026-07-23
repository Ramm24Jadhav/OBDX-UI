define(['knockout'], function (ko) {
  'use strict';

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url); document.head.appendChild(l);
    }
  }

  var DEPOSITS = [
    {
      id: 1, name: '12-Month Fixed', ref: 'TD-00412-001',
      opened: '15 Jan 2025', status: 'Active', statusClass: 'pill-success',
      principal: 100000, rate: 5.00, maturity: '15 Jan 2026', progress: 50, profit: 2500,
      actions: ['Edit Maturity','Top-Up','Redeem'],
      // OBDX fields
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

  function fmt(n) { return 'LYD ' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}); }

  function DepositsViewModel(Context) {
    var self = this;
    _loadCss('/components/accounts/deposits/deposits.css');

    self.deposits = ko.observableArray(DEPOSITS);
    self.selected = ko.observable(null);

    // ── Detail panel ──────────────────────────────────────
    self.depDetail   = ko.observable(false);
    self.detailTab   = ko.observable('details');
    self.openDepDetail = function (dep) {
      self.selected(dep); self.detailTab('details');
      self.submitted(false); self.depDetail(true);
    };
    self.closeDepDetail = function () { self.depDetail(false); self.closeAllSheets(); };

    // ── List action panel flags ───────────────────────────
    self.showRedeem       = ko.observable(false);
    self.showEditMaturity = ko.observable(false);
    self.showTopUp        = ko.observable(false);
    self.showMore         = ko.observable(false);

    // ── Detail-screen sheet flags ─────────────────────────
    self.showDetMore      = ko.observable(false);
    self.showEStatSub     = ko.observable(false);
    self.showNickname     = ko.observable(false);
    self.showStatement    = ko.observable(false); // detail statement tab request

    // ── Form fields ───────────────────────────────────────
    self.redeemReason        = ko.observable('Liquidity needs');
    self.maturityInstruction = ko.observable('Reinvest Principal + Profit');
    self.topUpAmount         = ko.observable('');
    self.statementPeriod     = ko.observable('Last 3 months');
    self.statementFormat     = ko.observable('PDF');
    self.eStatFrequency      = ko.observable('Monthly');
    self.nickname            = ko.observable('');

    // ── Submission state ──────────────────────────────────
    self.submitted    = ko.observable(false);
    self.submittedMsg = ko.observable('');

    self.open = function (dep, panel) {
      self.selected(dep); self.submitted(false);
      self.closeAllSheets();
      self[panel](true);
    };

    self.closeAllSheets = function () {
      self.showRedeem(false); self.showEditMaturity(false);
      self.showTopUp(false); self.showMore(false);
      self.showDetMore(false); self.showEStatSub(false);
      self.showNickname(false); self.showStatement(false);
      self.submitted(false);
    };

    // keep old name working for back-btn clicks
    self.closeAll = self.closeAllSheets;

    self.confirmRedeem = function () {
      self.submittedMsg('Redemption request submitted. Funds credited within 1 business day.');
      self.submitted(true);
    };
    self.confirmMaturity = function () {
      self.submittedMsg('Maturity instruction updated successfully.');
      self.submitted(true);
    };
    self.confirmTopUp = function () {
      if (!self.topUpAmount()) { window.amanApp && window.amanApp.showToast('Enter top-up amount', 'error'); return; }
      self.submittedMsg('Top-up of ' + fmt(+self.topUpAmount()) + ' initiated. Processed within 24 hours.');
      self.submitted(true); self.topUpAmount('');
    };
    self.requestStatement = function () {
      self.submittedMsg('Statement for "' + self.statementPeriod() + '" sent to your registered email.');
      self.submitted(true);
    };
    self.subscribeEStatement = function () {
      self.submittedMsg('E-statement subscription (' + self.eStatFrequency() + ') activated.');
      self.submitted(true);
    };
    self.saveNickname = function () {
      if (!self.nickname()) { window.amanApp && window.amanApp.showToast('Enter a nickname', 'error'); return; }
      self.submittedMsg('"' + self.nickname() + '" saved as nickname for this deposit.');
      self.submitted(true);
    };
    self.downloadCertificate = function () {
      window.amanApp && window.amanApp.showToast('Profit certificate downloading…', 'success');
      self.showDetMore(false); self.showMore(false);
    };

    self.openOrigination = function () {
      window.dispatchEvent(new CustomEvent('aman-origination', { detail: 'deposit' }));
    };

    self.fmt = fmt;
  }

  return DepositsViewModel;
});
