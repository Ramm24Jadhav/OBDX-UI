define([
  'knockout',
  'shared-components/utils',
  'services/AccountService',
  'services/UserService',
  'ojL10n!components/home/nls/strings',
  'ojs/ojknockout',
  'home-components/home-appbar/loader',
  'home-components/home-balance-summary/loader',
  'home-components/home-spending-overview/loader',
  'home-components/home-quick-actions/loader',
  'home-components/home-recent-tx/loader',
  'home-components/home-notifications-panel/loader',
  'home-components/home-analytics-panel/loader'
], function (ko, utils, AccountService, UserService, nls) {

  function HomeViewModel() {
    var self = this;
    self.nls = nls;
    utils.loadCss('/components/home/home.css');

    // ── State ─────────────────────────────────────────────────
    self.isLoading         = ko.observable(true);
    self.accounts          = ko.observableArray([]);
    self.transactions      = ko.observableArray([]);
    self.totalBalance      = ko.observable(0);
    self.balanceMasked     = ko.observable(false);
    self.notifications     = ko.observableArray([]);
    self.unreadCount       = ko.observable(3);
    self.currentLang       = ko.observable('en');
    self.showNotifications = ko.observable(false);
    self.showAnalytics     = ko.observable(false);
    self.heroCollapsed     = ko.observable(false);

    // ── Notification data ─────────────────────────────────────
    self.notifList = ko.observableArray([
      { title: 'Salary Credited', sub: 'LYD 18,500 from National Corp.', time: 'Today, 08:00', read: false,
        iconBg: '#DCFCE7', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>' },
      { title: 'Transfer Successful', sub: 'LYD 500 sent to Mohammed Al-Qahtani', time: 'Today, 09:14', read: false,
        iconBg: '#FCE7EE', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#7A1531" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
      { title: 'Bill Due Soon', sub: 'DEWA Electricity · LYD 420 due in 3 days', time: 'Yesterday', read: false,
        iconBg: '#FEF3C7', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
      { title: 'Card Statement Ready', sub: 'Your July 2026 statement is available', time: '18 Jul', read: true,
        iconBg: '#DBEAFE', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
      { title: 'New Offer Available', sub: 'Get 2% cashback on international transfers', time: '17 Jul', read: true,
        iconBg: '#EDE9FE', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' }
    ]);

    // ── Analytics period ──────────────────────────────────────
    self.anPeriod = ko.observable('month');
    self.anSetPeriod = function (p) { self.anPeriod(p); };

    var _anData = {
      month:   { income: 'LYD 27,600', incomeK: 'LYD 27.6K', expense: 'LYD 12,420', expenseK: 'LYD 12.4K', savings: 'LYD 8,820', savingsK: 'LYD 8.8K', netK: '+6.4K' },
      quarter: { income: 'LYD 82,800', incomeK: 'LYD 82.8K', expense: 'LYD 37,260', expenseK: 'LYD 37.3K', savings: 'LYD 26,460', savingsK: 'LYD 26.5K', netK: '+19K' },
      year:    { income: 'LYD 331K',   incomeK: 'LYD 331K',  expense: 'LYD 149K',   expenseK: 'LYD 149K',  savings: 'LYD 105K',   savingsK: 'LYD 105K',  netK: '+77K' }
    };
    self.anSummary = ko.computed(function () { return _anData[self.anPeriod()] || _anData.month; });

    self.analyticsCategories = [
      { label: 'Food & Dining',    amount: '3,840', pct: 31, color: '#7A1531' },
      { label: 'Shopping',         amount: '2,960', pct: 24, color: '#C8A45D' },
      { label: 'Bills & Utilities',amount: '2,100', pct: 17, color: '#2563EB' },
      { label: 'Transport',        amount: '1,490', pct: 12, color: '#16A34A' },
      { label: 'Entertainment',    amount: '1,240', pct: 10, color: '#7C3AED' },
      { label: 'Others',           amount: '790',   pct: 6,  color: '#9CA3AF' }
    ];

    // ── Computed ──────────────────────────────────────────────
    self.greeting = ko.computed(function () {
      var h = new Date().getHours();
      if (h < 12) return 'Good morning';
      if (h < 17) return 'Good afternoon';
      return 'Good evening';
    });

    self.userName = ko.computed(function () {
      return window.obdxApp ? window.obdxApp.currentUser().name.split(' ')[0] : 'Mohammed';
    });

    self.displayTRV = ko.computed(function () {
      if (self.balanceMasked()) return 'LYD •••,•••.••';
      return 'LYD ' + _fmt(self.totalBalance() * 4.5 || 1245780.50);
    });

    self.displayAvailBal = ko.computed(function () {
      if (self.balanceMasked()) return 'LYD •••,•••';
      return 'LYD ' + _fmt(self.totalBalance() || 456780);
    });

    // ── Actions ───────────────────────────────────────────────
    self.toggleBalance = function () {
      self.balanceMasked(!self.balanceMasked());
      window.obdxApp && window.obdxApp.toggleBalanceMask();
    };

    self.toggleLang = function () {
      var next = self.currentLang() === 'en' ? 'ar' : 'en';
      self.currentLang(next);
      window.obdxApp && window.obdxApp.toggleLang && window.obdxApp.toggleLang(next);
    };

    self.goToAccounts = function () { window.obdxApp && window.obdxApp.navigate('accounts'); };
    self.goToPay      = function () { window.obdxApp && window.obdxApp.navigate('pay'); };
    self.goToMore     = function () { window.obdxApp && window.obdxApp.navigate('more'); };
    self.goToNotifs   = function () { self.showNotifications(true); };

    self.openNotifications  = function () { self.showNotifications(true); };
    self.closeNotifications = function () { self.showNotifications(false); };
    self.markAllRead = function () {
      self.notifList().forEach(function (n) { n.read = true; });
      self.notifList.valueHasMutated();
      self.unreadCount(0);
    };

    self.openAnalytics  = function () { self.showAnalytics(true); };
    self.closeAnalytics = function () { self.showAnalytics(false); };

    self.formatAmount = function (amount) { return _fmt(Math.abs(amount)); };

    // ── Transaction icon helpers ───────────────────────────────
    var _txIcons = {
      transfer: { bg: '#FEE2E2', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
      salary:   { bg: '#DCFCE7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' },
      bill:     { bg: '#FEF3C7', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
      shop:     { bg: '#DBEAFE', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
      atm:      { bg: '#EDE9FE', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
      dine:     { bg: '#FCE7EE', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#7A1531" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' }
    };

    self.txIconBg  = function (category) { return (_txIcons[category] || _txIcons['shop']).bg; };
    self.txIconSvg = function (category) { return (_txIcons[category] || _txIcons['shop']).svg; };

    // ── Lifecycle ─────────────────────────────────────────────
    var _loadTimer  = null;
    var _scrollEl   = null;
    var _heroEl     = null;
    var _heroBodyEl = null;
    var _handleEl   = null;
    var _onScroll   = null;
    var _openH      = 0;
    var CLOSED_H    = 56;

    self.handleActivated = function () {
      clearTimeout(_loadTimer);
      self._load();
    };

    self.connected = function () {
      self.handleActivated();
      setTimeout(function () {
        _scrollEl   = document.querySelector('.home-content');
        _heroEl     = document.querySelector('.home-hero-sheet');
        _heroBodyEl = document.querySelector('.home-hero-body');
        _handleEl   = document.getElementById('homeHeroDragHandle');
        if (!_scrollEl || !_heroEl) return;

        // Re-measure open height after data loads (balance summary renders behind isLoading guard)
        var _loadingSub = self.isLoading.subscribe(function (loading) {
          if (!loading) {
            setTimeout(function () {
              _heroEl.style.height = 'auto';
              _openH = _heroEl.scrollHeight;
              _heroEl.style.height = _openH + 'px';
            }, 60);
          }
        });

        // Scroll-driven collapse (uses same _snapTo path)
        _onScroll = function () {
          if (_dragging) return;
          var shouldCollapse = _scrollEl.scrollTop > 30;
          if (shouldCollapse !== self.heroCollapsed()) {
            _snapTo(!shouldCollapse);
          }
        };
        _scrollEl.addEventListener('scroll', _onScroll, { passive: true });

        // Drag-to-collapse/expand on handle
        var _dragging  = false;
        var _startY    = 0;
        var _startH    = 0;

        function _measureOpenH() {
          // Measure at full open: temporarily clear height constraint
          _heroEl.style.transition = 'none';
          _heroEl.style.height = 'auto';
          _openH = _heroEl.scrollHeight;
          // Restore current rendered height immediately so there's no jump
          _heroEl.style.height = _heroEl.offsetHeight + 'px';
        }

        function _setLive(h) {
          var bodyH = _openH - CLOSED_H;
          var pct   = bodyH > 0 ? Math.max(0, Math.min(1, (h - CLOSED_H) / bodyH)) : 1;
          _heroEl.style.transition    = 'none';
          _heroEl.style.height        = h + 'px';
          if (_heroBodyEl) {
            _heroBodyEl.style.transition = 'none';
            _heroBodyEl.style.opacity    = pct;
            // slide body up as sheet shrinks: 0% when open, -100% when closed
            _heroBodyEl.style.transform  = 'translateY(' + (-(1 - pct) * 100) + '%)';
          }
        }

        function _snapTo(open) {
          // Force a reflow so the transition picks up from current rendered position
          void _heroEl.offsetHeight;
          _heroEl.style.transition = '';
          _heroEl.style.height     = (open ? _openH : CLOSED_H) + 'px';
          if (_heroBodyEl) {
            _heroBodyEl.style.transition = '';
            _heroBodyEl.style.opacity    = open ? '' : '0';
            _heroBodyEl.style.transform  = open ? '' : 'translateY(-100%)';
          }
          self.heroCollapsed(!open);
          // Keep inline height managing the sheet — never clear it
        }

        function _onTouchStart(e) {
          _measureOpenH();
          _dragging = true;
          _startY   = e.touches[0].clientY;
          _startH   = _heroEl.offsetHeight;
        }

        function _onTouchMove(e) {
          if (!_dragging) return;
          var dy  = e.touches[0].clientY - _startY;
          var newH = Math.max(CLOSED_H, Math.min(_openH, _startH + dy));
          _setLive(newH);
        }

        function _onTouchEnd(e) {
          if (!_dragging) return;
          _dragging = false;
          var currentH = _heroEl.offsetHeight;
          var vel      = e.changedTouches[0].clientY - _startY;
          // Snap open if dragged down fast (vel > 40) or past midpoint; snap closed otherwise
          var mid  = (_openH + CLOSED_H) / 2;
          var open = vel > 40 || currentH > mid;
          _snapTo(open);
        }

        if (_handleEl) {
          _handleEl.addEventListener('touchstart', _onTouchStart, { passive: true });
          _handleEl.addEventListener('touchmove',  _onTouchMove,  { passive: true });
          _handleEl.addEventListener('touchend',   _onTouchEnd,   { passive: true });
        }

        // Also allow dragging from collapsed appbar area to re-expand
        var _appbarEl = document.querySelector('.home-hero-sheet .app-bar');
        if (_appbarEl) {
          _appbarEl.addEventListener('touchstart', function(e) {
            if (!self.heroCollapsed()) return;
            _measureOpenH();
            _dragging = true;
            _startY   = e.touches[0].clientY;
            _startH   = _heroEl.offsetHeight;
          }, { passive: true });
          _appbarEl.addEventListener('touchmove',  _onTouchMove,  { passive: true });
          _appbarEl.addEventListener('touchend',   _onTouchEnd,   { passive: true });
        }
      }, 100);
    };

    self.disconnected = function () {
      if (_scrollEl && _onScroll) {
        _scrollEl.removeEventListener('scroll', _onScroll);
      }
    };

    self._load = function () {
      Promise.all([
        AccountService.getAccounts(),
        AccountService.getTransactions('ACC-4829')
      ]).then(function (results) {
        self.accounts(results[0].accounts || []);
        self.totalBalance(results[0].totalBalance.amount);
        self.transactions((results[1].transactions || []).slice(0, 5));
      }).catch(function (err) {
        console.error('Home load error', err);
      }).finally(function () {
        self.isLoading(false);
      });
      // Load notifications in background — don't block initial render
      UserService.getNotifications().then(function (r) {
        self.notifications(r.notifications || []);
        self.unreadCount(r.unreadCount || 0);
      }).catch(function () {});
    };
  }

  function _fmt(n) {
    return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return HomeViewModel;
});
