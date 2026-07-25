define(['knockout', 'text!../generic-flow.html', './afaq-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('afaq-flow')) {
    ko.components.register('afaq-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
