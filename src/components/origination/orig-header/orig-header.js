define([], function () {
  function OrigHeaderViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.heading    = p.heading;
    this.headerBack = p.headerBack;
  }
  return OrigHeaderViewModel;
});
