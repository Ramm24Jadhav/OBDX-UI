define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  var LOANS = [
    {
      id: 1, name: 'Personal Finance', type: 'personal',
      ref: 'LN-00412-PF-001', disbursed: 'Jan 2022', disbursedFull: '10 Jan 2022', status: 'Active',
      outstanding: 85000, original: 200000, rate: 3.99, emi: 2140,
      repaidPct: 57, repaidLabel: '57% · 20 of 36 months',
      nextDue: '01 Aug 2026', tenure: '36 months', branch: 'Tripoli Main Branch',
      disbursementAccount: 'Current Account •••• 2341',
      schedule: [
        { no: 21, month: 'Aug 2026', principal: 1690, interest: 450, charges: 0, unpaid: 0, balance: 83310 },
        { no: 22, month: 'Sep 2026', principal: 1696, interest: 444, charges: 0, unpaid: 0, balance: 81614 },
        { no: 23, month: 'Oct 2026', principal: 1702, interest: 438, charges: 0, unpaid: 0, balance: 79912 },
        { no: 24, month: 'Nov 2026', principal: 1708, interest: 432, charges: 0, unpaid: 0, balance: 78204 },
        { no: 25, month: 'Dec 2026', principal: 1714, interest: 426, charges: 0, unpaid: 0, balance: 76490 },
        { no: 26, month: 'Jan 2027', principal: 1720, interest: 420, charges: 0, unpaid: 0, balance: 74770 },
        { no: 27, month: 'Feb 2027', principal: 1726, interest: 414, charges: 0, unpaid: 0, balance: 73044 },
        { no: 28, month: 'Mar 2027', principal: 1733, interest: 407, charges: 0, unpaid: 0, balance: 71311 },
        { no: 29, month: 'Apr 2027', principal: 1739, interest: 401, charges: 0, unpaid: 0, balance: 69572 },
        { no: 30, month: 'May 2027', principal: 1746, interest: 394, charges: 0, unpaid: 0, balance: 67826 },
        { no: 31, month: 'Jun 2027', principal: 1752, interest: 388, charges: 0, unpaid: 0, balance: 66074 },
        { no: 32, month: 'Jul 2027', principal: 1759, interest: 381, charges: 0, unpaid: 0, balance: 64315 },
        { no: 33, month: 'Aug 2027', principal: 1765, interest: 375, charges: 0, unpaid: 0, balance: 62550 },
        { no: 34, month: 'Sep 2027', principal: 1772, interest: 368, charges: 0, unpaid: 0, balance: 60778 },
        { no: 35, month: 'Oct 2027', principal: 1779, interest: 361, charges: 0, unpaid: 0, balance: 58999 },
        { no: 36, month: 'Nov 2027', principal: 58999, interest: 246, charges: 0, unpaid: 0, balance: 0 }
      ],
      settlementPrincipal: 85000, settlementInterest: 1420, settlementCharges: 1063,
      rateRevisions: [{ date: '10 Jan 2022', rate: 3.99 }],
      productName: 'Vehicle/Personal Loans', nickname: 'Not Assigned',
      maturityDate: '01 Nov 2027', repaidAmount: 115000, repaymentMode: 'Account',
      totalInstallments: 36, remainingInstallments: 16,
      nextInstallmentDate: '01 Aug 2026', nextInstallmentAmount: 2140,
      principalFrequency: 'Monthly', interestFrequency: 'Monthly',
      principalArrears: 0, interestArrears: 0,
      latePaymentCharges: 0, otherFees: 0,
      openingDate: '10 Jan 2022', sanctionedAmount: 200000, totalDisbursed: 200000,
      loanTenure: '36 months 0 days', interestRate: 3.99,
      latePaymentPenalty: '0.0%', prepaymentPenalty: '1.25%',
      primaryHolder: 'Ahmed Al-Mansouri',
      transactions: [
        { date: '01 Jul 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260701-001', amount: 2140 },
        { date: '01 Jun 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260601-001', amount: 2140 },
        { date: '01 May 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260501-001', amount: 2140 },
        { date: '01 Apr 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260401-001', amount: 2140 },
        { date: '01 Mar 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260301-001', amount: 2140 },
        { date: '01 Feb 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260201-001', amount: 2140 }
      ]
    },
    {
      id: 2, name: 'Home Finance', type: 'home',
      ref: 'LN-00412-HF-001', disbursed: 'Mar 2020', disbursedFull: '15 Mar 2020', status: 'Active',
      outstanding: 100000, original: 450000, rate: 2.75, emi: 1100,
      repaidPct: 38, repaidLabel: '38% · 62 of 180 months',
      nextDue: '05 Aug 2026', tenure: '180 months', branch: 'Tripoli Main Branch',
      disbursementAccount: 'Savings Account •••• 7312',
      schedule: [
        { no: 63, month: 'Aug 2026', principal: 871, interest: 229, charges: 0, unpaid: 0, balance: 99129 },
        { no: 64, month: 'Sep 2026', principal: 873, interest: 227, charges: 0, unpaid: 0, balance: 98256 },
        { no: 65, month: 'Oct 2026', principal: 875, interest: 225, charges: 0, unpaid: 0, balance: 97381 },
        { no: 66, month: 'Nov 2026', principal: 877, interest: 223, charges: 0, unpaid: 0, balance: 96504 },
        { no: 67, month: 'Dec 2026', principal: 879, interest: 221, charges: 0, unpaid: 0, balance: 95625 },
        { no: 68, month: 'Jan 2027', principal: 881, interest: 219, charges: 0, unpaid: 0, balance: 94744 },
        { no: 69, month: 'Feb 2027', principal: 883, interest: 217, charges: 0, unpaid: 0, balance: 93861 },
        { no: 70, month: 'Mar 2027', principal: 885, interest: 215, charges: 0, unpaid: 0, balance: 92976 },
        { no: 71, month: 'Apr 2027', principal: 887, interest: 213, charges: 0, unpaid: 0, balance: 92089 },
        { no: 72, month: 'May 2027', principal: 889, interest: 211, charges: 0, unpaid: 0, balance: 91200 },
        { no: 73, month: 'Jun 2027', principal: 892, interest: 208, charges: 0, unpaid: 0, balance: 90308 },
        { no: 74, month: 'Jul 2027', principal: 894, interest: 206, charges: 0, unpaid: 0, balance: 89414 }
      ],
      settlementPrincipal: 100000, settlementInterest: 2750, settlementCharges: 2000,
      rateRevisions: [{ date: '15 Mar 2020', rate: 3.00 }, { date: '01 Jan 2022', rate: 2.75 }],
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
      primaryHolder: 'Ahmed Al-Mansouri',
      transactions: [
        { date: '05 Jul 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260705-002', amount: 1100 },
        { date: '05 Jun 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260605-002', amount: 1100 },
        { date: '05 May 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260505-002', amount: 1100 },
        { date: '05 Apr 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260405-002', amount: 1100 },
        { date: '05 Mar 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260305-002', amount: 1100 },
        { date: '05 Feb 2026', description: 'Monthly EMI', type: 'Debit', ref: 'TXN-20260205-002', amount: 1100 }
      ]
    }
  ];

  var fmt = utils.fmt;

  function LoansViewModel(Context) {
    var self = this;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');

    self.loans    = ko.observableArray(LOANS);
    self.selected = ko.observable(null);

    // ── Detail panel ──────────────────────────────────────
    self.loanDetail = ko.observable(false);
    self.openLoanDetail = function (loan) {
      self.selected(loan);
      self.submitted(false);
      self.loanDetail(true);
    };
    self.closeLoanDetail = function () {
      self.loanDetail(false);
      self.picker.open(false);
    };

    // ── List-level panel flags ────────────────────────────
    self.showDetails   = ko.observable(false);
    self.showSchedule  = ko.observable(false);
    self.showStatement = ko.observable(false);
    self.showPayment   = ko.observable(false);

    self.open = function (loan, panel) {
      self.selected(loan);
      self.submitted(false);
      self.showDetails(false);
      self.showSchedule(false);
      self.showStatement(false);
      self.showPayment(false);
      self[panel](true);
    };

    // ── List-level form fields ────────────────────────────
    self.statementPeriod     = ko.observable('Last 3 months');
    self.statementFormat     = ko.observable('PDF');
    self.payAmount           = ko.observable('');
    var PAY_ACCOUNTS = [
      { type: 'Current Account', number: '•••• 2341', nickname: 'Primary', balance: 24750 },
      { type: 'Savings Account', number: '•••• 7312', nickname: null,       balance: 8920  }
    ];
    self.payAccounts         = ko.observableArray(PAY_ACCOUNTS);
    self.paymentType         = ko.observable('Regular EMI');
    self.deductFrom          = ko.observable(PAY_ACCOUNTS[0]);
    self.settlementBreakdown = ko.observable(null);

    // ── Submission state ──────────────────────────────────
    self.submitted    = ko.observable(false);
    self.submittedMsg = ko.observable('');

    self.requestStatement = function () {
      self.submittedMsg('Loan statement for "' + self.statementPeriod() + '" sent to your registered email.');
      self.submitted(true);
    };

    self.makePayment = function () {
      var loan = self.selected();
      var type = self.paymentType();
      var amt;
      if (type === 'Full Settlement' && loan) {
        amt = (loan.settlementPrincipal || 0) + (loan.settlementInterest || 0) + (loan.settlementCharges || 0);
      } else {
        amt = +self.payAmount() || (loan ? loan.emi : 0);
      }
      self.submittedMsg('Payment of ' + fmt(amt) + ' initiated. Ref: PAY-' + Math.floor(100000 + Math.random() * 900000));
      self.submitted(true);
      self.payAmount('');
      self.settlementBreakdown(null);
    };

    self.onPaymentTypeSelect = function (v) {
      if (v === 'Full Settlement' && self.selected()) {
        var loan = self.selected();
        self.settlementBreakdown({
          principal: fmt(loan.settlementPrincipal || 0),
          interest:  fmt(loan.settlementInterest  || 0),
          charges:   fmt(loan.settlementCharges   || 0),
          total:     fmt((loan.settlementPrincipal || 0) + (loan.settlementInterest || 0) + (loan.settlementCharges || 0))
        });
      } else {
        self.settlementBreakdown(null);
      }
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
      window.dispatchEvent(new CustomEvent('app-origination', { detail: 'loan' }));
    };

    self.fmt    = fmt;
    self.fmtNum = function (n) {
      return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    ko.computed(function () {
      var any = self.showDetails() || self.showSchedule() || self.showStatement() ||
                self.showPayment() || self.loanDetail() || self.picker.open();
      window.obdxApp && window.obdxApp.setPanelOpen(any);
    }).extend({ deferred: true });
  }

  return LoansViewModel;
});
