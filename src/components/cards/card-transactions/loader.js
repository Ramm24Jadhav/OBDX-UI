define(['ojs/ojcomposite','text!./card-transactions.html','./card-transactions'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-transactions', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-transactions', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
