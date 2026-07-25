define(['knockout', 'text!../generic-flow.html', './within-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('within-flow')) {
    ko.components.register('within-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
