define(['services/BaseService'], function (BaseService) {
  return {
    getCards: function () {
      return BaseService.get('/cards', 'mocks/cards.json');
    },
    blockCard: function (cardId, reason) {
      return BaseService.post('/cards/' + cardId + '/block', { reason: reason }, 'mocks/card-action.json');
    },
    setLimit: function (cardId, daily, monthly) {
      return BaseService.put('/cards/' + cardId + '/limits', { daily: daily, monthly: monthly }, 'mocks/card-action.json');
    },
    changePIN: function (cardId, currentPIN, newPIN) {
      return BaseService.post('/cards/' + cardId + '/pin/change', { currentPIN: currentPIN, newPIN: newPIN }, 'mocks/card-action.json');
    }
  };
});
