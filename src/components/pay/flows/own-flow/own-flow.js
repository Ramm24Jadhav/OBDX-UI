define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function OwnFlowViewModel(params) {
    params.flowType            = ko.observable('own');
    params.defaultTransferType = 'WITHIN_OBDX';
    BaseFlow.call(this, params);
  }
  return OwnFlowViewModel;
});
