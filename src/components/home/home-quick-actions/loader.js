define(['ojs/ojcomposite','text!./home-quick-actions.html','./home-quick-actions'], function (Composite, view, viewModel) {
  Composite.register('home-quick-actions', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-quick-actions', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
