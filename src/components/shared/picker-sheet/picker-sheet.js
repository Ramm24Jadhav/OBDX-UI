define([], function () {
  'use strict';
  function PickerSheetViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.picker      = p.picker;
    this.pickOption  = p.pickOption;
    this.onClose     = p.dismissPicker;
  }
  return PickerSheetViewModel;
});
