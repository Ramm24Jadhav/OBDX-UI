define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  function SheetsViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;
    _loadCss('/components/accounts/sheets/sheets.css');
    // Shared data
    self.selectedAccount    = params.selectedAccount;
    // Share IBAN
    self.showShareIBAN      = params.showShareIBAN;
    self.closeShareIBAN     = params.closeShareIBAN;
    // Statement
    self.showStatement      = params.showStatement;
    self.closeStatement     = params.closeStatement;
    self.statementPeriod    = params.statementPeriod;
    self.setStatementPeriod = params.setStatementPeriod;
    // More actions
    self.showMoreActions    = params.showMoreActions;
    self.closeMoreActions   = params.closeMoreActions;
    self.openStatement      = params.openStatement;
    self.openShareIBAN      = params.openShareIBAN;
    self.setPrimaryAccount  = params.setPrimaryAccount;
    self.openAccountAlerts  = params.openAccountAlerts;
    self.openChequeBook     = params.openChequeBook;
    self.openChequeStatus   = params.openChequeStatus;
    self.openStopCheque     = params.openStopCheque;
    self.openEStatement     = params.openEStatement;
    self.openNickname       = params.openNickname;
    self.openBlockAccount   = params.openBlockAccount;
    // Account Alerts
    self.showAccountAlerts  = params.showAccountAlerts;
    self.closeAccountAlerts = params.closeAccountAlerts;
    self.saveAlerts         = params.saveAlerts;
    // Cheque Book
    self.showChequeBook     = params.showChequeBook;
    self.closeChequeBook    = params.closeChequeBook;
    self.confirmChequeBook  = params.confirmChequeBook;
    self.chequeBookLeaves   = params.chequeBookLeaves;
    self.chequeDelivery     = params.chequeDelivery;
    self.selectCBLeaves     = params.selectCBLeaves;
    self.selectCBDelivery   = params.selectCBDelivery;
    // Cheque Status
    self.showChequeStatus   = params.showChequeStatus;
    self.closeChequeStatus  = params.closeChequeStatus;
    // Stop Cheque
    self.showStopCheque     = params.showStopCheque;
    self.closeStopCheque    = params.closeStopCheque;
    self.confirmStopCheque  = params.confirmStopCheque;
    self.stopChequeTab      = params.stopChequeTab;
    self.switchStopTab      = params.switchStopTab;
    self.stopChequeReason   = params.stopChequeReason;
    // E-statement
    self.showEStatement     = params.showEStatement;
    self.closeEStatement    = params.closeEStatement;
    self.subscribeEStatement = params.subscribeEStatement;
    self.eStatFrequency     = params.eStatFrequency;
    // Nickname
    self.showNickname       = params.showNickname;
    self.closeNickname      = params.closeNickname;
    self.saveNickname       = params.saveNickname;
    // Block Account
    self.showBlockAccount   = params.showBlockAccount;
    self.closeBlockAccount  = params.closeBlockAccount;
    self.confirmBlockAccount = params.confirmBlockAccount;
  }

  return SheetsViewModel;
});
