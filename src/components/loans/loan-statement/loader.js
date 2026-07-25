define([
  'ojs/ojcomposite',
  'text!./loan-statement.html',
  './loan-statement'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-statement', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-statement',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
