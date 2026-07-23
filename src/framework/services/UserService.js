define(['services/BaseService'], function (BaseService) {
  return {
    getProfile: function () {
      return BaseService.get('/me', 'mocks/profile.json');
    },
    authenticateMPIN: function (userId, mpin) {
      return BaseService.post('/auth/mpin', { userId: userId, mpin: mpin }, 'mocks/auth-response.json');
    },
    getNotifications: function () {
      return BaseService.get('/notifications', 'mocks/notifications.json');
    }
  };
});
