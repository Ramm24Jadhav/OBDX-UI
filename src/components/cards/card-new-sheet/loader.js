define(['ojs/ojcomposite','text!./card-new-sheet.html','./card-new-sheet'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-new-sheet', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-new-sheet', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
