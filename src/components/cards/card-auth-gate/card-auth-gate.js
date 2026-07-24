define(['shared-components/utils'], function (utils) {
  'use strict';
  function CardAuthGateViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    utils.loadCss('/components/cards/card-auth-gate/card-auth-gate.css');
    this.open      = p.showAuthGate;
    this.authView  = p.authView;
    this.mpinDots  = p.mpinDots;
    this.authPick  = p.authPick;
    this.authBack  = p.authBack;
    this.mpinKey   = p.mpinKey;
    this.onClose   = p.closeAuthGate;
  }
  return CardAuthGateViewModel;
});
