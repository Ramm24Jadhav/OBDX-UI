define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  function NoticeBannerViewModel(context) {
    var params = context.properties ? context.properties : context;
    utils.loadCss('/components/shared/panel-system.css');
    this.type    = ko.isObservable(params.type)    ? params.type    : ko.observable(params.type    || 'info');
    this.message = ko.isObservable(params.message) ? params.message : ko.observable(params.message || '');
  }

  return NoticeBannerViewModel;
});
