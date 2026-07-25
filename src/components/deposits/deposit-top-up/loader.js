define([
  'ojs/ojcomposite',
  'text!./deposit-top-up.html',
  './deposit-top-up'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-top-up', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-top-up',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
