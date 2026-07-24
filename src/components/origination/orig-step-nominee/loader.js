define(['ojs/ojcomposite','text!./orig-step-nominee.html','./orig-step-nominee'], function (Composite, view, viewModel) {
  Composite.register('orig-step-nominee', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-nominee', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
