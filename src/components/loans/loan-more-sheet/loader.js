define([
  'ojs/ojcomposite',
  'text!./loan-more-sheet.html',
  './loan-more-sheet'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-more-sheet', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-more-sheet',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
