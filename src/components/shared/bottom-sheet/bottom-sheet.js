define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  function BottomSheetViewModel(context) {
    var params = context.properties ? context.properties : context;
    var self = this;
    utils.loadCss('/components/shared/panel-system.css');

    self.title   = ko.isObservable(params.title)   ? params.title   : ko.observable(params.title || '');
    self.open    = ko.isObservable(params.open)    ? params.open    : ko.observable(!!params.open);
    self.onClose = params.onClose || function () {};
  }

  return BottomSheetViewModel;
});
