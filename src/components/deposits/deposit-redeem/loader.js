define([
  'ojs/ojcomposite',
  'text!./deposit-redeem.html',
  './deposit-redeem'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-redeem', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-redeem',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
