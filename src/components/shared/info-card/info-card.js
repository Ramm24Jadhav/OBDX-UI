define(['knockout', 'shared-components/utils'], function (ko, utils) {
  'use strict';

  function InfoCardViewModel(context) {
    var params = context.properties ? context.properties : context;
    utils.loadCss('/components/shared/panel-system.css');
    this.rows = ko.isObservable(params.rows) ? params.rows : ko.observable(params.rows || []);
  }

  return InfoCardViewModel;
});
