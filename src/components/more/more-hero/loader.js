define(['ojs/ojcomposite','text!./more-hero.html','./more-hero','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-hero', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-hero', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
