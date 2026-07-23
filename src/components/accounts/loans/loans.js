define(['knockout'], function (ko) {
  'use strict';

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url); document.head.appendChild(l);
    }
  }

  var LOANS = [
    {
      id: 1, name: 'Personal Finance', type: 'personal',
      ref: 'LN-00412-PF-001', disbursed: 'Jan 2022', disbursedFull: '10 Jan 2022', status: 'Active',
      outstanding: 85000, original: 200000, rate: 3.99, emi: 2140,
      repaidPct: 57, repaidLabel: '57% · 20 of 36 months',
      nextDue: '01 Aug 2026', tenure: '36 months', branch: 'Tripoli Main Branch',
      disbursementAccount: 'Current Account •••• 2341',
      schedule: [
        { month: 'Aug 2026', principal: 1690, interest: 450, balance: 83310 },
        { month: 'Sep 2026', principal: 1696, interest: 444, balance: 81614 },
        { month: 'Oct 2026', principal: 1702, interest: 438, balance: 79912 },
        { month: 'Nov 2026', principal: 1708, interest: 432, balance: 78204 }
      ],
      // OBDX fields
      productName: 'Vehicle/Personal Loans', nickname: 'Not Assigned',
      maturityDate: '01 Jan 2025', repaidAmount: 115000, repaymentMode: 'Account',
      totalInstallments: 36, remainingInstallments: 16,
      nextInstallmentDate: '01 Aug 2026', nextInstallmentAmount: 2140,
      principalFrequency: 'Monthly', interestFrequency: 'Monthly',
      principalArrears: 0, interestArrears: 0,
      latePaymentCharges: 0, otherFees: 0,
      openingDate: '10 Jan 2022', sanctionedAmount: 200000, totalDisbursed: 200000,
      loanTenure: '36 months 0 days', interestRate: 3.99,
      latePaymentPenalty: '0.0%', prepaymentPenalty: '1.25%',
      primaryHolder: 'Ahmed Al-Mansouri'
    },
    {
      id: 2, name: 'Home Finance', type: 'home',
      ref: 'LN-00412-HF-001', disbursed: 'Mar 2020', disbursedFull: '15 Mar 2020', status: 'Active',
      outstanding: 100000, original: 450000, rate: 2.75, emi: 1100,
      repaidPct: 38, repaidLabel: '38% · 62 of 180 months',
      nextDue: '05 Aug 2026', tenure: '180 months', branch: 'Tripoli Main Branch',
      disbursementAccount: 'Savings Account •••• 7312',
      schedule: [
        { month: 'Aug 2026', principal: 871, interest: 229, balance: 99129 },
        { month: 'Sep 2026', principal: 873, interest: 227, balance: 98256 },
        { month: 'Oct 2026', principal: 875, interest: 225, balance: 97381 },
        { month: 'Nov 2026', principal: 877, interest: 223, balance: 96504 }
      ],
      productName: 'Home Finance', nickname: 'Not Assigned',
      maturityDate: '15 Mar 2035', repaidAmount: 350000, repaymentMode: 'Account',
      totalInstallments: 180, remainingInstallments: 118,
      nextInstallmentDate: '05 Aug 2026', nextInstallmentAmount: 1100,
      principalFrequency: 'Monthly', interestFrequency: 'Monthly',
      principalArrears: 0, interestArrears: 0,
      latePaymentCharges: 0, otherFees: 0,
      openingDate: '15 Mar 2020', sanctionedAmount: 450000, totalDisbursed: 450000,
      loanTenure: '180 months 0 days', interestRate: 2.75,
      latePaymentPenalty: '0.0%', prepaymentPenalty: '2.00%',
      primaryHolder: 'Ahmed Al-Mansouri'
    }
  ];

  function fmt(n) { return 'LYD ' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}); }

  function LoansViewModel(Context) {
    var self = this;
    _loadCss('/components/accounts/loans/loans.css');

    self.loans   = ko.observableArray(LOANS);
    self.selected = ko.observable(null);

    // ── Loan Detail panel ─────────────────────────────────
    self.loanDetail    = ko.observable(false);
    self.loanDetailTab = ko.observable('details');
    self.openLoanDetail = function (loan) {
      self.selected(loan); self.loanDetailTab('details');
      self.submitted(false); self.loanDetail(true);
    };
    self.closeLoanDetail = function () { self.loanDetail(false); self.closeAllSheets(); };

    // ── List action panel flags ───────────────────────────
    self.showDetails   = ko.observable(false);
    self.showSchedule  = ko.observable(false);
    self.showStatement = ko.observable(false);
    self.showPayment   = ko.observable(false);

    // ── Detail-screen sheet flags ─────────────────────────
    self.showLoanMore      = ko.observable(false);
    self.showLoanNickname  = ko.observable(false);
    self.showLoanEStatSub  = ko.observable(false);
    self.showDisbInquiry   = ko.observable(false);
    self.showInstCalc      = ko.observable(false);
    self.showEligCalc      = ko.observable(false);
    self.showDetSchedule   = ko.observable(false); // schedule from detail screen

    // ── Form fields ───────────────────────────────────────
    self.statementPeriod  = ko.observable('Last 3 months');
    self.payAmount        = ko.observable('');
    self.eStatFrequency   = ko.observable('Monthly');
    self.loanNickname     = ko.observable('');
    self.instCalcAmount   = ko.observable('');
    self.instCalcTenure   = ko.observable('12');
    self.instCalcRate     = ko.observable('3.99');
    self.instCalcResult   = ko.observable(null);
    self.eligIncome       = ko.observable('');
    self.eligObligation   = ko.observable('0');
    self.eligResult       = ko.observable(null);

    // ── Submission state ──────────────────────────────────
    self.submitted    = ko.observable(false);
    self.submittedMsg = ko.observable('');

    self.open = function (loan, panel) {
      self.selected(loan); self.submitted(false);
      self.closeAllSheets();
      self[panel](true);
    };

    self.closeAllSheets = function () {
      self.showDetails(false); self.showSchedule(false);
      self.showStatement(false); self.showPayment(false);
      self.showLoanMore(false); self.showLoanNickname(false);
      self.showLoanEStatSub(false); self.showDisbInquiry(false);
      self.showInstCalc(false); self.showEligCalc(false);
      self.showDetSchedule(false);
      self.submitted(false);
    };

    self.closeAll = self.closeAllSheets;

    self.requestStatement = function () {
      self.submittedMsg('Loan statement for "' + self.statementPeriod() + '" sent to your registered email.');
      self.submitted(true);
    };
    self.makePayment = function () {
      var amt = +self.payAmount() || (self.selected() ? self.selected().emi : 0);
      self.submittedMsg('Payment of ' + fmt(amt) + ' initiated. Ref: PAY-' + Math.floor(100000 + Math.random()*900000));
      self.submitted(true); self.payAmount('');
    };
    self.subscribeEStatement = function () {
      self.submittedMsg('E-statement subscription (' + self.eStatFrequency() + ') activated for this loan.');
      self.submitted(true);
    };
    self.saveLoanNickname = function () {
      if (!self.loanNickname()) { window.amanApp && window.amanApp.showToast('Enter a nickname', 'error'); return; }
      self.submittedMsg('"' + self.loanNickname() + '" saved as nickname for this finance account.');
      self.submitted(true);
    };

    // Installment calculator
    self.calcInstallment = function () {
      var p = +self.instCalcAmount();
      var n = +self.instCalcTenure();
      var r = +self.instCalcRate() / 100 / 12;
      if (!p || !n || !r) { window.amanApp && window.amanApp.showToast('Please fill all fields', 'error'); return; }
      var emi = p * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1);
      self.instCalcResult({ emi: fmt(Math.round(emi)), total: fmt(Math.round(emi*n)), profit: fmt(Math.round(emi*n - p)) });
    };

    // Eligibility calculator
    self.calcEligibility = function () {
      var income = +self.eligIncome();
      var oblig  = +self.eligObligation();
      if (!income) { window.amanApp && window.amanApp.showToast('Enter monthly income', 'error'); return; }
      var dsr    = 0.40; // 40% debt-service ratio
      var avail  = income * dsr - oblig;
      if (avail <= 0) { self.eligResult({ eligible: false, msg: 'Existing obligations exceed the eligible threshold.' }); return; }
      // Assume 36-month tenure at current rate for max loan
      var r = 3.99 / 100 / 12;
      var n = 36;
      var maxLoan = avail * (Math.pow(1+r,n) - 1) / (r * Math.pow(1+r,n));
      self.eligResult({ eligible: true, maxLoan: fmt(Math.round(maxLoan)), availEmi: fmt(Math.round(avail)) });
    };

    self.openOrigination = function () {
      window.dispatchEvent(new CustomEvent('aman-origination', { detail: 'loan' }));
    };

    self.fmt = fmt;
  }

  return LoansViewModel;
});
