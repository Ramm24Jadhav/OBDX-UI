define([], function (nls) {
  function OrigHeaderViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.heading    = p.heading;
    this.headerBack = p.headerBack;
  }
  return OrigHeaderViewModel;
});
