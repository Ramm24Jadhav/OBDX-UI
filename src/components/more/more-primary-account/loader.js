define(['ojs/ojcomposite','text!./more-primary-account.html','./more-primary-account','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-primary-account', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-primary-account', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
