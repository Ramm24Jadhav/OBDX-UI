define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositMoreSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    this.open = p.showMore;
    this.dep  = p.selected;
    this.onClose = function () { p.showMore(false); };
    this.onViewDetail = function () { p.showMore(false); p.openDepDetail(p.selected()); };
    this.onCertificate = p.downloadCertificate;
    this.onCopyIban = function () {
      window.obdxApp && window.obdxApp.showToast('IBAN copied', 'success');
      p.showMore(false);
    };
  }
  return DepositMoreSheetViewModel;
});
