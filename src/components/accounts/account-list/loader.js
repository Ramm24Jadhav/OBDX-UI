define([
  'ojs/ojcomposite',
  'text!./account-list.html',
  './account-list',
  'text!./component.json',
  'text!./account-list.css',
  'base-models/css',
  'module'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-list', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
