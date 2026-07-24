define(['ojs/ojcomposite','text!./orig-step-indicator.html','./orig-step-indicator'], function (Composite, view, viewModel) {
  Composite.register('orig-step-indicator', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-indicator', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
