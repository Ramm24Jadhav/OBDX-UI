/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * A top-level require call executed by the Application.
 * Although 'knockout' would be loaded in any case (it is specified as a  dependency
 * by some modules), we are listing it explicitly to get the reference to the 'ko'
 * object in the callback
 */
 function _dismissSplashCover() {
   var cover = document.getElementById('splashCover');
   if (cover) cover.style.display = 'none';
 }

 // Safety fallback: always dismiss within 5s even if BusyContext never resolves
 setTimeout(_dismissSplashCover, 5000);

 require(['ojs/ojbootstrap', 'knockout', './appController', 'ojs/ojcontext', 'ojs/ojlogger',
 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
 function (Bootstrap, ko, app, Context, Logger) {
   Bootstrap.whenDocumentReady().then(
    function() {
      function init() {
        try {
          ko.applyBindings(app, document.getElementById('globalBody'));
          Context.getPageContext().getBusyContext().applicationBootstrapComplete();
          // Dismiss splashCover only after ALL JET components (including login-splash) are painted
          Context.getPageContext().getBusyContext().whenReady().then(_dismissSplashCover);
        } catch (e) {
          console.error('[OBDX] applyBindings failed:', e);
          _dismissSplashCover();
        }
      }
      if (document.body.classList.contains('oj-hybrid')) {
        document.addEventListener("deviceready", init);
      } else {
        init();
      }
    }
  );
 }
);
