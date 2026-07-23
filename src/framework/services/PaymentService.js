define(['services/BaseService'], function (BaseService) {
  return {
    getBeneficiaries: function () {
      return BaseService.fetch('/beneficiaries', 'mocks/beneficiaries.json');
    },
    initiateTransfer: function (payload) {
      return BaseService.add('/payments/transfers', payload, 'mocks/transfer-response.json');
    },
    generateOTP: function (refNo) {
      return BaseService.add('/otp/generate', { referenceNo: refNo }, 'mocks/otp-response.json');
    },
    validateOTP: function (otp, refNo) {
      return BaseService.add('/otp/validate', { otp: otp, referenceNo: refNo }, 'mocks/otp-validate.json');
    },
    getScheduledPayments: function () {
      return BaseService.fetch('/payments/scheduled', 'mocks/scheduled.json');
    },
    getStandingInstructions: function () {
      return BaseService.fetch('/payments/standing-instructions', 'mocks/standing-instructions.json');
    }
  };
});
