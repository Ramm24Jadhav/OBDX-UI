define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function IntlFlowViewModel(params) {
    params.flowType            = ko.observable('international');
    params.defaultTransferType = 'SWIFT';
    BaseFlow.call(this, params);
  }
  return IntlFlowViewModel;
});
