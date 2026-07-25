define([
  'knockout',
  'shared-components/utils',
  'ojL10n!components/shared/pay_confirmation/nls/strings',
  'services/PaymentService'
], function (ko, utils, nls, PaymentService) {
  'use strict';

  function PayConfirmationViewModel(params) {
    var self = this;
    utils.loadCss('/components/shared/pay_confirmation/pay_confirmation.css');

    self.nls             = nls;
    self.status          = ko.isObservable(params.status)          ? params.status          : ko.observable(params.status || 'success');
    self.referenceNo     = ko.isObservable(params.referenceNo)     ? params.referenceNo     : ko.observable(params.referenceNo || '');
    self.amount          = ko.isObservable(params.amount)          ? params.amount          : ko.observable(params.amount || '0');
    self.selectedBen     = ko.isObservable(params.selectedBen)     ? params.selectedBen     : ko.observable(params.selectedBen || null);
    self.successDateTime = ko.isObservable(params.successDateTime) ? params.successDateTime : ko.observable(params.successDateTime || '');
    self.formatAmount    = params.formatAmount || function (n) { return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    self.onBackToPayments = params.onBackToPayments || function () {};

    var rawType = params.paymentType;
    self.paymentType = ko.isObservable(rawType) ? rawType : ko.observable(rawType || 'within');

    self.isDownloading       = ko.observable(false);
    self.receiptTemplateName = ko.observable(null);

    // ── Status config ────────────────────────────────────────────
    self.statusConfig = ko.computed(function () {
      var configs = {
        success:  { barClass: 'conf-bar--success',  title: nls.conf_success_title,  subtitle: nls.conf_success_sub,  statusLabel: nls.conf_lbl_success,  statusClass: 'conf-detail-status--success'  },
        failure:  { barClass: 'conf-bar--failure',  title: nls.conf_failure_title,  subtitle: nls.conf_failure_sub,  statusLabel: nls.conf_lbl_failure,  statusClass: 'conf-detail-status--failure'  },
        pending:  { barClass: 'conf-bar--pending',  title: nls.conf_pending_title,  subtitle: nls.conf_pending_sub,  statusLabel: nls.conf_lbl_pending,  statusClass: 'conf-detail-status--pending'  },
        rejected: { barClass: 'conf-bar--rejected', title: nls.conf_rejected_title, subtitle: nls.conf_rejected_sub, statusLabel: nls.conf_lbl_rejected, statusClass: 'conf-detail-status--rejected' }
      };
      return configs[self.status()] || configs.success;
    });

    self.formattedAmount = ko.computed(function () {
      return self.formatAmount(parseFloat(self.amount()) || 0);
    });

    self.recipientName = ko.computed(function () {
      return self.selectedBen() ? self.selectedBen().name : '';
    });

    self.isSuccess = ko.computed(function () { return self.status() === 'success'; });

    // ── Receipt partial (lazy) ───────────────────────────────────
    self._loadReceiptPartial = function () {
      var type    = self.paymentType();
      var tplId   = 'tpl-receipt-' + type;
      if (document.getElementById(tplId)) { self.receiptTemplateName(tplId); return; }

      require(['text!partials/receipts/receipt_' + type + '.html'], function (html) {
        var s = document.createElement('script');
        s.type = 'text/html'; s.id = tplId; s.text = html;
        document.head.appendChild(s);
        self.receiptTemplateName(tplId);
      }, function () {
        // Fallback to generic receipt
        var fallbackId = 'tpl-receipt-generic';
        if (document.getElementById(fallbackId)) { self.receiptTemplateName(fallbackId); return; }
        require(['text!partials/receipts/receipt_generic.html'], function (html) {
          var s = document.createElement('script');
          s.type = 'text/html'; s.id = fallbackId; s.text = html;
          document.head.appendChild(s);
          self.receiptTemplateName(fallbackId);
        });
      });
    };

    self.isSuccess.subscribe(function (val) { if (val) { self._loadReceiptPartial(); } });
    if (self.isSuccess()) { self._loadReceiptPartial(); }

    // ── PDF download ─────────────────────────────────────────────
    self.downloadPdf = function () {
      if (self.isDownloading()) { return; }
      self.isDownloading(true);
      window.obdxApp && window.obdxApp.showToast(nls.conf_generating_toast, 'info');

      PaymentService.getReceiptPdf(self.referenceNo())
        .then(function (data) {
          var b64   = data.pdfBase64;
          var raw   = atob(b64);
          var bytes = new Uint8Array(raw.length);
          for (var i = 0; i < raw.length; i++) { bytes[i] = raw.charCodeAt(i); }
          var blob  = new Blob([bytes], { type: 'application/pdf' });
          var url   = URL.createObjectURL(blob);
          var a     = document.createElement('a');
          a.href = url;
          a.download = 'Receipt-' + (self.referenceNo() || 'transfer') + '.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          window.obdxApp && window.obdxApp.showToast(nls.conf_download_success, 'success');
        })
        .catch(function () {
          window.obdxApp && window.obdxApp.showToast(nls.conf_download_error, 'error');
        })
        .then(function () { self.isDownloading(false); }, function () { self.isDownloading(false); });
    };
  }

  return PayConfirmationViewModel;
});
