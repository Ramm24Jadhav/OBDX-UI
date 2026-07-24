define([], function (nls) {
  function OrigFooterViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.step    = p.step;
    this.context = p.context;
    this.goStep  = p.goStep;
    this.submit  = p.submit;
  }
  return OrigFooterViewModel;
});
