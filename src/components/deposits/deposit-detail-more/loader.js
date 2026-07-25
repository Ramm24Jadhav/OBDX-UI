define([
  'ojs/ojcomposite',
  'text!./deposit-detail-more.html',
  './deposit-detail-more'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-dep-detail-more', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-dep-detail-more',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
