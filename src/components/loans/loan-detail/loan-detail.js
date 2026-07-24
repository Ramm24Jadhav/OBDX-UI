define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';
  function LoanDetailViewModel(context) {
    var self = this;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/loans/loans.css');

    // Delegated to LoansViewModel
    self.open       = p.loanDetail;
    self.loan       = p.selected;
    self.fmt        = p.fmt;
    self.fmtNum     = p.fmtNum;
    self.openPicker = p.openPicker;
    self.onClose    = p.closeLoanDetail;
    self.onPayNow   = function () { var loan = p.selected(); p.closeLoanDetail(); p.open(loan, 'showPayment'); };

    // Own state
    self.activeTab       = ko.observable('details');
    self.showMore        = ko.observable(false);
    self.showDisbInquiry = ko.observable(false);
    self.showDetSchedule = ko.observable(false);
    self.showInstCalc    = ko.observable(false);
    self.showEligCalc    = ko.observable(false);
    self.showEStatSub    = ko.observable(false);
    self.showNickname    = ko.observable(false);
    self.submitted       = ko.observable(false);
    self.submittedMsg    = ko.observable('');
    self.statementPeriod = ko.observable('Last 3 months');
    self.statementFormat = ko.observable('PDF');
    self.eStatFrequency  = ko.observable('Monthly');
    self.eStatFormat     = ko.observable('PDF');
    self.loanNickname    = ko.observable('');
    self.instCalcAmount  = ko.observable('');
    self.instCalcTenure  = ko.observable('');
    self.instCalcRate    = ko.observable('');
    self.instCalcResult  = ko.observable(null);
    self.eligIncome      = ko.observable('');
    self.eligObligation  = ko.observable('');
    self.eligTenure      = ko.observable('');
    self.eligRate        = ko.observable('');
    self.eligResult      = ko.observable(null);

    self.requestStatement = function () {
      self.submitted(true);
      self.submittedMsg('Your statement for ' + self.statementPeriod() + ' has been sent to your registered email.');
    };
    self.subscribeEStatement = function () {
      self.submitted(true);
      self.submittedMsg('You have subscribed to ' + self.eStatFrequency() + ' e-statements in ' + self.eStatFormat() + ' format.');
    };
    self.saveLoanNickname = function () {
      var loan = self.loan(); if (loan && self.loanNickname()) { loan.nickname = self.loanNickname(); }
      self.submitted(true);
      self.submittedMsg('Nickname "' + self.loanNickname() + '" has been saved successfully.');
    };
    self.calcInstallment = function () {
      var amt = parseFloat(self.instCalcAmount()) || 0, n = parseFloat(self.instCalcTenure()) || 1, r = (parseFloat(self.instCalcRate()) || 0) / 100 / 12;
      var emi = r ? Math.round(amt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)) : Math.round(amt / n);
      self.instCalcResult({ emi: emi, total: Math.round(emi * n), profit: Math.round(emi * n - amt) });
    };
    self.calcEligibility = function () {
      var income = parseFloat(self.eligIncome()) || 0, obligation = parseFloat(self.eligObligation()) || 0;
      var tenure = parseFloat(self.eligTenure()) || 1, rate = (parseFloat(self.eligRate()) || 0) / 100 / 12;
      var disposable = income - obligation, eligible = disposable > 0;
      var maxLoan = eligible ? Math.round(disposable * (rate ? (Math.pow(1 + rate, tenure) - 1) / (rate * Math.pow(1 + rate, tenure)) : tenure)) : 0;
      self.eligResult({ eligible: eligible, maxLoan: maxLoan });
    };
  }
  return LoanDetailViewModel;
});
