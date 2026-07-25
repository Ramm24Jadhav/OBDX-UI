define(['ojs/ojcomposite','text!./more-theme.html','./more-theme','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-theme', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-theme', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
