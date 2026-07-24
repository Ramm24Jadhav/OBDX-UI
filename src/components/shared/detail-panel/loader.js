define([
  'ojs/ojcomposite',
  'text!./detail-panel.html',
  './detail-panel',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('acct-detail-panel', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
