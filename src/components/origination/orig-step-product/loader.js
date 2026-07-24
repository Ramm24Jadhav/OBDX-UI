define(['ojs/ojcomposite','text!./orig-step-product.html','./orig-step-product'], function (Composite, view, viewModel) {
  Composite.register('orig-step-product', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-product', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
