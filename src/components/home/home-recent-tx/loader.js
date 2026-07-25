define(['ojs/ojcomposite','text!./home-recent-tx.html','./home-recent-tx'], function (Composite, view, viewModel) {
  Composite.register('home-recent-tx', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-recent-tx', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
