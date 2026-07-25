define([
  'knockout',
  'text!./account-dropdown.html',
  './account-dropdown'
], function (ko, view, viewModel) {
  'use strict';
  // Use KO's own component system — avoids JET Composite wrapper which
  // caused text bindings to not apply inside dynamic ko-if/foreach blocks.
  if (!ko.components.isRegistered('acct-account-dd')) {
    ko.components.register('acct-account-dd', {
      viewModel: { createViewModel: function (params) { return new viewModel(params); } },
      template: view
    });
  }
});
