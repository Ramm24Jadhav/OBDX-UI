define(['ojs/ojcomposite','text!./more-investments.html','./more-investments','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-investments', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-investments', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
