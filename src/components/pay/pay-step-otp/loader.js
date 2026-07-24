define(['ojs/ojcomposite','text!./pay-step-otp.html','./pay-step-otp'], function (Composite, view, viewModel) {
  'use strict';
  Composite.register('pay-step-otp', {
    view: view, viewModel: viewModel,
    metadata: { name:'pay-step-otp', version:'1.0.0', properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
