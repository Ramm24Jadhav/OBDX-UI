define([
  'ojs/ojcomposite',
  'text!./loan-det-schedule.html',
  './loan-det-schedule'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-loan-det-schedule', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-loan-det-schedule',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
