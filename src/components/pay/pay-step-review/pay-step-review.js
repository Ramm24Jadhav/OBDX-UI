define([
  'knockout',
  'shared-components/utils',
  'ojL10n!components/pay/nls/strings',
  'text!partials/transfer_review.html'
], function (ko, utils, nls, reviewPartialHtml) {
  'use strict';

  // Register the partial as a named KO template once
  if (!document.getElementById('tpl-transfer-review')) {
    var s = document.createElement('script');
    s.type = 'text/html';
    s.id   = 'tpl-transfer-review';
    s.text = reviewPartialHtml;
    document.head.appendChild(s);
  }

  function PayStepReviewViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    var self = this;

    self.nls            = nls;
    self.showStep3      = p.showStep3;
    self.selectedBen    = p.selectedBen;
    self.selectedAccount= p.selectedAccount;
    self.amount         = p.amount;
    self.purpose        = p.purpose;
    self.scheduleEnabled= p.scheduleEnabled;
    self.scheduledDate  = p.scheduledDate;
    self.isLoading      = p.isLoading;
    self.formatAmount   = p.formatAmount;
    self.confirmTransfer= p.confirmTransfer;

    utils.loadCss('/components/pay/pay-step-review/pay-step-review.css');

    // ── Review data contract ──────────────────────────────────────

    self.reviewHero = ko.computed(function () {
      return {
        amount:        self.formatAmount(parseFloat(self.amount()) || 0),
        recipientName: self.selectedBen() ? self.selectedBen().name : ''
      };
    });

    self.reviewRows = ko.computed(function () {
      return [
        { label: nls.lbl_to,           value: self.selectedBen() ? self.selectedBen().name : '' },
        { label: nls.pay_account_no,   value: self.selectedBen() ? self.selectedBen().accountNo : '' },
        { label: nls.lbl_from,         value: self.selectedAccount() ? self.selectedAccount().typeLabel : '' },
        { label: nls.pay_purpose,      value: self.purpose() || 'General Transfer' },
        { label: nls.pay_schedule_date, value: self.scheduleEnabled() && self.scheduledDate() ? self.scheduledDate() : 'Today' }
      ];
    });

    self.reviewCharges = ko.computed(function () {
      var amt = self.formatAmount(parseFloat(self.amount()) || 0);
      return [
        { label: nls.pay_transfer_amount, value: 'LYD ' + amt, isTotal: false, isFree: false },
        { label: nls.pay_service_charges, value: 'LYD 0.00',   isTotal: false, isFree: true  },
        { label: nls.pay_total_debit,     value: 'LYD ' + amt, isTotal: true,  isFree: false }
      ];
    });
  }

  return PayStepReviewViewModel;
});
