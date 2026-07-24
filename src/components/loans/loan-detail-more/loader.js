define([
  'ojs/ojcomposite',
  'text!./loan-detail-more.html',
  './loan-detail-more'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-detail-more', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-detail-more',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
