define([
  'ojs/ojcomposite',
  'text!./pay-step-recipient.html',
  './pay-step-recipient',
  'shared-components/account-dropdown/loader'
], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-step-recipient', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-step-recipient', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
