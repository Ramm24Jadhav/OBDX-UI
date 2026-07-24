define([
  'ojs/ojcomposite',
  'text!./loan-inst-calc.html',
  './loan-inst-calc'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-inst-calc', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-inst-calc',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
