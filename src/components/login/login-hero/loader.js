define(['ojs/ojcomposite','text!./login-hero.html','./login-hero'], function (Composite, view, viewModel) {
  Composite.register('login-hero', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-hero', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
