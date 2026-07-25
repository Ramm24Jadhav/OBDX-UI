define(['knockout', 'text!../generic-flow.html', './adhoc-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('adhoc-flow')) {
    ko.components.register('adhoc-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
