define([
  'ojs/ojcomposite',
  'text!./deposit-list.html',
  './deposit-list'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-list', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-list',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
