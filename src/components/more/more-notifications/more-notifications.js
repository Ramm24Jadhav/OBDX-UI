define(['knockout', 'ojL10n!resources/nls/strings'], function (ko, nls) {
  'use strict';

  var ALL_ITEMS = [
    { id: 1, category: 'Security',      iconBg: '#FEE2E2', stroke: '#DC2626',
      icon: 'shield', title: 'Security Alert',
      sub: 'New device login detected — Chrome on Windows 11.',
      time: '2 min ago',      unread: ko.observable(true)  },
    { id: 2, category: 'Transactions',  iconBg: '#DCFCE7', stroke: '#16A34A',
      icon: 'credit',  title: 'Salary Credited',
      sub: 'LYD 18,500.00 credited to Savings ••8812.',
      time: 'Today, 9:15 AM', unread: ko.observable(true)  },
    { id: 3, category: 'Reminders',     iconBg: '#FEF3C7', stroke: '#D97706',
      icon: 'bolt',    title: 'Bill Due Soon',
      sub: 'DEWA bill of LYD 420.00 is due in 3 days.',
      time: 'Yesterday, 6:00 PM', unread: ko.observable(true) },
    { id: 4, category: 'Transactions',  iconBg: '#DBEAFE', stroke: '#2563EB',
      icon: 'cart',    title: 'Purchase Confirmed',
      sub: 'Noon.com — LYD 285.00 on Platinum Card.',
      time: 'Yesterday, 2:30 PM', unread: ko.observable(false) },
    { id: 5, category: 'Transactions',  iconBg: '#FCE7EE', stroke: '#7A1531',
      icon: 'send',    title: 'Transfer Successful',
      sub: 'LYD 5,000 sent to Sara Al-Mansouri.',
      time: 'Mon, 21 Jul 2026', unread: ko.observable(false) },
    { id: 6, category: 'Offers',        iconBg: '#EDE9FE', stroke: '#7C3AED',
      icon: 'gift',    title: 'Exclusive Offer',
      sub: 'Get 1.5% cashback on all fuel purchases this month.',
      time: 'Sun, 20 Jul 2026', unread: ko.observable(false) }
  ];

  var SVG_ICONS = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    credit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    bolt:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    cart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    send:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    gift:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>'
  };

  function NotificationsViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    self.items = ko.observableArray(ALL_ITEMS.map(function (n) {
      return Object.assign({}, n, { iconHtml: SVG_ICONS[n.icon] || '' });
    }));

    // ── Filter ────────────────────────────────────────────────
    self.filter = ko.observable('all'); // 'all' | 'unread'
    self.setFilter = function (f) { self.filter(f); };

    self.filtered = ko.computed(function () {
      if (self.filter() === 'unread') {
        return self.items().filter(function (n) { return n.unread(); });
      }
      return self.items();
    });

    self.unreadCount = ko.computed(function () {
      return self.items().filter(function (n) { return n.unread(); }).length;
    });

    // ── Actions ───────────────────────────────────────────────
    self.markRead = function (item) {
      if (item.unread()) item.unread(false);
    };

    self.deleteItem = function (item, e) {
      e && e.stopPropagation();
      self.items.remove(item);
    };

    self.markAllRead = function () {
      self.items().forEach(function (n) { n.unread(false); });
    };

    // ── Preferences ───────────────────────────────────────────
    self.prefPush  = ko.observable(true);
    self.prefSms   = ko.observable(true);
    self.prefEmail = ko.observable(false);

    self.prefCatSecurity     = ko.observable(true);
    self.prefCatTransactions = ko.observable(true);
    self.prefCatReminders    = ko.observable(true);
    self.prefCatOffers       = ko.observable(false);

    self.categoryColor = function (cat) {
      var map = { Security:'#DC2626', Transactions:'#16A34A', Reminders:'#D97706', Offers:'#7C3AED' };
      return map[cat] || '#9CA3AF';
    };
    self.categoryBg = function (cat) {
      var map = { Security:'#FEE2E2', Transactions:'#DCFCE7', Reminders:'#FEF3C7', Offers:'#EDE9FE' };
      return map[cat] || '#F3F4F6';
    };
  }

  return NotificationsViewModel;
});
