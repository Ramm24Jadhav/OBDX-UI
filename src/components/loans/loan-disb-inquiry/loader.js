define([
  'ojs/ojcomposite',
  'text!./loan-disb-inquiry.html',
  './loan-disb-inquiry'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-disb-inquiry', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-disb-inquiry',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
