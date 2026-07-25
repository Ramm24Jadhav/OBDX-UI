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
    },
    getReceiptPdf: function (referenceNo) {
      // Mock: returns a minimal valid single-page blank PDF as base64
      var mockPdf = 'JVBERi0xLjAKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgMjAwIDIwMF0+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNCAvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxOTAKJSVFT0Y=';
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve({ pdfBase64: mockPdf, referenceNo: referenceNo });
        }, 800);
      });
    }
  };
});
