define(['ojs/ojcomposite','text!./orig-success.html','./orig-success'], function (Composite, view, viewModel) {
  Composite.register('orig-success', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-success', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
