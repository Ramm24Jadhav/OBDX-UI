define(['ojs/ojcomposite','text!./pay-step-amount.html','./pay-step-amount'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-step-amount', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-step-amount', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
