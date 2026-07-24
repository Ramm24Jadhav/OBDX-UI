define(['ojL10n!resources/nls/strings'], function (nls) {
  function OrigSuccessViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.refNo = p.refNo;
    this.done  = p.done;
  }
  return OrigSuccessViewModel;
});
