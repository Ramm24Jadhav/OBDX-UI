define(['knockout', 'text!../generic-flow.html', './intl-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('intl-flow')) {
    ko.components.register('intl-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
