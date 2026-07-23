/**
 * Aman Bank — CSS Utility
 * Mirrors OBDX framework/js/base-models/css.js.
 *
 * Two key responsibilities:
 *
 * 1. transformTemplate(view, css, componentName)
 *    Scopes a component's CSS string to its container class, injects a <style>
 *    tag into <head>, and wraps the view HTML in a container div.
 *    Used in every CCA loader.js so component styles never bleed.
 *
 * 2. loadCSS(url)
 *    Non-blocking <link> injection with dedup guard.
 *    Used for external stylesheets (component-level or brand themes).
 *
 * Usage in loader.js:
 *   define(['ojs/ojcomposite','text!./my-comp.html','./my-comp',
 *           'text!./component.json','text!./my-comp.css','base-models/css','module'],
 *   function(Composite, view, viewModel, metadata, css, CSS, module) {
 *     Composite.register('my-comp', {
 *       view:      CSS.transformTemplate(view, css, CSS.getComponentName(module)),
 *       viewModel: viewModel,
 *       metadata:  JSON.parse(metadata)
 *     });
 *   });
 */
define([], function () {
  'use strict';

  var self = {};

  // ── getComponentName ─────────────────────────────────────────
  // Extracts the component folder name from the AMD module ID.
  // module.id for 'components/accounts/account-list/loader'
  //   → second-to-last segment → 'account-list'
  self.getComponentName = function (module) {
    var id = module && (module.id || (typeof module === 'string' ? module : ''));
    if (!id) return 'obdx-component';
    var parts = id.replace(/\\/g, '/').split('/');
    // Remove trailing 'loader' or 'index' segment to get the folder name
    var last = parts[parts.length - 1];
    if (last === 'loader' || last === 'index') parts.pop();
    return parts[parts.length - 1] || 'obdx-component';
  };

  // ── transformTemplate ────────────────────────────────────────
  // Scopes CSS to a container class, injects <style>, wraps view.
  // Idempotent — will not re-inject a style tag that already exists.
  self.transformTemplate = function (view, css, componentName) {
    if (css && componentName) {
      var styleId = 'obdx-component-style-' + componentName;

      if (!document.getElementById(styleId)) {
        var containerClass = '.' + componentName + '-container';
        // Scope each rule block to the container class.
        // Skips at-rules (@keyframes, @media wrapper lines), percentage keyframe selectors,
        // and the container class itself (avoids double-scoping on re-register).
        var scopedCss = css.replace(/(\/\*[\s\S]*?\*\/)|([^{}]+)\{/g, function (match, comment, selector) {
          if (comment) return comment;
          var s = selector.trim();
          // Skip: at-rules, keyframe steps, already scoped, :root
          if (!s || s.charAt(0) === '@' || /^(from|to|\d)/.test(s) || s.indexOf(containerClass) !== -1 || s === ':root') {
            return match;
          }
          // Scope each comma-separated part
          var scoped = s.split(',').map(function (part) {
            return containerClass + ' ' + part.trim();
          }).join(', ');
          return scoped + ' {';
        });

        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = scopedCss;
        document.head.appendChild(style);
      }
    }

    if (componentName) {
      return '<div class="' + componentName + '-container">' + view + '</div>';
    }
    return view;
  };

  // ── loadCSS ──────────────────────────────────────────────────
  // Non-blocking stylesheet injection with dedup guard.
  // Uses print→all media swap trick to avoid render-blocking.
  self.loadCSS = function (url) {
    if (!url) return;
    if (document.querySelector('link[data-obdx-css="' + url + '"]')) return;
    var link = document.createElement('link');
    link.rel   = 'stylesheet';
    link.media = 'print';
    link.href  = url;
    link.setAttribute('data-obdx-css', url);
    link.onload = function () { link.media = 'all'; };
    document.head.appendChild(link);
    link.media = 'all';  // set synchronously too for browsers that fire onload late
  };

  return self;
});
