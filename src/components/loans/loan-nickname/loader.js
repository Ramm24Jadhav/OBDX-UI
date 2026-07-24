define([
  'ojs/ojcomposite',
  'text!./loan-nickname.html',
  './loan-nickname'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-nickname', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-nickname',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
