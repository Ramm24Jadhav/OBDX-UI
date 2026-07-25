define(['ojs/ojcomposite','text!./more-forex.html','./more-forex','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-forex', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-forex', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
