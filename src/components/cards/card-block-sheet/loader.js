define(['ojs/ojcomposite','text!./card-block-sheet.html','./card-block-sheet'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-block-sheet', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-block-sheet', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
