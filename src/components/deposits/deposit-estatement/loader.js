define([
  'ojs/ojcomposite',
  'text!./deposit-estatement.html',
  './deposit-estatement'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-estatement', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-estatement',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
