define([
  'ojs/ojcomposite',
  'text!./loan-list.html',
  './loan-list'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-list', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-list',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
