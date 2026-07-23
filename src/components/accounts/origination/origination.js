define(['knockout'], function (ko) {
  'use strict';

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  var PRODUCTS = {
    account: [
      { id: 'current',  label: 'Current Account', bg: '#DBEAFE', stroke: '#2563EB', desc: 'No minimum balance · Free debit card · Online banking' },
      { id: 'savings',  label: 'Savings Account',  bg: '#DCFCE7', stroke: '#16A34A', desc: '2.75% profit rate · Free transfers · Zakat calculation' }
    ],
    deposit: [
      { id: 'fixed12',  label: '12-Month Fixed',   bg: '#EDE9FE', stroke: '#7C3AED', desc: '5.00% p.a. · Auto-renew available · Monthly profit',     rate: 5.00 },
      { id: 'fixed6',   label: '6-Month Fixed',    bg: '#EDE9FE', stroke: '#7C3AED', desc: '4.75% p.a. · Flexible redemption · Profit on maturity',  rate: 4.75 },
      { id: 'flexible', label: 'Flexible Deposit', bg: '#FEF3C7', stroke: '#D97706', desc: '3.50% p.a. · Withdraw anytime · No lock-in period',        rate: 3.50 }
    ],
    loan: [
      { id: 'personal', label: 'Personal Finance', bg: '#FCE7EE', stroke: '#7A1531', desc: 'Up to LYD 500,000 · Rate from 3.99% · 60 months' },
      { id: 'home',     label: 'Home Finance',     bg: '#DBEAFE', stroke: '#2563EB', desc: 'Up to LYD 2,000,000 · Rate from 2.75% · 300 months' },
      { id: 'auto',     label: 'Auto Finance',     bg: '#DCFCE7', stroke: '#16A34A', desc: 'Up to LYD 200,000 · Rate from 3.25% · 60 months' }
    ]
  };

  var TENURE_MONTHS = { '3 months': 3, '6 months': 6, '12 months': 12, '24 months': 24 };

  function fmt(n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function OriginationViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    _loadCss('/components/accounts/origination/origination.css');

    self.open    = params.open;
    self.close   = params.close;
    self.context = params.context;

    self.step      = ko.observable(1);
    self.submitted = ko.observable(false);
    self.refNo     = ko.observable('');

    self.products = ko.computed(function () { return PRODUCTS[self.context()] || PRODUCTS.account; });
    self.selectedProduct = ko.observable(null);

    // ── Step 1: plan dropdown ──
    self.planDropdownOpen = ko.observable(false);
    self.togglePlanDropdown = function () {
      var next = !self.planDropdownOpen();
      self.sourceDropdownOpen(false);
      self.payToOwnDropdownOpen && self.payToOwnDropdownOpen(false);
      self.nomineeDropdownOpen && self.nomineeDropdownOpen(false);
      self.planDropdownOpen(next);
    };
    self.selectPlan = function (p) { self.selectedProduct(p); self.planDropdownOpen(false); };

    self.context.subscribe(function () {
      self.step(1); self.submitted(false);
      self.planDropdownOpen(false);
      var list = PRODUCTS[self.context()] || [];
      self.selectedProduct(list[0] || null);
      self.detailTenure('');
      if (self.maturityInstruction) self.maturityInstruction('Close on Maturity');
    });

    // detail fields
    self.detailAmount  = ko.observable('');
    self.detailTenure  = ko.observable('');
    self.detailPurpose = ko.observable('');
    self.detailBranch  = ko.observable('Main Branch');

    // ── Step 2: source account dropdown ──
    self.sourceAccounts     = ['Current Account •••• 2341', 'Savings Account •••• 7312'];
    self.sourceAccount      = ko.observable('Current Account •••• 2341');
    self.sourceDropdownOpen = ko.observable(false);
    self.toggleSourceDropdown = function () {
      var next = !self.sourceDropdownOpen();
      self.planDropdownOpen(false);
      self.payToOwnDropdownOpen && self.payToOwnDropdownOpen(false);
      self.nomineeDropdownOpen && self.nomineeDropdownOpen(false);
      self.sourceDropdownOpen(next);
    };
    self.selectSourceAccDD    = function (a) { self.sourceAccount(a); self.sourceDropdownOpen(false); };

    // ── Step 2: maturity calculator ──
    self.maturityCalc = ko.computed(function () {
      var amount = parseFloat(self.detailAmount()) || 0;
      var tenure = self.detailTenure();
      var plan   = self.selectedProduct();
      if (!amount || !tenure || !plan || !plan.rate) return null;
      var months = TENURE_MONTHS[tenure] || 0;
      if (!months) return null;
      var interest = amount * (plan.rate / 100) * (months / 12);
      return { maturity: fmt(amount + interest), interest: fmt(interest), rate: plan.rate };
    });

    self.bestReturnTip = ko.computed(function () {
      var amount = parseFloat(self.detailAmount()) || 0;
      var plan   = self.selectedProduct();
      if (!amount || !plan || !plan.rate) return null;
      var tenures = Object.keys(TENURE_MONTHS);
      var best = tenures.reduce(function (a, b) {
        return TENURE_MONTHS[a] >= TENURE_MONTHS[b] ? a : b;
      });
      if (self.detailTenure() === best) return null;
      var bestInterest = fmt(amount * (plan.rate / 100) * (TENURE_MONTHS[best] / 12));
      return { tenure: best, interest: bestInterest };
    });

    self.selectTenure = function (t) { self.detailTenure(t); };

    // ── Step 3: maturity instruction ──
    self.maturityInstruction = ko.observable('Close on Maturity');
    self.maturityOptions = [
      'Close on Maturity',
      'Renew Principal and Interest',
      'Renew Principal and Pay Out Interest',
      'Renew Special Amount and Pay Out Remaining'
    ];
    self.rolloverAmount = ko.observable('');
    self.payToMode      = ko.observable('Own Accounts');
    self.payToOptions   = ['Own Accounts', 'Internal Bank Account'];
    self.showRollover   = ko.computed(function () { return self.maturityInstruction() === 'Renew Special Amount and Pay Out Remaining'; });
    self.showPayTo      = ko.computed(function () {
      var m = self.maturityInstruction();
      return m !== 'Close on Maturity' && m !== 'Renew Principal and Interest';
    });

    // Pay To — Own Accounts picker
    self.payToOwnAccounts     = ['Current Account •••• 2341', 'Savings Account •••• 7312'];
    self.payToOwnAccount      = ko.observable('');
    self.payToOwnDropdownOpen = ko.observable(false);
    self.togglePayToOwnDropdown = function () { self.payToOwnDropdownOpen(!self.payToOwnDropdownOpen()); };
    self.selectPayToOwnAcc     = function (a) { self.payToOwnAccount(a); self.payToOwnDropdownOpen(false); };

    // Pay To — Internal Bank Account
    self.payToInternalAccNo      = ko.observable('');
    self.payToInternalAccHolder  = ko.observable('');
    self.payToInternalBankName   = ko.observable('');

    // ── Step 4: nominee details ──
    self.addNominee          = ko.observable('No');
    self.nominationType      = ko.observable('Add New');
    self.nomineeName         = ko.observable('');
    self.nomineeDOB          = ko.observable('');
    self.nomineeRelationship = ko.observable('');
    self.nomineeAddress      = ko.observable('');
    self.nomineeCountry      = ko.observable('');
    self.nomineeState        = ko.observable('');
    self.nomineeCity         = ko.observable('');
    self.nomineeZip          = ko.observable('');
    self.guardianName        = ko.observable('');
    self.guardianAddress     = ko.observable('');
    self.guardianCountry     = ko.observable('');
    self.guardianState       = ko.observable('');
    self.guardianCity        = ko.observable('');
    self.guardianZip         = ko.observable('');
    self.isMinor = ko.computed(function () {
      var dob = self.nomineeDOB();
      if (!dob) return false;
      return (new Date() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25) < 18;
    });

    self.existingNominees = [
      { name: 'Sara Al-Mansouri',   accountType: 'Savings Account', accountNo: '•••• 7312' },
      { name: 'Khalid Al-Rashidi', accountType: 'Current Account', accountNo: '•••• 2341' },
      { name: 'Fatima Al-Zahra',   accountType: 'Savings Account', accountNo: '•••• 9104' },
      { name: 'Omar Al-Bakri',     accountType: 'Current Account', accountNo: '•••• 3387' }
    ];
    self.selectedExistingNominee  = ko.observable(null);
    self.nomineeDropdownOpen      = ko.observable(false);
    self.toggleNomineeDropdown    = function () { self.nomineeDropdownOpen(!self.nomineeDropdownOpen()); };
    self.selectExistingNomineeDD  = function (n) {
      self.selectedExistingNominee(n);
      self.nomineeName(n.name);
      self.nomineeDropdownOpen(false);
    };

    // ── General ──
    self.headingMap = { account: 'Open Account', deposit: 'Open Deposit', loan: 'Apply for Loan' };
    self.heading    = ko.computed(function () { return self.headingMap[self.context()] || 'New Application'; });
    self.step1Label = ko.computed(function () {
      return { account: 'Account Type', deposit: 'Deposit Plan', loan: 'Finance Type' }[self.context()] || 'Product';
    });

    self.tenureOptions = ko.computed(function () {
      if (self.context() === 'loan') return ['12 months','24 months','36 months','48 months','60 months'];
      return ['3 months','6 months','12 months','24 months'];
    });

    self.selectProduct = function (p) { self.selectedProduct(p); };
    self.isSelected    = function (p) { return self.selectedProduct() && self.selectedProduct().id === p.id; };

    self.goStep        = function (n) { self.step(n); };
    self.nextFromStep2 = function () { self.step(3); };

    self.submit = function () {
      self.refNo('AMN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000));
      self.submitted(true);
    };

    self.done = function () {
      self.close(); self.step(1); self.submitted(false);
      self.detailAmount(''); self.detailTenure(''); self.detailPurpose('');
      self.selectedProduct(PRODUCTS[self.context()][0] || null);
    };

    // init
    self.selectedProduct(PRODUCTS[self.context()][0] || null);
  }

  return OriginationViewModel;
});
