define([
  'knockout',
  'services/CardService',
  'shared-components/utils',
  'ojL10n!resources/nls/strings',
  'ojs/ojknockout',
  'card-components/card-auth-gate/loader',
  'card-components/card-flip-popout/loader',
  'card-components/card-list/loader',
  'card-components/card-actions-grid/loader',
  'card-components/card-limit-bar/loader',
  'card-components/card-transactions/loader',
  'card-components/card-block-sheet/loader',
  'card-components/card-limits-sheet/loader',
  'card-components/card-pin-sheet/loader',
  'card-components/card-new-sheet/loader'
], function (ko, CardService, utils, nls) {
  'use strict';

  function CardsViewModel() {
    var self = this;
    self.nls = nls;
    utils.loadCss('/components/cards/cards-main/cards-main.css');

    // ── Tab state ─────────────────────────────────────────────
    self.activeTab   = ko.observable('DEBIT');
    self.activeIndex = ko.observable(0);
    self.isLoading   = ko.observable(false);
    self.isFrozen    = ko.observable(false);

    // ── Auth gate ─────────────────────────────────────────────
    self.showAuthGate = ko.observable(false);
    self.authView     = ko.observable('methods');
    self.mpinVal      = ko.observable('');
    self.mpinDots     = ko.computed(function () { return self.mpinVal().length; });
    self._pendingCard = ko.observable(null);

    // ── Card flip popout ──────────────────────────────────────
    self.showCpop    = ko.observable(false);
    self.cardFlipped = ko.observable(false);

    // ── Sheets ────────────────────────────────────────────────
    self.showBlockSheet  = ko.observable(false);
    self.showLimitSheet  = ko.observable(false);
    self.showPINSheet    = ko.observable(false);
    self.showNewCard     = ko.observable(false);
    self.blockReason     = ko.observable('Lost Card');
    self.blockReasons    = ['Lost Card', 'Stolen Card', 'Suspicious Activity', 'Temporary Hold'];
    self.dailyLimit      = ko.observable(3000);
    self.monthlyLimit    = ko.observable(15000);
    self.pinVal          = ko.observable('');
    self.pinDots         = ko.computed(function () {
      var len = self.pinVal().length;
      return [len > 0, len > 1, len > 2, len > 3];
    });
    self.keys = ['1','2','3','4','5','6','7','8','9','','0','X'];

    // ── Card data ─────────────────────────────────────────────
    self.debitCards = ko.observableArray([
      { id:'D0', name:'Mohammed Al-Qahtani', masked:'4567  8901  ••••  4892', expiry:'08/27',
        typeLabel:'Debit · Visa Platinum · Current', balance:'LYD 24,750',
        balanceLabel:'Available Balance', limitUsed:4250, limitTotal:25000,
        gradient:'linear-gradient(140deg,#7A1531 0%,#5C1025 50%,#3E0A1A 100%)',
        accentColor:'rgba(255,255,255,.85)', chipBg:'rgba(255,255,255,.15)',
        brandName:'VISA', brandColor:'rgba(255,255,255,.8)', tier:null, tierColor:null },
      { id:'D1', name:'Mohammed Al-Qahtani', masked:'4567  8901  ••••  6780', expiry:'05/28',
        typeLabel:'Debit · Mastercard · Savings', balance:'LYD 85,200',
        balanceLabel:'Available Balance', limitUsed:14100, limitTotal:80000,
        gradient:'linear-gradient(140deg,#1B2A4A 0%,#0F1E3C 50%,#071428 100%)',
        accentColor:'rgba(255,255,255,.85)', chipBg:'rgba(255,255,255,.10)',
        brandName:'MC', brandColor:null, tier:null, tierColor:null },
      { id:'D2', name:'Mohammed Al-Qahtani', masked:'4567  8901  ••••  3341', expiry:'12/26',
        typeLabel:'Debit · Visa · Business', balance:'LYD 12,340',
        balanceLabel:'Available Balance', limitUsed:1800, limitTotal:20000,
        gradient:'linear-gradient(140deg,#0D3D3A 0%,#082E2B 50%,#041E1C 100%)',
        accentColor:'#4ade80', chipBg:'rgba(255,255,255,.10)',
        brandName:'VISA', brandColor:'rgba(74,222,128,.7)', tier:null, tierColor:null }
    ]);

    self.creditCards = ko.observableArray([
      { id:'C0', name:'Mohammed Al-Qahtani', masked:'4567  8901  ••••  5521', expiry:'03/29',
        typeLabel:'Credit · Visa Platinum', balance:'LYD 20,750',
        balanceLabel:'Credit Available', limitUsed:4250, limitTotal:25000,
        gradient:'linear-gradient(140deg,#2C1A5C 0%,#1A0E3C 50%,#0D0824 100%)',
        accentColor:'#C8A45D', chipBg:'rgba(200,164,93,.2)',
        brandName:'VISA', brandColor:'rgba(200,164,93,.8)', tier:'PLATINUM', tierColor:'rgba(200,164,93,.7)' },
      { id:'C1', name:'Mohammed Al-Qahtani', masked:'5412  7689  ••••  8843', expiry:'11/27',
        typeLabel:'Credit · World Mastercard', balance:'LYD 47,500',
        balanceLabel:'Credit Available', limitUsed:2500, limitTotal:50000,
        gradient:'linear-gradient(140deg,#1A0808 0%,#0D0404 50%,#050202 100%)',
        accentColor:'rgba(255,255,255,.6)', chipBg:'rgba(122,21,49,.3)',
        brandName:'MC', brandColor:null, tier:'WORLD', tierColor:'rgba(200,30,30,.7)' }
    ]);

    self.virtualCards = ko.observableArray([
      { id:'V0', name:'Mohammed Al-Qahtani', masked:'4901  5678  ••••  2201', expiry:'06/28',
        typeLabel:'Virtual · Visa', balance:'LYD 5,000',
        balanceLabel:'Spending Limit', limitUsed:320, limitTotal:5000,
        gradient:'linear-gradient(140deg,#0A2A3A 0%,#061A26 50%,#030F18 100%)',
        accentColor:'#38bdf8', chipBg:'rgba(56,189,248,.15)',
        brandName:'VISA', brandColor:'rgba(56,189,248,.7)', tier:'VIRTUAL', tierColor:'rgba(56,189,248,.6)' },
      { id:'V1', name:'Mohammed Al-Qahtani', masked:'5301  4422  ••••  9934', expiry:'09/27',
        typeLabel:'Virtual · Mastercard', balance:'LYD 2,500',
        balanceLabel:'Spending Limit', limitUsed:1200, limitTotal:2500,
        gradient:'linear-gradient(140deg,#2A1400 0%,#1A0D00 50%,#0F0800 100%)',
        accentColor:'#fb923c', chipBg:'rgba(251,146,60,.15)',
        brandName:'MC', brandColor:null, tier:'VIRTUAL', tierColor:'rgba(251,146,60,.6)' }
    ]);

    // ── Derived ───────────────────────────────────────────────
    self.activeCards = ko.computed(function () {
      var t = self.activeTab();
      if (t === 'DEBIT')   return self.debitCards();
      if (t === 'CREDIT')  return self.creditCards();
      return self.virtualCards();
    });

    self.activeCard = ko.computed(function () {
      return self.activeCards()[self.activeIndex()] || null;
    });

    self.limitPercent = ko.computed(function () {
      var c = self.activeCard();
      if (!c) return 0;
      return Math.min(Math.round((c.limitUsed / c.limitTotal) * 100), 100);
    });

    // ── Tab switch ────────────────────────────────────────────
    self.selectTab = function (tabId) {
      self.activeTab(tabId);
      self.activeIndex(0);
    };

    self.tabClass = function (tabId) {
      return self.activeTab() === tabId ? 'card-type-pill active' : 'card-type-pill';
    };

    // ── Card tap (opens auth gate) ─────────────────────────────
    self.onCardTap = function (card, idx) {
      self.activeIndex(idx);
      self._pendingCard(card);
      self.mpinVal('');
      self.authView('methods');
      self.showAuthGate(true);
    };

    self.authPick = function (method) {
      if (method === 'mpin') {
        self.authView('mpin');
      } else {
        window.obdxApp && window.obdxApp.showLoader('Authenticating', 'Verifying your identity…');
        setTimeout(function () {
          window.obdxApp && window.obdxApp.hideLoader();
          self.showAuthGate(false);
          self.cardFlipped(false);
          self.showCpop(true);
        }, 1500);
      }
    };

    self.authBack = function () { self.authView('methods'); self.mpinVal(''); };
    self.closeAuthGate = function () { self.showAuthGate(false); self.mpinVal(''); };

    self.mpinKey = function (k) {
      if (k === '⌫' || k === 'X') { self.mpinVal(self.mpinVal().slice(0, -1)); return; }
      if (k === '' || k === 'cancel' || self.mpinVal().length >= 6) return;
      self.mpinVal(self.mpinVal() + k);
      if (self.mpinVal().length === 6) {
        window.obdxApp && window.obdxApp.showLoader('Authenticating', 'Verifying your identity…');
        setTimeout(function () {
          window.obdxApp && window.obdxApp.hideLoader();
          self.showAuthGate(false);
          self.mpinVal('');
          self.cardFlipped(false);
          self.showCpop(true);
        }, 1500);
      }
    };

    self.flipCard   = function () { self.cardFlipped(!self.cardFlipped()); };
    self.closeCpop  = function () { self.showCpop(false); self.cardFlipped(false); };

    // ── Card inner HTML builder ───────────────────────────────
    self.renderCardInner = function (card) {
      var mc = card.brandName === 'MC'
        ? '<div style="position:relative;width:28px;height:18px;"><div style="position:absolute;left:0;width:18px;height:18px;border-radius:50%;background:rgba(220,50,50,.85);"></div><div style="position:absolute;right:0;width:18px;height:18px;border-radius:50%;background:rgba(255,160,0,.85);"></div></div>'
        : '<span style="font-size:14px;font-weight:900;font-style:italic;color:' + (card.brandColor || 'rgba(255,255,255,.8)') + ';">VISA</span>';
      var tier = card.tier ? '<div style="font-size:8px;font-weight:700;letter-spacing:1px;color:' + (card.tierColor || 'rgba(255,255,255,.5)') + ';margin-top:2px;">' + card.tier + '</div>' : '';
      return '<div style="position:absolute;inset:0;background:' + card.gradient + ';border-radius:18px;"></div>'
        + '<div class="card-shimmer"></div>'
        + '<div class="cf-inner" style="position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">'
        +   '<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
        +     '<div style="display:flex;align-items:center;gap:6px;">'
        +       '<div style="width:20px;height:20px;background:' + card.chipBg + ';border-radius:6px;display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" fill="none" stroke="' + card.accentColor + '" stroke-width="2" width="12" height="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>'
        +       '<span style="font-size:9px;font-weight:800;color:' + card.accentColor + ';letter-spacing:.5px;">OBDX Mobile</span>'
        +     '</div>'
        +     '<div style="display:flex;align-items:center;gap:6px;">'
        +       '<div style="width:24px;height:18px;background:linear-gradient(145deg,#e8c96a,#c8a034);border-radius:3px;"></div>'
        +       mc
        +     '</div>'
        +   '</div>'
        +   '<div>'
        +     '<div style="font-size:8px;color:rgba(255,255,255,.5);font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:2px;">' + (card.balanceLabel || 'Available Balance') + '</div>'
        +     '<div style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-.5px;">' + card.balance + '</div>'
        +     tier
        +   '</div>'
        +   '<div>'
        +     '<div style="font-size:11px;font-weight:600;color:rgba(255,255,255,.7);letter-spacing:2px;font-family:monospace;margin-bottom:8px;">' + card.masked + '</div>'
        +     '<div style="display:flex;justify-content:space-between;align-items:flex-end;">'
        +       '<div><div style="font-size:7px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.5px;">Card Holder</div><div style="font-size:9px;font-weight:700;color:#fff;">' + card.name.toUpperCase() + '</div></div>'
        +       '<div style="display:flex;align-items:center;gap:8px;">'
        +         '<div><div style="font-size:7px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.5px;">Valid Thru</div><div style="font-size:10px;font-weight:700;color:#fff;">' + card.expiry + '</div></div>'
        +         mc
        +       '</div>'
        +     '</div>'
        +   '</div>'
        + '</div>';
    };

    // ── Action handlers ───────────────────────────────────────
    self.openBlockSheet  = function () { self.showBlockSheet(true);  };
    self.closeBlockSheet = function () { self.showBlockSheet(false); };
    self.openLimitSheet  = function () { self.showLimitSheet(true);  };
    self.closeLimitSheet = function () { self.showLimitSheet(false); };
    self.openPINSheet    = function () { self.showPINSheet(true);    };
    self.closePINSheet   = function () { self.showPINSheet(false); self.pinVal(''); };
    self.openNewCard     = function () { self.showNewCard(true);     };
    self.closeNewCard    = function () { self.showNewCard(false);    };

    self.toggleFreeze = function () {
      self.isFrozen(!self.isFrozen());
      window.obdxApp && window.obdxApp.showToast(self.isFrozen() ? 'Card frozen' : 'Card unfrozen', 'success');
    };

    self.confirmBlock = function () {
      window.obdxApp && window.obdxApp.showToast('Card blocked successfully', 'success');
      self.closeBlockSheet();
    };

    self.saveLimits = function () {
      window.obdxApp && window.obdxApp.showToast('Limits updated', 'success');
      self.closeLimitSheet();
    };

    self.pinKey = function (k) {
      if (k === 'X') { self.pinVal(self.pinVal().slice(0, -1)); return; }
      if (k === '' || self.pinVal().length >= 4) return;
      self.pinVal(self.pinVal() + k);
    };

    self.formatAmount = function (n) {
      return Number(n).toLocaleString('en-LY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    // ── Carousel scroll sync ──────────────────────────────────
    var _scrollLock = false;

    self._scrollCarouselTo = function (idx) {
      _scrollLock = true;
      var tracks = document.querySelectorAll('.card-crsl-track');
      tracks.forEach(function (track) {
        if (!track.offsetParent) return;
        var cards = track.querySelectorAll('.ccard');
        if (!cards[idx]) return;
        var card = cards[idx];
        var targetLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
        track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      });
      setTimeout(function () { _scrollLock = false; }, 500);
    };

    var _indexChangedByUser = false;
    self.activeIndex.subscribe(function (idx) {
      if (!_indexChangedByUser) { _indexChangedByUser = true; self._scrollCarouselTo(idx); _indexChangedByUser = false; }
    });

    self.handleActivated = function () {
      setTimeout(function () {
        var tracks = document.querySelectorAll('.card-crsl-track');
        tracks.forEach(function (track) {
          var _debounce = null;
          track.addEventListener('scroll', function () {
            if (_scrollLock || !track.offsetParent) return;
            clearTimeout(_debounce);
            _debounce = setTimeout(function () {
              var cards = Array.from(track.querySelectorAll('.ccard'));
              if (!cards.length) return;
              var trackCenter = track.scrollLeft + track.clientWidth / 2;
              var closestIdx = 0;
              var minDist = Infinity;
              cards.forEach(function (c, i) {
                var cCenter = c.offsetLeft + c.offsetWidth / 2;
                var dist = Math.abs(cCenter - trackCenter);
                if (dist < minDist) { minDist = dist; closestIdx = i; }
              });
              var firstCard = track.querySelector('.ccard');
              if (firstCard) {
                try {
                  require(['knockout'], function (ko) {
                    var ctx = ko.contextFor(firstCard);
                    if (ctx && ctx.$parent && ctx.$parent.activeIndex) {
                      ctx.$parent.activeIndex(closestIdx);
                    }
                  });
                } catch (e) {}
              }
            }, 80);
          }, { passive: true });
        });
        self._scrollCarouselTo(0);
      }, 200);
    };
  }

  return CardsViewModel;
});
