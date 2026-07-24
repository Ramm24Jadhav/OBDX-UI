define(['knockout'], function (ko) {
  'use strict';
  function PersonalViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;
    // Pass-through: this step reads/writes directly on parent VM via params
    self.personalMobile  = params.personalMobile;
    self.personalEmail   = params.personalEmail;
    self.personalAddress = params.personalAddress;
  }
  return PersonalViewModel;
});
