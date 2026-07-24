define(['knockout', 'shared-components/utils', 'ojL10n!resources/nls/strings'], function (ko, utils, nls) {
  'use strict';
  function AccountDropdownViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');

    self.accounts = p.accounts;
    self.selected = p.selectedAccount;
    self.fmt      = p.fmt || function (n) { return 'LYD ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    self.open     = ko.observable(false);

    self.toggle = function () { self.open(!self.open()); };
    self.select = function (acc) { self.selected(acc); self.open(false); };
  }
  return AccountDropdownViewModel;
});
