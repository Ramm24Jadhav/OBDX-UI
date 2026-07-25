define([
  'knockout',
  'text!./pay_confirmation.html',
  './pay_confirmation'
], function (ko, view, viewModel) {
  if (!ko.components.isRegistered('pay-confirmation')) {
    ko.components.register('pay-confirmation', {
      viewModel: { createViewModel: function (params) { return new viewModel(params); } },
      template: view
    });
  }
});
