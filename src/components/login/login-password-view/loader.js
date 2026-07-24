define(['ojs/ojcomposite','text!./login-password-view.html','./login-password-view'], function (Composite, view, viewModel) {
  Composite.register('login-password-view', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-password-view', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
