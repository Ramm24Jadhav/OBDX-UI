define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  function TrackingViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.applications = ko.observableArray([
      {
        title: 'Home Finance Application',
        ref: 'HF-2026-00712',
        status: 'In Review',
        statusClass: 'pill pill-warning',
        steps: [
          { label: 'Application Submitted', date: '15 Jun 2026', state: 'done' },
          { label: 'Document Verified',     date: '18 Jun 2026', state: 'done' },
          { label: 'Credit Assessment',     date: 'In Progress', state: 'active' },
          { label: 'Final Approval',        date: 'Pending',     state: '' },
          { label: 'Disbursement',          date: 'Pending',     state: '' }
        ],
        note: 'Your application is under credit assessment. Expected completion in 3–5 business days.'
      }
    ]);

    self.contactOfficer = function () {
      window.obdxApp && window.obdxApp.showToast('Contacting assigned officer…', 'info');
    };

    self.stepClass = function (step) {
      return 'track-step' + (step.state ? ' track-step--' + step.state : '');
    };
  }

  return TrackingViewModel;
});
