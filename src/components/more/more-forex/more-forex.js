define(['knockout'], function (ko) {
  'use strict';

  function ForexViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;

    self.open    = params.open;
    self.onClose = params.onClose;

    var _rates = {
      USD: { buy: 4.8250, sell: 4.8650, flag: '🇺🇸', name: 'US Dollar' },
      EUR: { buy: 5.2100, sell: 5.2600, flag: '🇪🇺', name: 'Euro' },
      GBP: { buy: 6.1200, sell: 6.1800, flag: '🇬🇧', name: 'British Pound' },
      SAR: { buy: 1.2860, sell: 1.2980, flag: '🇸🇦', name: 'Saudi Riyal' },
      AED: { buy: 1.3140, sell: 1.3280, flag: '🇦🇪', name: 'UAE Dirham' },
      EGP: { buy: 0.0960, sell: 0.0980, flag: '🇪🇬', name: 'Egyptian Pound' },
      TRY: { buy: 0.1480, sell: 0.1520, flag: '🇹🇷', name: 'Turkish Lira' }
    };

    self.rateList = Object.keys(_rates).map(function (ccy) {
      return { ccy: ccy, flag: _rates[ccy].flag, name: _rates[ccy].name, buy: _rates[ccy].buy.toFixed(4), sell: _rates[ccy].sell.toFixed(4) };
    });

    self.fromCcy  = ko.observable('LYD');
    self.toCcy    = ko.observable('USD');
    self.amount   = ko.observable('1000');

    self.convertedAmount = ko.computed(function () {
      var amt = parseFloat(self.amount()) || 0;
      var rate = _rates[self.toCcy()] ? _rates[self.toCcy()].buy : 1;
      if (self.fromCcy() !== 'LYD') {
        // converting TO LYD
        rate = 1 / (_rates[self.fromCcy()] ? _rates[self.fromCcy()].buy : 1);
      }
      return (amt * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });

    self.swapCurrencies = function () {
      var tmp = self.fromCcy();
      self.fromCcy(self.toCcy());
      self.toCcy(tmp);
    };

    self.selectToCcy = function (ccy) { self.toCcy(ccy); };
  }

  return ForexViewModel;
});
