define(['services/BaseService'], function (BaseService) {
  return {
    getCards: function () {
      return BaseService.fetch('/cards', 'mocks/cards.json');
    },
    blockCard: function (cardId, reason) {
      return BaseService.add('/cards/' + cardId + '/block', { reason: reason }, 'mocks/card-action.json');
    },
    setLimit: function (cardId, daily, monthly) {
      return BaseService.update('/cards/' + cardId + '/limits', { daily: daily, monthly: monthly }, 'mocks/card-action.json');
    },
    changePIN: function (cardId, currentPIN, newPIN) {
      return BaseService.add('/cards/' + cardId + '/pin/change', { currentPIN: currentPIN, newPIN: newPIN }, 'mocks/card-action.json');
    }
  };
});
