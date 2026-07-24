define(['knockout', 'shared-components/utils', 'ojL10n!resources/nls/strings'], function (ko, utils, nls) {
  'use strict';

  function SlidePanelViewModel(context) {
    var params = context.properties ? context.properties : context;
    var self = this;
    self.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');

    self.title          = ko.isObservable(params.title)          ? params.title          : ko.observable(params.title || '');
    self.open           = ko.isObservable(params.open)           ? params.open           : ko.observable(!!params.open);
    self.primaryLabel   = ko.isObservable(params.primaryLabel)   ? params.primaryLabel   : ko.observable(params.primaryLabel || '');
    self.secondaryLabel = ko.isObservable(params.secondaryLabel) ? params.secondaryLabel : ko.observable(params.secondaryLabel || '');
    self.onPrimary      = params.onPrimary   || function () {};
    self.onSecondary    = params.onSecondary || function () {};
    self.onBack         = params.onBack      || function () {};
  }

  return SlidePanelViewModel;
});
