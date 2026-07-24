define(['ojs/ojcomposite','text!./card-auth-gate.html','./card-auth-gate'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-auth-gate', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-auth-gate', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
