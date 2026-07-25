define(['knockout', 'text!./qr-pay.html', './qr-pay'], function (ko, view, VM) {
  if (!ko.components.isRegistered('qr-pay-panel')) {
    ko.components.register('qr-pay-panel', {
      viewModel: { createViewModel: function (params) { return new VM(params); } },
      template: view
    });
  }
});
