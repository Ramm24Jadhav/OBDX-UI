define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositDetailMoreViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/shared/panel-system.css');
    this.open = p.showDetMore;
    this.dep  = p.dep;
    this.onClose = function () { p.showDetMore(false); };
    this.onEStatement = function () { p.showDetMore(false); p.submitted(false); p.showEStatSub(true); };
    this.onNickname   = function () { p.showDetMore(false); p.submitted(false); p.showNickname(true); };
    this.onCertificate = function () {
      window.obdxApp && window.obdxApp.showToast('Profit certificate downloading…', 'success');
      p.showDetMore(false);
    };
    this.onCopyIban = function () {
      window.obdxApp && window.obdxApp.showToast('IBAN copied', 'success');
      p.showDetMore(false);
    };
  }
  return DepositDetailMoreViewModel;
});
