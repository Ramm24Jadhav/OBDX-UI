define(['shared-components/utils', 'ojL10n!components/pay/nls/strings'], function (utils, nls) {
  'use strict';
  function PayStepOtpViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    utils.loadCss('/components/pay/pay-step-otp/pay-step-otp.css');
    this.showStep4           = p.showStep4;
    this.otpVal              = p.otpVal;
    this.otpDots             = p.otpDots;
    this.otpCountdownDisplay = p.otpCountdownDisplay;
    this.otpKey              = p.otpKey;
    this._verifyOTP          = p._verifyOTP;
  }
  return PayStepOtpViewModel;
});
