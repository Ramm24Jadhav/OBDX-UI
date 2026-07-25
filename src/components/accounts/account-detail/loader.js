define([
  'ojs/ojcomposite',
  'text!./account-detail.html',
  './account-detail',
  'text!./component.json',
  'text!./account-detail.css',
  'base-models/css',
  'module'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-detail', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
