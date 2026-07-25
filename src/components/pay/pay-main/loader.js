define([
  'text!./pay-main.html',
  './pay-main',
  'ojs/ojknockout',
  'shared-components/account-dropdown/loader'
], function (view, viewModel) {
  'use strict';
  return { view: view, viewModel: viewModel };
});
