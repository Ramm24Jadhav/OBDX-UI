define([
  'ojs/ojcomposite',
  'text!./obdx-toast.html',
  './obdx-toast',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('obdx-toast', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
