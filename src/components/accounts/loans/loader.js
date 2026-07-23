define([
  'ojs/ojcomposite',
  'text!./loans.html',
  './loans',
  'text!./component.json',
  'text!./loans.css',
  'base-models/css',
  'module'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-loans', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
