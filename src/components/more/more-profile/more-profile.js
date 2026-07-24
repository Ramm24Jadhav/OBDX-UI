define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  function ProfileViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.currentUser = ko.computed(function () {
      return window.obdxApp ? window.obdxApp.currentUser() : { name: 'Mohammed Al-Qahtani', customerId: 'CUST-00412387' };
    });

    self.userInitial = ko.computed(function () {
      return self.currentUser().initials || (self.currentUser().name || 'M').charAt(0);
    });

    // Edit mode
    self.editMode = ko.observable(false);

    // Editable fields (contact only — personal info is KYC-locked)
    self.editMobile  = ko.observable('+218 91 234 5678');
    self.editEmail   = ko.observable('m.alqahtani@email.com');
    self.editAddress = ko.observable('Tripoli, Libya');

    // Display copies (saved)
    self.savedMobile  = ko.observable('+218 91 234 5678');
    self.savedEmail   = ko.observable('m.alqahtani@email.com');
    self.savedAddress = ko.observable('Tripoli, Libya');

    self.startEdit = function () {
      self.editMobile(self.savedMobile());
      self.editEmail(self.savedEmail());
      self.editAddress(self.savedAddress());
      self.editMode(true);
    };

    self.cancelEdit = function () {
      self.editMode(false);
    };

    self.saveDetails = function () {
      self.savedMobile(self.editMobile());
      self.savedEmail(self.editEmail());
      self.savedAddress(self.editAddress());
      self.editMode(false);
      window.obdxApp && window.obdxApp.showToast('Contact details updated', 'success');
    };
  }

  return ProfileViewModel;
});
