define([
  'ojs/ojcomposite',
  'text!./loan-make-payment.html',
  './loan-make-payment'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-make-payment', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-make-payment',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
