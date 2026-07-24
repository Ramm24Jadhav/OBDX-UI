define(['ojs/ojcomposite','text!./more-profile.html','./more-profile','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-profile', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-profile', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
