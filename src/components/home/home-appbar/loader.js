define(['ojs/ojcomposite','text!./home-appbar.html','./home-appbar'], function (Composite, view, viewModel) {
  Composite.register('home-appbar', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-appbar', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
