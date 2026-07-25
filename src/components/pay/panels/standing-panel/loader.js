define(['knockout', 'text!./standing-panel.html', './standing-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('standing-panel')) {
    ko.components.register('standing-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
