define([
  'ojs/ojcomposite',
  'text!./loan-elig-calc.html',
  './loan-elig-calc'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-elig-calc', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-elig-calc',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
