define(['ojs/ojcomposite','text!./card-pin-sheet.html','./card-pin-sheet'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-pin-sheet', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-pin-sheet', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
