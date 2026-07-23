define(['knockout'], function (ko) {

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  function DepositsViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context; // eslint-disable-line no-unused-vars
    _loadCss('/components/accounts/deposits/deposits.css');
    // Static screen — no dynamic data needed for now
  }

  return DepositsViewModel;
});
