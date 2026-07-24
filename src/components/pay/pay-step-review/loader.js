define(['ojs/ojcomposite','text!./pay-step-review.html','./pay-step-review'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-step-review', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-step-review', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
