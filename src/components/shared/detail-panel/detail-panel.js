define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  function DetailPanelViewModel(context) {
    var params = context.properties ? context.properties : context;
    var self = this;
    utils.loadCss('/components/shared/panel-system.css');

    self.open        = ko.isObservable(params.open)      ? params.open      : ko.observable(!!params.open);
    self.heroClass   = ko.isObservable(params.heroClass) ? params.heroClass : ko.observable(params.heroClass || '');
    self.tabs        = ko.isObservable(params.tabs)      ? params.tabs      : ko.observable(params.tabs || []);
    self.activeTab   = ko.isObservable(params.activeTab) ? params.activeTab : ko.observable(params.activeTab || '');
    self.onBack      = params.onBack      || function () {};
    self.onTabChange = params.onTabChange || function (id) { self.activeTab(id); };
  }

  return DetailPanelViewModel;
});
