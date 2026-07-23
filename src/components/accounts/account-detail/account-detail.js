define(['knockout'], function (ko) {

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  function AccountDetailViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    _loadCss('/components/accounts/account-detail/account-detail.css');
    self.detailPanelOpen      = params.detailPanelOpen;
    self.selectedAccount      = params.selectedAccount;
    self.detailTab            = params.detailTab;
    self.analyticsTab         = params.analyticsTab;
    self.txFilter             = params.txFilter;
    self.txPeriod             = params.txPeriod;
    self.transactions         = params.transactions;
    self.setTxFilter          = params.setTxFilter;
    self.openTxPeriodPicker   = params.openTxPeriodPicker;
    self.formatAmount         = params.formatAmount;
    self.openTransfer         = params.openTransfer;
    self.openStatement        = params.openStatement;
    self.openShareIBAN        = params.openShareIBAN;
    self.openMoreActions      = params.openMoreActions;
    self.closeAccountDetail   = params.closeAccountDetail;
  }

  return AccountDetailViewModel;
});
