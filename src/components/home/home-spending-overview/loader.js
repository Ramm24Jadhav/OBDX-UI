define(['ojs/ojcomposite','text!./home-spending-overview.html','./home-spending-overview'], function (Composite, view, viewModel) {
  Composite.register('home-spending-overview', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-spending-overview', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
