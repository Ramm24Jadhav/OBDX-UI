define(['knockout', 'shared-components/utils', 'ojL10n!resources/nls/strings'], function (ko, utils, nls) {
  'use strict';

  function InfoCardViewModel(context) {
    var params = context.properties ? context.properties : context;
    this.nls = nls;
    utils.loadCss('/components/shared/panel-system.css');
    this.rows = ko.isObservable(params.rows) ? params.rows : ko.observable(params.rows || []);
  }

  return InfoCardViewModel;
});
