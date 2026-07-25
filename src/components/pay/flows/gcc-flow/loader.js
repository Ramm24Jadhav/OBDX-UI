define(['knockout', 'text!../generic-flow.html', './gcc-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('gcc-flow')) {
    ko.components.register('gcc-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
