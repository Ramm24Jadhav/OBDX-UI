define(['ojs/ojcomposite','text!./orig-step-maturity.html','./orig-step-maturity'], function (Composite, view, viewModel) {
  Composite.register('orig-step-maturity', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-maturity', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
