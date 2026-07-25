define(['ojs/ojcomposite','text!./home-analytics-panel.html','./home-analytics-panel'], function (Composite, view, viewModel) {
  Composite.register('home-analytics-panel', {
    view: view, viewModel: viewModel,
    metadata: { name:'home-analytics-panel', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
