define(['knockout', 'ojL10n!components/pay/nls/strings'], function (ko, nls) {
  'use strict';
  function QrPayViewModel(params) {
    this.nls     = nls;
    this.isOpen  = ko.isObservable(params.isOpen)  ? params.isOpen  : ko.observable(false);
    this.onClose = params.onClose || function () {};
  }
  return QrPayViewModel;
});
