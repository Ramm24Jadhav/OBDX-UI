define(['knockout', 'ojL10n!components/pay/nls/strings'], function (ko, nls) {
  'use strict';
  function BenePanelViewModel(params) {
    var self = this;
    self.nls           = nls;
    self.isOpen        = ko.isObservable(params.isOpen)        ? params.isOpen        : ko.observable(false);
    self.onClose       = params.onClose       || function () {};
    self.beneficiaries = ko.isObservable(params.beneficiaries) ? params.beneficiaries : ko.observableArray(params.beneficiaries || []);
    var _onSelect      = params.onSelectBen   || function () {};
    self.pickBeneficiary = function (ben) {
      _onSelect(ben);
      self.onClose();
    };
  }
  return BenePanelViewModel;
});
