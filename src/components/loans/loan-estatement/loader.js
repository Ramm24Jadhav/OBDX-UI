define([
  'ojs/ojcomposite',
  'text!./loan-estatement.html',
  './loan-estatement'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-estatement', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-estatement',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
