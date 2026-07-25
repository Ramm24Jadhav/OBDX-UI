define(['ojs/ojcomposite','text!./login-quick-access.html','./login-quick-access'], function (Composite, view, viewModel) {
  Composite.register('login-quick-access', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-quick-access', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
