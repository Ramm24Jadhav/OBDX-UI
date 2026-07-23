define([
  'ojs/ojcomposite',
  'text!./deposits.html',
  './deposits',
  'text!./component.json',
  'text!./deposits.css',
  'base-models/css',
  'module'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-deposits', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
