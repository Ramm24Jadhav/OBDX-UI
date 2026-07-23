define(['services/BaseService'], function (BaseService) {
  return {
    getProfile: function () {
      return BaseService.fetch('/me', 'mocks/profile.json');
    },
    authenticateMPIN: function (userId, mpin) {
      return BaseService.add('/auth/mpin', { userId: userId, mpin: mpin }, 'mocks/auth-response.json');
    },
    getNotifications: function () {
      return BaseService.fetch('/notifications', 'mocks/notifications.json');
    },
    generateOTP: function (referenceNo) {
      return BaseService.add('/otp/generate', { referenceNo: referenceNo }, 'mocks/otp-response.json');
    },
    validateOTP: function (otp, referenceNo) {
      return BaseService.add('/otp/validate', { otp: otp, referenceNo: referenceNo }, 'mocks/otp-validate.json');
    },
    getComponents: function () {
      return BaseService.fetch('/me/components', 'mocks/components.json');
    }
  };
});
