define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function GccFlowViewModel(params) {
    params.flowType            = ko.observable('gcc');
    params.defaultTransferType = 'SWIFT';
    BaseFlow.call(this, params);
  }
  return GccFlowViewModel;
});
