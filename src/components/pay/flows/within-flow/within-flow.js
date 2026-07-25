define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function WithinFlowViewModel(params) {
    params.flowType            = ko.observable('within');
    params.defaultTransferType = 'WITHIN_OBDX';
    BaseFlow.call(this, params);
  }
  return WithinFlowViewModel;
});
