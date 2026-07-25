define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function AdhocFlowViewModel(params) {
    params.flowType            = ko.observable('adhoc');
    params.defaultTransferType = 'WITHIN_OBDX';
    params.startAdhoc          = true;
    BaseFlow.call(this, params);
  }
  return AdhocFlowViewModel;
});
