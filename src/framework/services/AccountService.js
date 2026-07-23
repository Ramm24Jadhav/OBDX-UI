define(['services/BaseService'], function (BaseService) {
  return {
    getAccounts: function () {
      return BaseService.get('/accounts', 'mocks/accounts.json');
    },
    getTransactions: function (accountId) {
      return BaseService.get(
        '/accounts/' + accountId + '/transactions',
        'mocks/transactions.json'
      );
    },
    getAccountDetail: function (accountId) {
      return BaseService.get('/accounts/' + accountId, 'mocks/accounts.json')
        .then(function (data) {
          return data.accounts.find(function (a) { return a.id === accountId; });
        });
    }
  };
});
