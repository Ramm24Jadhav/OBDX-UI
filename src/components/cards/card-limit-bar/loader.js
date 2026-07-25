define(['ojs/ojcomposite','text!./card-limit-bar.html','./card-limit-bar'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-limit-bar', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-limit-bar', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
