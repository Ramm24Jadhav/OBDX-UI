define(['shared-components/utils'], function (utils) {
  'use strict';
  function PayStepOtpViewModel(context) {
    var p = context.properties ? context.properties.params : context;
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
