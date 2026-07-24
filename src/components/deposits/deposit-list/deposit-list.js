define(['shared-components/utils'], function (utils) {
  'use strict';
  function DepositListViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    utils.loadCss('/components/deposits/deposits.css');
    this.deposits     = p.deposits;
    this.fmt          = p.fmt;
    this.onOpen       = p.open;
    this.onOpenDetail = p.openDepDetail;
    this.onOrigination = p.openOrigination;
  }
  return DepositListViewModel;
});
