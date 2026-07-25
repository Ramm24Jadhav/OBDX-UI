define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function AfaqFlowViewModel(params) {
    params.flowType            = ko.observable('afaq');
    params.defaultTransferType = 'OTHER_BANK';
    BaseFlow.call(this, params);
  }
  return AfaqFlowViewModel;
});
