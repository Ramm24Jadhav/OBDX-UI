define(['ojs/ojcomposite','text!./login-mpin-view.html','./login-mpin-view'], function (Composite, view, viewModel) {
  Composite.register('login-mpin-view', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-mpin-view', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
