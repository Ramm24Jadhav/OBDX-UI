define(['ojs/ojcomposite','text!./card-list.html','./card-list'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-list', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-list', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
