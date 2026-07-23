define([
  'knockout',
  'services/AccountService',
  'ojs/ojknockout',
  'acct-components/account-list/loader',
  'acct-components/deposits/loader',
  'acct-components/loans/loader',
  'acct-components/account-detail/loader',
  'acct-components/sheets/loader'
], function (ko, AccountService) {
  'use strict';

  function _loadCss(url) {
    if (!document.querySelector('link[data-cid="' + url + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url;
      l.setAttribute('data-cid', url);
      document.head.appendChild(l);
    }
  }

  function AccountsViewModel() {
    var self = this;
    _loadCss('/components/accounts/accounts-main/accounts-main.css');

    // ── Core state ────────────────────────────────────────────
    self.isLoading     = ko.observable(true);
    self.accounts      = ko.observableArray([]);
    self.transactions  = ko.observableArray([]);
    self.totalBalance  = ko.observable(0);

    self.selectedAccount = ko.observable(null);
    self.detailPanelOpen = ko.observable(false);

    self.activeTab = ko.observable('current_savings');
    self.tabs = [
      { id: 'current_savings', label: 'Current & Savings' },
      { id: 'deposits',        label: 'Deposits'          },
      { id: 'loans',           label: 'Loans'             }
    ];
    self.selectTab  = function (tab) { self.activeTab(tab.id); };
    self.tabClass   = function (tab) { return self.activeTab() === tab.id ? 'acc-tab active' : 'acc-tab'; };

    self.showCurrentSavings = ko.computed(function () { return self.activeTab() === 'current_savings'; });
    self.showDeposits       = ko.computed(function () { return self.activeTab() === 'deposits'; });
    self.showLoans          = ko.computed(function () { return self.activeTab() === 'loans'; });

    self.cardView      = ko.observable(false);
    self.setListView   = function () { self.cardView(false); };
    self.setCardView   = function () { self.cardView(true); };
    self.carouselIndex = ko.observable(0);
    self.goToCard      = function (idx) { self.carouselIndex(idx); };

    self.currentAccounts = ko.computed(function () {
      return self.accounts().filter(function (a) {
        return a.type === 'CURRENT' || a.type === 'SAVINGS';
      });
    });

    // ── Detail tab state ──────────────────────────────────────
    self.detailTab    = ko.observable('overview');
    self.analyticsTab = ko.observable('month');
    self.txFilter     = ko.observable('all');
    self.txPeriod     = ko.observable('This Month');

    self.setTxFilter = function (f) { self.txFilter(f); };
    self.openTxPeriodPicker = function () {
      window.amanApp && window.amanApp.openPicker('Filter by Period', [
        { label: 'Today',         value: 'today'      },
        { label: 'Last 7 Days',   value: '7d'         },
        { label: 'This Month',    value: 'month'      },
        { label: 'Last Month',    value: 'last_month' },
        { label: 'Last 3 Months', value: '3m'         },
        { label: 'Last 6 Months', value: '6m'         },
        { label: 'This Year',     value: 'year'       },
        { label: 'Custom Range',  value: 'custom'     }
      ], function (opt) { self.txPeriod(opt.label); window.amanApp.showToast('Showing: ' + opt.label, 'info'); });
    };
    self.openTransfer = function () { window.amanApp && window.amanApp.navigate('pay'); };

    // ── Sheet state ───────────────────────────────────────────
    function _reg(fn) { window.amanApp && window.amanApp.registerSheetClose(fn); }

    self.showShareIBAN      = ko.observable(false);
    self.showStatement      = ko.observable(false);
    self.showMoreActions    = ko.observable(false);
    self.showAccountAlerts  = ko.observable(false);
    self.showChequeBook     = ko.observable(false);
    self.showChequeStatus   = ko.observable(false);
    self.showStopCheque     = ko.observable(false);
    self.showEStatement     = ko.observable(false);
    self.showNickname       = ko.observable(false);
    self.showBlockAccount   = ko.observable(false);
    self.statementPeriod    = ko.observable('3m');
    self.chequeBookLeaves   = ko.observable(25);
    self.chequeDelivery     = ko.observable('branch');
    self.stopChequeTab      = ko.observable('stop');
    self.stopChequeReason   = ko.observable('');
    self.eStatFrequency     = ko.observable('Monthly');
    self.isPrimaryAccount   = ko.observable(false);

    self._resetAllSheets = function () {
      self.showShareIBAN(false); self.showStatement(false); self.showMoreActions(false);
      self.showAccountAlerts(false); self.showChequeBook(false); self.showChequeStatus(false);
      self.showStopCheque(false); self.showEStatement(false); self.showNickname(false);
      self.showBlockAccount(false);
    };

    self.openShareIBAN  = function () { self.showShareIBAN(true);   _reg(self.closeShareIBAN);  };
    self.closeShareIBAN = function () {
      self.showShareIBAN(false);
      if (!self.detailPanelOpen()) { self.selectedAccount(null); window.amanApp && window.amanApp.setPanelOpen(false); }
    };
    self.openShareIBANFor = function (account) {
      self.showStatement(false); self.showMoreActions(false);
      self.selectedAccount(account); self.showShareIBAN(true);
      window.amanApp && window.amanApp.setPanelOpen(true); _reg(self.closeShareIBAN);
    };

    self.openStatement  = function () { self.showStatement(true); _reg(self.closeStatement); };
    self.closeStatement = function () {
      self.showStatement(false);
      if (!self.detailPanelOpen()) { self.selectedAccount(null); window.amanApp && window.amanApp.setPanelOpen(false); }
    };
    self.setStatementPeriod = function (p) { self.statementPeriod(p); };
    self.openStatementFor = function (account) {
      self.showShareIBAN(false); self.showMoreActions(false);
      self.selectedAccount(account); self.showStatement(true);
      window.amanApp && window.amanApp.setPanelOpen(true); _reg(self.closeStatement);
    };

    self.openMoreActions  = function () { self.showMoreActions(true); _reg(self.closeMoreActions); };
    self.closeMoreActions = function () { self.showMoreActions(false); };
    self.setPrimaryAccount = function () {
      self.isPrimaryAccount(true); self.showMoreActions(false);
      window.amanApp && window.amanApp.showToast('Primary account updated', 'success');
    };

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

    self.selectCBLeaves    = function (n) { self.chequeBookLeaves(n); };
    self.selectCBDelivery  = function (d) { self.chequeDelivery(d); };
    self.switchStopTab     = function (t) { self.stopChequeTab(t); };

    self.confirmChequeBook   = function () { self.closeChequeBook();  window.amanApp && window.amanApp.showToast('Cheque book requested', 'success'); };
    self.confirmStopCheque   = function () { self.closeStopCheque();  window.amanApp && window.amanApp.showToast('Stop request submitted', 'success'); };
    self.saveAlerts          = function () { self.closeAccountAlerts(); window.amanApp && window.amanApp.showToast('Alert preferences saved', 'success'); };
    self.subscribeEStatement = function () { self.closeEStatement();  window.amanApp && window.amanApp.showToast('E-statement updated', 'success'); };
    self.saveNickname        = function () { self.closeNickname();     window.amanApp && window.amanApp.showToast('Nickname saved', 'success'); };
    self.confirmBlockAccount = function () { self.closeBlockAccount(); window.amanApp && window.amanApp.showToast('Account blocked', 'error'); };

    // ── Account detail open/close ─────────────────────────────
    self.openAccountDetail = function (account) {
      self.detailTab('overview'); self.isPrimaryAccount(false);
      self._resetAllSheets();
      self.selectedAccount(account); self.detailPanelOpen(true);
      window.amanApp && window.amanApp.setPanelOpen(true);
    };
    self.closeAccountDetail = function () {
      self.detailPanelOpen(false); self.selectedAccount(null);
      self._resetAllSheets();
      window.amanApp && window.amanApp.setPanelOpen(false);
    };

    // ── Helpers ───────────────────────────────────────────────
    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    self.txIconBg = function (category) {
      var map = { salary: '#DCFCE7', transfer: '#FEE2E2', bill: '#FEF3C7', shop: '#DBEAFE', atm: '#EDE9FE', dine: '#FCE7EE' };
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

    // ── CCA params objects ────────────────────────────────────
    self.accountListParams = {
      currentAccounts:   self.currentAccounts,
      transactions:      self.transactions,
      cardView:          self.cardView,
      carouselIndex:     self.carouselIndex,
      openAccountDetail: self.openAccountDetail,
      openStatementFor:  self.openStatementFor,
      openShareIBANFor:  self.openShareIBANFor,
      setListView:       function () { self.setListView(); },
      setCardView:       function () { self.setCardView(); },
      goToCard:          self.goToCard,
      formatAmount:      self.formatAmount,
      txIconBg:          self.txIconBg,
      txIconSvg:         self.txIconSvg
    };

    self.accountDetailParams = {
      detailPanelOpen:    self.detailPanelOpen,
      selectedAccount:    self.selectedAccount,
      detailTab:          self.detailTab,
      analyticsTab:       self.analyticsTab,
      txFilter:           self.txFilter,
      txPeriod:           self.txPeriod,
      transactions:       self.transactions,
      setTxFilter:        self.setTxFilter,
      openTxPeriodPicker: self.openTxPeriodPicker,
      formatAmount:       self.formatAmount,
      openTransfer:       self.openTransfer,
      openStatement:      self.openStatement,
      openShareIBAN:      self.openShareIBAN,
      openMoreActions:    self.openMoreActions,
      closeAccountDetail: self.closeAccountDetail
    };

    self.sheetsParams = {
      selectedAccount:     self.selectedAccount,
      showShareIBAN:       self.showShareIBAN,    closeShareIBAN:     self.closeShareIBAN,
      showStatement:       self.showStatement,    closeStatement:     self.closeStatement,
      statementPeriod:     self.statementPeriod,  setStatementPeriod: self.setStatementPeriod,
      showMoreActions:     self.showMoreActions,  closeMoreActions:   self.closeMoreActions,
      openStatement:       self.openStatement,    openShareIBAN:      self.openShareIBAN,
      setPrimaryAccount:   self.setPrimaryAccount,
      openAccountAlerts:   self.openAccountAlerts,
      openChequeBook:      self.openChequeBook,
      openChequeStatus:    self.openChequeStatus,
      openStopCheque:      self.openStopCheque,
      openEStatement:      self.openEStatement,
      openNickname:        self.openNickname,
      openBlockAccount:    self.openBlockAccount,
      showAccountAlerts:   self.showAccountAlerts, closeAccountAlerts: self.closeAccountAlerts, saveAlerts: self.saveAlerts,
      showChequeBook:      self.showChequeBook,    closeChequeBook:    self.closeChequeBook,    confirmChequeBook:  self.confirmChequeBook,
      chequeBookLeaves:    self.chequeBookLeaves,  chequeDelivery:     self.chequeDelivery,
      selectCBLeaves:      self.selectCBLeaves,    selectCBDelivery:   self.selectCBDelivery,
      showChequeStatus:    self.showChequeStatus,  closeChequeStatus:  self.closeChequeStatus,
      showStopCheque:      self.showStopCheque,    closeStopCheque:    self.closeStopCheque,    confirmStopCheque:  self.confirmStopCheque,
      stopChequeTab:       self.stopChequeTab,     switchStopTab:      self.switchStopTab,       stopChequeReason:   self.stopChequeReason,
      showEStatement:      self.showEStatement,    closeEStatement:    self.closeEStatement,     subscribeEStatement: self.subscribeEStatement,
      eStatFrequency:      self.eStatFrequency,
      showNickname:        self.showNickname,      closeNickname:      self.closeNickname,       saveNickname:       self.saveNickname,
      showBlockAccount:    self.showBlockAccount,  closeBlockAccount:  self.closeBlockAccount,   confirmBlockAccount: self.confirmBlockAccount
    };

    // ── Data load ─────────────────────────────────────────────
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

    /* ── Account card carousel ── */
    (function () {
      var ready = false, track, startX = 0, isDragging = false, idx = 0, TOTAL = 2;
      function step() { var c = track && track.querySelector('.hero-card'); return (c && c.offsetWidth) ? c.offsetWidth + 16 : 400; }
      /* Apply resting 3D perspective tilt to each card based on offset from active */
      function applyRestingTilts(activeIdx) {
        var cards = track ? track.querySelectorAll('.hero-card') : [];
        cards.forEach(function (c, i) {
          var offset = i - activeIdx;
          if (offset === 0) {
            /* Active card: slight left-back tilt like reference */
            c.style.transform = 'perspective(700px) rotateY(-8deg) rotateZ(-1.5deg)';
          } else if (offset > 0) {
            /* Cards to the right: slight forward/right tilt, peeking */
            c.style.transform = 'perspective(700px) rotateY(4deg) rotateZ(1deg) scale(0.94)';
          } else {
            /* Cards to the left (already swiped past) */
            c.style.transform = 'perspective(700px) rotateY(-4deg) rotateZ(-1deg) scale(0.94)';
          }
        });
      }
      /* During drag: intensify tilt on active, counter-tilt on neighbours */
      function applyDragTilt(diff) {
        var cards = track ? track.querySelectorAll('.hero-card') : [];
        var drag = Math.max(-1, Math.min(1, diff / 120));
        cards.forEach(function (c, i) {
          var offset = i - idx;
          var baseY  = offset === 0 ? -8 : (offset > 0 ? 4 : -4);
          var baseZ  = offset === 0 ? -1.5 : (offset > 0 ? 1 : -1);
          var scale  = offset === 0 ? 1 : 0.94;
          var tiltY  = baseY + drag * 10;
          var tiltZ  = baseZ + drag * 3;
          c.style.transform = 'perspective(700px) rotateY(' + tiltY + 'deg) rotateZ(' + tiltZ + 'deg) scale(' + scale + ')';
        });
      }
      function goTo(n) {
        idx = Math.max(0, Math.min(TOTAL - 1, n));
        self.carouselIndex(idx);
        if (!track) return;
        track.style.transform = 'translateX(-' + (idx * step()) + 'px)';
        document.querySelectorAll('.card-dot').forEach(function (d, i) { d.classList.toggle('active', i === idx); });
        track.querySelectorAll('.hero-card').forEach(function (c, i) { c.classList.toggle('card-inactive', i !== idx); });
        applyRestingTilts(idx);
      }
      function initCarousel() {
        track = document.getElementById('accCarouselTrack');
        var card = track && track.querySelector('.hero-card');
        if (!card || card.offsetWidth === 0) { setTimeout(initCarousel, 200); return; }
        if (ready) { goTo(0); return; }
        ready = true;
        track.addEventListener('mousedown', function (e) { startX = e.clientX; isDragging = true; track.classList.add('no-transition'); });
        document.addEventListener('mousemove', function (e) {
          if (!isDragging) return;
          var diff = e.clientX - startX;
          track.style.transform = 'translateX(-' + (idx * step() - diff) + 'px)';
          applyDragTilt(diff);
        });
        document.addEventListener('mouseup', function (e) {
          if (!isDragging) return;
          isDragging = false; track.classList.remove('no-transition');
          var d = e.clientX - startX;
          goTo(Math.abs(d) > 40 ? (d < 0 ? idx + 1 : idx - 1) : idx);
        });
        track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; isDragging = true; track.classList.add('no-transition'); }, { passive: true });
        track.addEventListener('touchmove', function (e) {
          if (!isDragging) return;
          var diff = e.touches[0].clientX - startX;
          track.style.transform = 'translateX(-' + (idx * step() - diff) + 'px)';
          applyDragTilt(diff);
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
          isDragging = false; track.classList.remove('no-transition');
          var d = e.changedTouches[0].clientX - startX;
          goTo(Math.abs(d) > 40 ? (d < 0 ? idx + 1 : idx - 1) : idx);
        });
        document.querySelectorAll('.card-dot').forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
        goTo(0);
      }
      var _origSetCardView = self.setCardView;
      self.setCardView = function () { _origSetCardView(); setTimeout(initCarousel, 300); };
    }());

    var _loadTimer = null;
    self.handleActivated = function () { clearTimeout(_loadTimer); _loadTimer = setTimeout(function () { self._load(); }, 50); };
    self._load();
  }

  return AccountsViewModel;
});
