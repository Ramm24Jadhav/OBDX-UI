define(['ojs/ojcomposite','text!./home-notifications-panel.html','./home-notifications-panel'], function (Composite, view, viewModel) {
  Composite.register('home-notifications-panel', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-notifications-panel', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
