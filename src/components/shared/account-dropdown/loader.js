define([
  'ojs/ojcomposite',
  'text!./account-dropdown.html',
  './account-dropdown'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-account-dd', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-account-dd',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
