define([
  'knockout',
  'text!./pay_flow_header.html',
  './pay_flow_header'
], function (ko, view, viewModel) {
  if (!ko.components.isRegistered('pay-flow-header')) {
    ko.components.register('pay-flow-header', {
      viewModel: { createViewModel: function (params) { return new viewModel(params); } },
      template: view
    });
  }
});
