define(['knockout', 'text!./tracker-panel.html', './tracker-panel'], function (ko, view, VM) {
  if (!ko.components.isRegistered('tracker-panel')) {
    ko.components.register('tracker-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
