define([
  'ojs/ojcomposite',
  'text!./bottom-sheet.html',
  './bottom-sheet',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('acct-bottom-sheet', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
