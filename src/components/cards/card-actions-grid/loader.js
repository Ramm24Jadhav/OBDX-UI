define(['ojs/ojcomposite','text!./card-actions-grid.html','./card-actions-grid'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-actions-grid', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-actions-grid', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
