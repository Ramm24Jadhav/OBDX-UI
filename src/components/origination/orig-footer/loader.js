define(['ojs/ojcomposite','text!./orig-footer.html','./orig-footer'], function (Composite, view, viewModel) {
  Composite.register('orig-footer', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-footer', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
