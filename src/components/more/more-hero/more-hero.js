define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  function HeroViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.onProfileTap = params.onProfileTap || function () {};
    self.onRMCall     = params.onRMCall     || function () {
      window.location.href = 'tel:920000000';
    };
    self.onRMChat     = params.onRMChat     || function () {
      window.obdxApp && window.obdxApp.chatbot && window.obdxApp.chatbot.toggle();
    };

    self.currentUser = ko.computed(function () {
      return window.obdxApp ? window.obdxApp.currentUser() : { name: 'Mohammed Al-Qahtani', initials: 'M', tier: 'Platinum Member', customerId: 'CUST-00412387' };
    });

    self.userInitial = ko.computed(function () {
      return self.currentUser().initials || (self.currentUser().name || 'M').charAt(0);
    });
  }

  return HeroViewModel;
});
