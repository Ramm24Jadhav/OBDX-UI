/**
 * accounts component loader — OBDX pattern
 * AMD entry point: loads view template + ViewModel constructor.
 * oj-module instantiates the ViewModel automatically.
 */
define(['text!./view.html', './viewModel', 'ojs/ojknockout'], function (view, ViewModel) {
  return { view: view, viewModel: ViewModel };
});
