define([
  'ojs/ojcomposite',
  'text!./loan-schedule.html',
  './loan-schedule'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-schedule', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-schedule',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
