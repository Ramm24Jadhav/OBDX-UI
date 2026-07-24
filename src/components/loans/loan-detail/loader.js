define([
  'ojs/ojcomposite',
  'text!./loan-detail.html',
  './loan-detail',
  'loan-components/loan-detail-more/loader',
  'loan-components/loan-disb-inquiry/loader',
  'loan-components/loan-det-schedule/loader',
  'loan-components/loan-inst-calc/loader',
  'loan-components/loan-elig-calc/loader',
  'loan-components/loan-estatement/loader',
  'loan-components/loan-nickname/loader'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-detail', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-detail',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
