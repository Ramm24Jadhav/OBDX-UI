define([
  'ojs/ojcomposite',
  'text!./info-card.html',
  './info-card',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('acct-info-card', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
