define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function CardAuthGateViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
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
