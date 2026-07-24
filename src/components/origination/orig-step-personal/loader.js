define(['ojs/ojcomposite','text!./orig-step-personal.html','./orig-step-personal','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('orig-step-personal', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-personal', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
