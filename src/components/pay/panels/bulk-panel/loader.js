define(['knockout', 'text!./bulk-panel.html', './bulk-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('bulk-panel')) {
    ko.components.register('bulk-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
