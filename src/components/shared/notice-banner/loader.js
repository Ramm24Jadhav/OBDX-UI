define([
  'ojs/ojcomposite',
  'text!./notice-banner.html',
  './notice-banner',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('acct-notice-banner', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
