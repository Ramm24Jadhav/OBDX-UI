define(['knockout', 'text!../generic-flow.html', './domestic-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('domestic-flow')) {
    ko.components.register('domestic-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
