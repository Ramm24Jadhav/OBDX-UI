define([
  'ojs/ojcomposite',
  'text!./loans.html',
  './loans',
  'text!./component.json',
  'text!./loans.css',
  'base-models/css',
  'module',
  'loan-components/loan-list/loader',
  'loan-components/loan-make-payment/loader',
  'loan-components/loan-schedule/loader',
  'loan-components/loan-statement/loader',
  'loan-components/loan-more-sheet/loader',
  'loan-components/loan-detail/loader',
  'shared-components/picker-sheet/loader',
  'shared-components/account-dropdown/loader'
], function (Composite, view, viewModel, metadata, css, CSS, module) {
  'use strict';
  Composite.register('acct-loans', {
    view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
