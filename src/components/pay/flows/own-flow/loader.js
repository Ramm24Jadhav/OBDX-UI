define(['knockout', 'text!../own-flow.html', './own-flow'], function (ko, view, VM) {
  if (!ko.components.isRegistered('own-flow')) {
    ko.components.register('own-flow', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
