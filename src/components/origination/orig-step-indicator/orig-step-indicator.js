define(['ojL10n!resources/nls/strings'], function (nls) {
  function OrigStepIndicatorViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.step    = p.step;
    this.context = p.context;
  }
  return OrigStepIndicatorViewModel;
});
