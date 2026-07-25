define(['ojs/ojcomposite','text!./orig-header.html','./orig-header'], function (Composite, view, viewModel) {
  Composite.register('orig-header', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-header', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
