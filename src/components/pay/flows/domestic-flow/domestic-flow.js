define(['knockout', 'pay-flows/base-flow'], function (ko, BaseFlow) {
  'use strict';
  function DomesticFlowViewModel(params) {
    params.flowType            = ko.observable('domestic');
    params.defaultTransferType = 'OTHER_BANK';
    BaseFlow.call(this, params);
  }
  return DomesticFlowViewModel;
});
