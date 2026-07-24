define(['ojs/ojcomposite','text!./more-tracking.html','./more-tracking','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-tracking', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-tracking', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
