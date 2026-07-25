define([], function () {
  function OrigStepIndicatorViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.step    = p.step;
    this.context = p.context;
  }
  return OrigStepIndicatorViewModel;
});
