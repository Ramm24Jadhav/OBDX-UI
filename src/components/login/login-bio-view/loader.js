define(['ojs/ojcomposite','text!./login-bio-view.html','./login-bio-view'], function (Composite, view, viewModel) {
  Composite.register('login-bio-view', {
    view: view, viewModel: viewModel,
    metadata: { name:'login-bio-view', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
