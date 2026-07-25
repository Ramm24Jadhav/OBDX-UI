define(['ojs/ojcomposite','text!./card-limits-sheet.html','./card-limits-sheet'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('card-limits-sheet', {
    view: view, viewModel: viewModel,
    metadata: { name:'card-limits-sheet', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
