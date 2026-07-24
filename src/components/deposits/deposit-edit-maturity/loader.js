define([
  'ojs/ojcomposite',
  'text!./deposit-edit-maturity.html',
  './deposit-edit-maturity'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-edit-maturity', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-edit-maturity',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
