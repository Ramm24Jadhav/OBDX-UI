define([
  'knockout',
  'services/AccountService',
  'ojs/ojknockout'
], function (ko, AccountService) {

  function AccountsViewModel() {
    var self = this;

    self.isLoading       = ko.observable(true);
    self.accounts        = ko.observableArray([]);
    self.transactions    = ko.observableArray([]);
    self.totalBalance    = ko.observable(0);
    self.selectedAccount   = ko.observable(null);
    self.detailPanelOpen   = ko.observable(false);
    self.activeTab         = ko.observable('current_savings');
    self.cardView        = ko.observable(false); // false=list, true=card carousel

    self.tabs = [
      { id: 'current_savings', label: 'Current & Savings' },
      { id: 'deposits',        label: 'Deposits'          },
      { id: 'loans',           label: 'Loans'             }
    ];

    self.showCurrentSavings = ko.computed(function () { return self.activeTab() === 'current_savings'; });
    self.showDeposits       = ko.computed(function () { return self.activeTab() === 'deposits'; });
    self.showLoans          = ko.computed(function () { return self.activeTab() === 'loans'; });

    self.selectTab = function (tab) { self.activeTab(tab.id); };

    self.tabClass = function (tab) {
      return self.activeTab() === tab.id ? 'acc-tab active' : 'acc-tab';
    };

    self.setListView = function () { self.cardView(false); };
    self.setCardView = function () { self.cardView(true); };

    self.currentAccounts = ko.computed(function () {
      return self.accounts().filter(function (a) {
        return a.type === 'CURRENT' || a.type === 'SAVINGS';
      });
    });

    // ── Carousel ──────────────────────────────────────────────
    self.carouselIndex = ko.observable(0);
    self.goToCard = function (idx) { self.carouselIndex(idx); };

    // ── Account detail tab ────────────────────────────────────
    self.detailTab = ko.observable('overview');

    // ── Transfer ──────────────────────────────────────────────
    self.openTransfer = function () {
      window.amanApp && window.amanApp.navigate('pay');
    };

    function _reg(fn) { window.amanApp && window.amanApp.registerSheetClose(fn); }

    // ── Share IBAN sheet ──────────────────────────────────────
    self.showShareIBAN = ko.observable(false);
    self.openShareIBAN = function () { self.showShareIBAN(true); _reg(self.closeShareIBAN); };
    self.closeShareIBAN = function () {
      self.showShareIBAN(false);
      if (!self.detailPanelOpen()) {
        self.selectedAccount(null);
        window.amanApp && window.amanApp.setPanelOpen(false);
      }
    };
    self.openShareIBANFor = function (account) {
      self.showStatement(false); self.showMoreActions(false);
      self.selectedAccount(account); self.showShareIBAN(true);
      window.amanApp && window.amanApp.setPanelOpen(true);
      _reg(self.closeShareIBAN);
    };

    // ── Statement sheet ───────────────────────────────────────
    self.showStatement = ko.observable(false);
    self.statementPeriod = ko.observable('3m');
    self.openStatement = function () { self.showStatement(true); _reg(self.closeStatement); };
    self.closeStatement = function () {
      self.showStatement(false);
      if (!self.detailPanelOpen()) {
        self.selectedAccount(null);
        window.amanApp && window.amanApp.setPanelOpen(false);
      }
    };
    self.setStatementPeriod = function (p) { self.statementPeriod(p); };
    self.openStatementFor = function (account) {
      self.showShareIBAN(false); self.showMoreActions(false);
      self.selectedAccount(account); self.showStatement(true);
      window.amanApp && window.amanApp.setPanelOpen(true);
      _reg(self.closeStatement);
    };

    // ── More actions sheet ────────────────────────────────────
    self.showMoreActions = ko.observable(false);
    self.isPrimaryAccount = ko.observable(false);
    self.openMoreActions = function () { self.showMoreActions(true); _reg(self.closeMoreActions); };
    self.closeMoreActions = function () { self.showMoreActions(false); };
    self.setPrimaryAccount = function () {
      self.isPrimaryAccount(true);
      self.showMoreActions(false);
      window.amanApp && window.amanApp.showToast('Primary account updated', 'success');
    };

    // ── Sub-sheets (from More Options) ───────────────────────
    self.showAccountAlerts  = ko.observable(false);
    self.showChequeBook     = ko.observable(false);
    self.showChequeStatus   = ko.observable(false);
    self.showStopCheque     = ko.observable(false);
    self.showEStatement     = ko.observable(false);
    self.showNickname       = ko.observable(false);
    self.showBlockAccount   = ko.observable(false);
    self.chequeBookLeaves   = ko.observable(25);
    self.chequeDelivery     = ko.observable('branch');
    self.stopChequeTab      = ko.observable('stop');
    self.stopChequeReason   = ko.observable('');
    self.eStatFrequency     = ko.observable('Monthly');

    self.openAccountAlerts  = function () { self.closeMoreActions(); self.showAccountAlerts(true);  _reg(self.closeAccountAlerts); };
    self.closeAccountAlerts = function () { self.showAccountAlerts(false); };
    self.openChequeBook     = function () { self.closeMoreActions(); self.showChequeBook(true);     _reg(self.closeChequeBook); };
    self.closeChequeBook    = function () { self.showChequeBook(false); };
    self.openChequeStatus   = function () { self.closeMoreActions(); self.showChequeStatus(true);   _reg(self.closeChequeStatus); };
    self.closeChequeStatus  = function () { self.showChequeStatus(false); };
    self.openStopCheque     = function () { self.closeMoreActions(); self.showStopCheque(true);     _reg(self.closeStopCheque); };
    self.closeStopCheque    = function () { self.showStopCheque(false); };
    self.openEStatement     = function () { self.closeMoreActions(); self.showEStatement(true);     _reg(self.closeEStatement); };
    self.closeEStatement    = function () { self.showEStatement(false); };
    self.openNickname       = function () { self.closeMoreActions(); self.showNickname(true);       _reg(self.closeNickname); };
    self.closeNickname      = function () { self.showNickname(false); };
    self.openBlockAccount   = function () { self.closeMoreActions(); self.showBlockAccount(true);   _reg(self.closeBlockAccount); };
    self.closeBlockAccount  = function () { self.showBlockAccount(false); };

    self.selectCBLeaves   = function (n) { self.chequeBookLeaves(n); };
    self.selectCBDelivery = function (d) { self.chequeDelivery(d); };
    self.switchStopTab    = function (t) { self.stopChequeTab(t); };

    self.confirmChequeBook = function () {
      self.closeChequeBook();
      window.amanApp && window.amanApp.showToast('Cheque book requested successfully', 'success');
    };
    self.confirmStopCheque = function () {
      self.closeStopCheque();
      window.amanApp && window.amanApp.showToast('Cheque stop request submitted', 'success');
    };
    self.saveAlerts = function () {
      self.closeAccountAlerts();
      window.amanApp && window.amanApp.showToast('Alert preferences saved', 'success');
    };
    self.subscribeEStatement = function () {
      self.closeEStatement();
      window.amanApp && window.amanApp.showToast('E-statement subscription updated', 'success');
    };
    self.saveNickname = function () {
      self.closeNickname();
      window.amanApp && window.amanApp.showToast('Account nickname saved', 'success');
    };
    self.confirmBlockAccount = function () {
      self.closeBlockAccount();
      window.amanApp && window.amanApp.showToast('Account blocked temporarily', 'error');
    };

    self.anySheetOpen = ko.computed(function () {
      return self.showShareIBAN() || self.showStatement() || self.showMoreActions() ||
        self.showAccountAlerts() || self.showChequeBook() || self.showChequeStatus() ||
        self.showStopCheque() || self.showEStatement() || self.showNickname() || self.showBlockAccount();
    });

    self._resetAllSheets = function () {
      self.showShareIBAN(false); self.showStatement(false); self.showMoreActions(false);
      self.showAccountAlerts(false); self.showChequeBook(false); self.showChequeStatus(false);
      self.showStopCheque(false); self.showEStatement(false); self.showNickname(false);
      self.showBlockAccount(false);
    };

    self.openAccountDetail = function (account) {
      self.detailTab('overview');
      self.isPrimaryAccount(false);
      self._resetAllSheets();
      self.selectedAccount(account);
      self.detailPanelOpen(true);
      window.amanApp && window.amanApp.setPanelOpen(true);
    };
    self.closeAccountDetail = function () {
      self.detailPanelOpen(false);
      self.selectedAccount(null);
      self._resetAllSheets();
      window.amanApp && window.amanApp.setPanelOpen(false);
    };

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    self.txIconBg = function (category) {
      var map = {
        salary: '#DCFCE7', transfer: '#FEE2E2', bill: '#FEF3C7',
        shop: '#DBEAFE', atm: '#EDE9FE', dine: '#FCE7EE'
      };
      return map[category] || '#F3F4F6';
    };

    self.txIconSvg = function (category) {
      var map = {
        salary:   '<svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
        transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        bill:     '<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        shop:     '<svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        atm:      '<svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        dine:     '<svg viewBox="0 0 24 24" fill="none" stroke="#7A1531" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'
      };
      return map[category] || map['shop'];
    };

    self._load = function () {
      self.isLoading(true);
      Promise.all([
        AccountService.getAccounts(),
        AccountService.getTransactions('ACC-4829')
      ]).then(function (res) {
        self.accounts(res[0].accounts || []);
        self.totalBalance(res[0].totalBalance.amount);
        self.transactions((res[1].transactions || []).slice(0, 4));
      }).catch(function () {
        window.amanApp && window.amanApp.showToast('Failed to load accounts', 'error');
      }).finally(function () { self.isLoading(false); });
    };

    var _loadTimer = null;
    self._scheduleLoad = function () {
      clearTimeout(_loadTimer);
      _loadTimer = setTimeout(function () { self._load(); }, 50);
    };

    self.handleActivated = function () { self._scheduleLoad(); };
    self._scheduleLoad();
  }

  return AccountsViewModel;
});
