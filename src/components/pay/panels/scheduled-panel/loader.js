define(['knockout', 'text!./scheduled-panel.html', './scheduled-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('scheduled-panel')) {
    ko.components.register('scheduled-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
