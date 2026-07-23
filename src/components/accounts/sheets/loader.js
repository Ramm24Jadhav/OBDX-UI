define([
  'ojs/ojcomposite',
  'text!./sheets.html',
  './sheets',
  'text!./component.json',
  'text!./sheets.css',
  'base-models/css',
  'module'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-sheets', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
