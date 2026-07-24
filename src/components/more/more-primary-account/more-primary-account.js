define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  var ACCOUNTS = [
    { id: 'acc1', label: 'Current Account',  number: '••2341', balance: 'LYD 45,678.00',   icon: '#2563EB', type: 'current'  },
    { id: 'acc2', label: 'Savings Account',  number: '••8812', balance: 'LYD 128,450.00',  icon: '#16A34A', type: 'savings'  },
    { id: 'acc3', label: 'Business Account', number: '••4490', balance: 'LYD 320,000.00',  icon: '#7A1531', type: 'business' }
  ];

  function PrimaryAccountViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.accounts = ACCOUNTS;
    self.primaryAccountId = ko.observable('acc1');  // currently set
    self.pendingId        = ko.observable('acc1');  // what user selects before saving

    self.isPrimary  = function (acc) { return self.primaryAccountId() === acc.id; };
    self.isSelected = function (acc) { return self.pendingId() === acc.id; };
    self.select     = function (acc) { self.pendingId(acc.id); };

    self.hasChange = ko.computed(function () {
      return self.pendingId() !== self.primaryAccountId();
    });

    self.save = function () {
      if (!self.hasChange()) return;
      var acc = ACCOUNTS.find(function (a) { return a.id === self.pendingId(); });
      self.primaryAccountId(self.pendingId());
      window.obdxApp && window.obdxApp.showToast((acc ? acc.label : 'Account') + ' set as primary', 'success');
      self.onClose();
    };
  }

  return PrimaryAccountViewModel;
});
