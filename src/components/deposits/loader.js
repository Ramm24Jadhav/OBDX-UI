define([
  'ojs/ojcomposite',
  'text!./deposits.html',
  './deposits',
  'text!./component.json',
  'text!./deposits.css',
  'base-models/css',
  'module',
  './deposit-list/loader',
  './deposit-redeem/loader',
  './deposit-edit-maturity/loader',
  './deposit-top-up/loader',
  './deposit-more-sheet/loader',
  './deposit-detail/loader',
  'shared-components/picker-sheet/loader',
  'shared-components/account-dropdown/loader'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-deposits', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
