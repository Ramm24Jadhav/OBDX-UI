define(['ojs/ojcomposite','text!./orig-step-review.html','./orig-step-review'], function (Composite, view, viewModel) {
  Composite.register('orig-step-review', {
    view: view, viewModel: viewModel,
    metadata: { name:'orig-step-review', version:'1.0.0',
      properties:{ params:{ type:'object' } }, methods:{}, events:{}, slots:{} }
  });
});
