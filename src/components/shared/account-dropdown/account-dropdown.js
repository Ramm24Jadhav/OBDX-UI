define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';
  function AccountDropdownViewModel(params) {
    var self = this;
    utils.loadCss('/components/shared/panel-system.css');

    // Normalize: parent may pass observableArray or plain array
    self.accounts = ko.isObservable(params.accounts)
      ? params.accounts
      : ko.observableArray(params.accounts || []);

    // Normalize: parent may pass observable or plain value
    self.selected = ko.isObservable(params.selectedAccount)
      ? params.selectedAccount
      : ko.observable(params.selectedAccount || null);

    self.fmt = params.fmt || function (n) {
      return 'LYD ' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    self.open   = ko.observable(false);
    self.toggle = function () { self.open(!self.open()); };
    self.select = function (acc) { self.selected(acc); self.open(false); };
  }
  return AccountDropdownViewModel;
});
