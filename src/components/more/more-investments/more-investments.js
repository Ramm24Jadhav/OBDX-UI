define(['knockout'], function (ko) {
  'use strict';

  function InvestmentsViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.totalValue  = 'LYD 184,320.00';
    self.todayGain   = '+LYD 1,240.50';
    self.todayGainPct = '+0.68%';
    self.totalReturn = '+18.4%';
    self.isGainPos   = true;

    self.allocation = [
      { label: 'Equities',       pct: 52, color: '#7A1531', value: 'LYD 95,846' },
      { label: 'Fixed Income',   pct: 31, color: '#2563EB', value: 'LYD 57,139' },
      { label: 'Money Market',   pct: 17, color: '#16A34A', value: 'LYD 31,334' }
    ];

    self.funds = ko.observableArray([
      { name: 'Aman Growth Fund',        type: 'Equity · Diversified',   nav: 'LYD 24.85', navSub: 'NAV per unit', returnVal: '+22.4%', returnPos: true,  units: '1,240 units', value: 'LYD 30,814' },
      { name: 'Aman Income Fund',        type: 'Fixed Income · Monthly', nav: 'LYD 18.40', navSub: 'NAV per unit', returnVal: '+8.7%',  returnPos: true,  units: '870 units',   value: 'LYD 16,008' },
      { name: 'Aman Capital Preservation',type: 'Money Market · Daily',  nav: 'LYD 10.12', navSub: 'NAV per unit', returnVal: '+4.2%',  returnPos: true,  units: '3,100 units', value: 'LYD 31,372' }
    ]);

    self.investMore = function () { window.obdxApp && window.obdxApp.showToast('Invest More — coming soon', 'info'); };
    self.withdraw   = function () { window.obdxApp && window.obdxApp.showToast('Withdraw — coming soon', 'info'); };
  }

  return InvestmentsViewModel;
});
