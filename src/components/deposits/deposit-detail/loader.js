define([
  'ojs/ojcomposite',
  'text!./deposit-detail.html',
  './deposit-detail',
  '../deposit-detail-more/loader',
  '../deposit-estatement/loader',
  '../deposit-nickname/loader'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-detail', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-detail',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
