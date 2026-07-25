define([
  'ojs/ojcomposite',
  'text!./slide-panel.html',
  './slide-panel',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('acct-slide-panel', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
