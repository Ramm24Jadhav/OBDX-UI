define(['shared-components/utils', 'ojL10n!resources/nls/strings'], function (utils, nls) {
  'use strict';
  function DepositNicknameViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    this.open         = p.showNickname;
    this.dep          = p.dep;
    this.submitted    = p.submitted;
    this.submittedMsg = p.submittedMsg;
    this.nickname     = p.nickname;
    this.onConfirm    = p.saveNickname;
    this.onClose = function () { p.showNickname(false); p.submitted(false); };
  }
  return DepositNicknameViewModel;
});
