define(['ojs/ojcomposite','text!./pay-step-success.html','./pay-step-success'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-step-success', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-step-success', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
