define(['services/BaseService'], function (BaseService) {
  return {
    getBeneficiaries: function () {
      return BaseService.get('/beneficiaries', 'mocks/beneficiaries.json');
    },
    initiateTransfer: function (payload) {
      return BaseService.post('/payments/transfers', payload, 'mocks/transfer-response.json');
    },
    generateOTP: function (refNo) {
      return BaseService.post('/otp/generate', { referenceNo: refNo }, 'mocks/otp-response.json');
    },
    validateOTP: function (otp, refNo) {
      return BaseService.post('/otp/validate', { otp: otp, referenceNo: refNo }, 'mocks/otp-validate.json');
    },
    getScheduledPayments: function () {
      return BaseService.get('/payments/scheduled', 'mocks/scheduled.json');
    },
    getStandingInstructions: function () {
      return BaseService.get('/payments/standing-instructions', 'mocks/standing-instructions.json');
    }
  };
});
