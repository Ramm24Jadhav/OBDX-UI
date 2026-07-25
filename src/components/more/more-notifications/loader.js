define(['ojs/ojcomposite','text!./more-notifications.html','./more-notifications','ojs/ojknockout'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('more-notifications', {
    view: view, viewModel: viewModel,
    metadata: { name:'more-notifications', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
