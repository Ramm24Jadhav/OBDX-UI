define([
  'ojs/ojcomposite',
  'text!./deposit-nickname.html',
  './deposit-nickname'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-nickname', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-nickname',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
