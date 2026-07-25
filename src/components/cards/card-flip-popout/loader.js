define(['ojs/ojcomposite','text!./card-flip-popout.html','./card-flip-popout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-flip-popout', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-flip-popout', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
