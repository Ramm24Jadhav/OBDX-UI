define(['knockout', 'shared-components/utils', 'ojL10n!resources/nls/strings'], function (ko, utils, nls) {
  'use strict';
  function DepositDetailViewModel(context) {
    var self = this;
    self.nls = nls;
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/deposits/deposits.css');

    // Delegated from parent DepositsViewModel
    self.open          = p.depDetail;
    self.dep           = p.selected;
    self.fmt           = p.fmt;
    self.onClose       = p.closeDepDetail;
    self.onListOpen    = function (dep, panel) { p.closeDepDetail(); p.open(dep, panel); };
    self.openPicker    = p.openPicker;
    self.pickOption    = p.pickOption;
    self.dismissPicker = p.dismissPicker;
    self.picker        = p.picker;

    // Own state (detail-level only)
    self.activeTab       = ko.observable('details');
    self.showDetMore     = ko.observable(false);
    self.showEStatSub    = ko.observable(false);
    self.showNickname    = ko.observable(false);
    self.submitted       = ko.observable(false);
    self.submittedMsg    = ko.observable('');
    self.statementPeriod = ko.observable('Last 3 months');
    self.statementFormat = ko.observable('PDF');
    self.eStatFrequency  = ko.observable('Monthly');
    self.eStatFormat     = ko.observable('PDF');
    self.nickname        = ko.observable('');

    self.requestStatement = function () {
      self.submittedMsg('Statement for "' + self.statementPeriod() + '" sent to your registered email.');
      self.submitted(true);
    };
    self.subscribeEStatement = function () {
      self.submittedMsg('E-statement subscription (' + self.eStatFrequency() + ') activated.');
      self.submitted(true);
    };
    self.saveNickname = function () {
      if (!self.nickname()) { window.obdxApp && window.obdxApp.showToast('Enter a nickname', 'error'); return; }
      self.submittedMsg('"' + self.nickname() + '" saved as nickname for this deposit.');
      self.submitted(true);
    };
  }
  return DepositDetailViewModel;
});
