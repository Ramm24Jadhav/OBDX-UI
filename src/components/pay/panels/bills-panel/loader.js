define(['knockout', 'text!./bills-panel.html', './bills-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('bills-panel')) {
    ko.components.register('bills-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
