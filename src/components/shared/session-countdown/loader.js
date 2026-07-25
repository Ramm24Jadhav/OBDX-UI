define([
  'ojs/ojcomposite',
  'text!./session-countdown.html',
  './session-countdown',
  'text!./component.json'
], function (Composite, view, viewModel, metadata) {
  'use strict';
  Composite.register('session-countdown', {
    view:      view,
    viewModel: viewModel,
    metadata:  JSON.parse(metadata)
  });
});
