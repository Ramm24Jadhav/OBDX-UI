define(['knockout', 'shared-components/utils', 'ojL10n!resources/nls/strings'], function (ko, utils, nls) {
  'use strict';

  function BottomSheetViewModel(context) {
    var params = context.properties ? context.properties : context;
    var self = this;
    self.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');

    self.title   = ko.isObservable(params.title)   ? params.title   : ko.observable(params.title || '');
    self.open    = ko.isObservable(params.open)    ? params.open    : ko.observable(!!params.open);
    self.onClose = params.onClose || function () {};
  }

  return BottomSheetViewModel;
});
