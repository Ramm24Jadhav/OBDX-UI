define([
  'ojs/ojcomposite',
  'text!./deposit-more-sheet.html',
  './deposit-more-sheet'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-more-sheet', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-more-sheet',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
