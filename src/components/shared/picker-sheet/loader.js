define([
  'ojs/ojcomposite',
  'text!./picker-sheet.html',
  './picker-sheet'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('acct-picker-sheet', {
    view: view,
    viewModel: viewModel,
    metadata: {
      name: 'acct-picker-sheet',
      version: '1.0.0',
      properties: { params: { type: 'object' } },
      methods: {}, events: {}, slots: {}
    }
  });
});
