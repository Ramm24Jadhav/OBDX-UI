define(['ojs/ojcomposite','text!./pay-hub.html','./pay-hub'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-hub', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-hub', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
