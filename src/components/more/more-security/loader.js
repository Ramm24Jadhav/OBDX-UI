define(['ojs/ojcomposite','text!./more-security.html','./more-security','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-security', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-security', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
