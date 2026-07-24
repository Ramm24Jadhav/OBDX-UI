define([], function () {
  function OrigSuccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.refNo = p.refNo;
    this.done  = p.done;
  }
  return OrigSuccessViewModel;
});
