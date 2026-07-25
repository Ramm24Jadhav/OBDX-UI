define(['knockout', 'text!./bene-panel.html', './bene-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('bene-panel')) {
    ko.components.register('bene-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
