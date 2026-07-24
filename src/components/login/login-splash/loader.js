define(['ojs/ojcomposite','text!./login-splash.html','./login-splash'], function (Composite, view, viewModel) {
  Composite.register('login-splash', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-splash', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
