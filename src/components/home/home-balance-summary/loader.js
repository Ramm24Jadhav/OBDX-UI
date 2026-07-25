define(['ojs/ojcomposite','text!./home-balance-summary.html','./home-balance-summary'], function (Composite, view, viewModel) {
  Composite.register('home-balance-summary', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-balance-summary', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
