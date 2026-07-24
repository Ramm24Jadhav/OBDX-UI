define(['ojs/ojcomposite','text!./more-statements.html','./more-statements','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-statements', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-statements', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
