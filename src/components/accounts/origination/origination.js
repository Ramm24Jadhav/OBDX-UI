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
      { id: 'current',  label: 'Current Account', icon: 'card',    bg: '#DBEAFE', stroke: '#2563EB', desc: 'No minimum balance · Free debit card · Online banking' },
      { id: 'savings',  label: 'Savings Account',  icon: 'savings', bg: '#DCFCE7', stroke: '#16A34A', desc: '2.75% profit rate · Free transfers · Zakat calculation' }
    ],
    deposit: [
      { id: 'fixed12',  label: '12-Month Fixed',   icon: 'lock',    bg: '#EDE9FE', stroke: '#7C3AED', desc: '5.00% p.a. · Auto-renew available · Monthly profit' },
      { id: 'fixed6',   label: '6-Month Fixed',    icon: 'lock',    bg: '#EDE9FE', stroke: '#7C3AED', desc: '4.75% p.a. · Flexible redemption · Profit on maturity' },
      { id: 'flexible', label: 'Flexible Deposit', icon: 'lock',    bg: '#FEF3C7', stroke: '#D97706', desc: '3.50% p.a. · Withdraw anytime · No lock-in period' }
    ],
    loan: [
      { id: 'personal', label: 'Personal Finance',  icon: 'person',  bg: '#FCE7EE', stroke: '#7A1531', desc: 'Up to LYD 500,000 · Rate from 3.99% · 60 months' },
      { id: 'home',     label: 'Home Finance',      icon: 'home',    bg: '#DBEAFE', stroke: '#2563EB', desc: 'Up to LYD 2,000,000 · Rate from 2.75% · 300 months' },
      { id: 'auto',     label: 'Auto Finance',      icon: 'car',     bg: '#DCFCE7', stroke: '#16A34A', desc: 'Up to LYD 200,000 · Rate from 3.25% · 60 months' }
    ]
  };

  function OriginationViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    _loadCss('/components/accounts/origination/origination.css');

    self.open         = params.open;
    self.close        = params.close;
    self.context      = params.context; // 'account' | 'deposit' | 'loan'

    self.step         = ko.observable(1); // 1=select, 2=details, 3=review
    self.submitted    = ko.observable(false);
    self.refNo        = ko.observable('');

    self.products     = ko.computed(function () {
      return PRODUCTS[self.context()] || PRODUCTS.account;
    });

    self.selectedProduct = ko.observable(null);

    // auto-select first product when context changes
    self.context.subscribe(function () {
      self.step(1);
      self.submitted(false);
      var list = PRODUCTS[self.context()] || [];
      self.selectedProduct(list[0] || null);
    });

    // detail fields
    self.detailAmount  = ko.observable('');
    self.detailTenure  = ko.observable('');
    self.detailPurpose = ko.observable('');
    self.detailBranch  = ko.observable('Main Branch');

    self.headingMap = { account: 'Open Account', deposit: 'Open Deposit', loan: 'Apply for Loan' };
    self.heading = ko.computed(function () { return self.headingMap[self.context()] || 'New Application'; });

    self.step1Label = ko.computed(function () {
      var map = { account: 'Account Type', deposit: 'Deposit Plan', loan: 'Finance Type' };
      return map[self.context()] || 'Product';
    });

    self.showAmount  = ko.computed(function () { return self.context() === 'deposit' || self.context() === 'loan'; });
    self.showTenure  = ko.computed(function () { return self.context() === 'deposit' || self.context() === 'loan'; });
    self.showPurpose = ko.computed(function () { return self.context() === 'loan'; });

    self.tenureOptions = ko.computed(function () {
      if (self.context() === 'loan') return ['12 months','24 months','36 months','48 months','60 months'];
      return ['3 months','6 months','12 months','24 months'];
    });

    self.selectProduct = function (p) { self.selectedProduct(p); };
    self.isSelected    = function (p) { return self.selectedProduct() && self.selectedProduct().id === p.id; };

    self.goStep = function (n) { self.step(n); };

    self.submit = function () {
      var ref = 'AMN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      self.refNo(ref);
      self.submitted(true);
    };

    self.done = function () {
      self.close();
      self.step(1);
      self.submitted(false);
      self.detailAmount('');
      self.detailTenure('');
      self.detailPurpose('');
      var list = PRODUCTS[self.context()] || [];
      self.selectedProduct(list[0] || null);
    };

    // init
    var list = PRODUCTS[self.context()] || [];
    self.selectedProduct(list[0] || null);
  }

  return OriginationViewModel;
});
