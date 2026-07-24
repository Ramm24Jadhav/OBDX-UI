define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  var ACCOUNT_GROUPS = [
    {
      group: 'Bank Accounts',
      items: [
        { id: 'acc1', label: 'Current Account',  number: '••2341', balance: 'LYD 45,678.00',   icon: '#2563EB', iconBg: '#DBEAFE' },
        { id: 'acc2', label: 'Savings Account',  number: '••8812', balance: 'LYD 128,450.00',  icon: '#16A34A', iconBg: '#DCFCE7' },
        { id: 'acc3', label: 'Business Account', number: '••4490', balance: 'LYD 320,000.00',  icon: '#7A1531', iconBg: '#FCE7EE' }
      ]
    },
    {
      group: 'Term Deposits',
      items: [
        { id: 'td1', label: '12-Month Fixed Deposit',  number: 'TD-2024-0041', balance: 'LYD 50,000.00',  icon: '#7C3AED', iconBg: '#EDE9FE' },
        { id: 'td2', label: '6-Month Flexible Deposit', number: 'TD-2024-0078', balance: 'LYD 25,000.00',  icon: '#7C3AED', iconBg: '#EDE9FE' }
      ]
    },
    {
      group: 'Loans',
      items: [
        { id: 'ln1', label: 'Home Finance',    number: 'HF-2026-00712', balance: 'LYD 1,240,000.00', icon: '#D97706', iconBg: '#FEF3C7' },
        { id: 'ln2', label: 'Auto Finance',    number: 'AF-2025-00329', balance: 'LYD 68,500.00',    icon: '#D97706', iconBg: '#FEF3C7' }
      ]
    },
    {
      group: 'Credit Cards',
      items: [
        { id: 'cc1', label: 'Platinum Card', number: '•••• •••• •••• 4829', balance: 'LYD 8,200.00 outstanding', icon: '#DC2626', iconBg: '#FEE2E2' }
      ]
    }
  ];

  function StatementsViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.accountGroups = ACCOUNT_GROUPS;
    self.selectedAccount = ko.observable('acc1');
    self.selectAccount   = function (item) { self.selectedAccount(item.id); };

    self.periods = [
      { id: 'this_month', label: 'This Month'    },
      { id: 'last_3',     label: 'Last 3 Months' },
      { id: 'last_6',     label: 'Last 6 Months' },
      { id: 'last_year',  label: 'Last 12 Months'}
    ];
    self.selectedPeriod = ko.observable('this_month');
    self.selectPeriod   = function (p) { self.selectedPeriod(p.id); };

    self.formats = ['PDF', 'Excel', 'CSV'];
    self.selectedFormat = ko.observable('PDF');
    self.selectFormat   = function (f) { self.selectedFormat(f); };

    self.isDownloading = ko.observable(false);

    self.selectedLabel = ko.computed(function () {
      var id = self.selectedAccount();
      var found = null;
      ACCOUNT_GROUPS.forEach(function (g) {
        g.items.forEach(function (item) { if (item.id === id) found = item; });
      });
      return found ? found.label : '';
    });

    self.download = function () {
      self.isDownloading(true);
      setTimeout(function () {
        self.isDownloading(false);
        var period = self.periods.find(function (p) { return p.id === self.selectedPeriod(); });
        window.obdxApp && window.obdxApp.showToast(
          self.selectedLabel() + ' · ' + (period ? period.label : '') + ' statement ready', 'success'
        );
      }, 1500);
    };
  }

  return StatementsViewModel;
});
