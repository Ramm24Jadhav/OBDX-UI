/**
 * OBDX Mobile — Oracle Digital Assistant (ODA) Chatbot Integration
 *
 * In mock mode: renders a stub chat UI with canned responses.
 * In live mode: loads the ODA Web SDK from config.oda.sdkUrl and
 * initialises the widget with the configured channelId + secret.
 *
 * The chatbot is exposed as a singleton with open() / close() / toggle().
 * index.html binds the FAB button and the chat panel to these.
 */
define(['knockout', 'framework/configurations/config', 'app-data'], function (ko, config, AppData) {
  'use strict';

  // ── Canned responses for mock mode ───────────────────────────
  var MOCK_RESPONSES = [
    'Hello! I\'m your digital banking assistant. How can I help you today?',
    'I can help you check your balance, make transfers, or answer questions about your account.',
    'For a transfer, please tap the Pay tab and follow the steps.',
    'Your last transaction was processed successfully. Is there anything else?',
    'I\'ve noted your query. A relationship manager will follow up within 24 hours.',
    'You can view all your transactions under Accounts → Transactions.',
    'Your Gold Member status gives you priority support. Would you like to speak with an agent?'
  ];

  var _mockIndex = 0;

  function _mockReply(userMessage) {
    var lower = (userMessage || '').toLowerCase();
    if (lower.indexOf('balance') !== -1) {
      return 'Your total relationship value is LYD 828,900.00. Available balance is LYD 184,200.00.';
    }
    if (lower.indexOf('transfer') !== -1 || lower.indexOf('pay') !== -1) {
      return 'To transfer funds, tap the Pay tab in the navigation bar. You can transfer to saved beneficiaries or add a new one.';
    }
    if (lower.indexOf('card') !== -1) {
      return 'Your Visa Platinum card ending in 4521 is active. You can manage your cards from the Cards tab.';
    }
    if (lower.indexOf('loan') !== -1) {
      return 'You have one active personal loan with a remaining balance of LYD 125,000. Your next EMI of LYD 4,200 is due on 1 Aug 2026.';
    }
    var reply = MOCK_RESPONSES[_mockIndex % MOCK_RESPONSES.length];
    _mockIndex++;
    return reply;
  }

  // ── ODA SDK init (live mode) ──────────────────────────────────
  function _initODA() {
    var odaConfig = config.oda || {};
    if (!odaConfig.sdkUrl || !odaConfig.channelId) {
      console.warn('[Chatbot] ODA config missing — staying in mock mode');
      return false;
    }
    var script = document.createElement('script');
    script.src = odaConfig.sdkUrl;
    script.onload = function () {
      if (window.WebSDK) {
        var settings = {
          URI:              odaConfig.uri,
          channelId:        odaConfig.channelId,
          userId:           AppData.userData && AppData.userData.customer && AppData.userData.customer.id,
          enableAutocomplete: true,
          enableBotAudioResponse: false,
          displayActionsAsSuggestions: true,
          theme:            'default',
          colors: { branding: '#7A1531' }
        };
        window._obdxODA = new window.WebSDK(settings);
        window._obdxODA.connect().then(function () {
          console.log('[Chatbot] ODA connected');
        });
      }
    };
    document.head.appendChild(script);
    return true;
  }

  // ── Chatbot singleton ─────────────────────────────────────────
  var Chatbot = {
    isOpen:    ko.observable(false),
    messages:  ko.observableArray([]),
    inputText: ko.observable(''),
    isTyping:  ko.observable(false),
    _liveMode: false,

    init: function () {
      if (!config.development.mockMode) {
        Chatbot._liveMode = _initODA();
      }
      // Welcome message
      Chatbot.messages.push({
        role: 'bot',
        text: 'Hello ' + (AppData.userData && AppData.userData.customer
                          ? AppData.userData.customer.displayName.split(' ')[0]
                          : '') + '! I\'m your digital banking assistant. How can I help?',
        time: _now()
      });
    },

    open: function () {
      Chatbot.isOpen(true);
      if (Chatbot._liveMode && window._obdxODA) {
        window._obdxODA.openChat();
      }
    },

    close: function () {
      Chatbot.isOpen(false);
      if (Chatbot._liveMode && window._obdxODA) {
        window._obdxODA.closeChat();
      }
    },

    toggle: function () {
      Chatbot.isOpen() ? Chatbot.close() : Chatbot.open();
    },

    send: function () {
      var text = (Chatbot.inputText() || '').trim();
      if (!text) return;
      Chatbot.inputText('');
      Chatbot.messages.push({ role: 'user', text: text, time: _now() });

      if (Chatbot._liveMode && window._obdxODA) {
        window._obdxODA.sendMessage(text);
        return;
      }

      // Mock response with typing indicator
      Chatbot.isTyping(true);
      setTimeout(function () {
        Chatbot.isTyping(false);
        Chatbot.messages.push({ role: 'bot', text: _mockReply(text), time: _now() });
      }, 900 + Math.random() * 600);
    },

    sendSuggestion: function (text) {
      Chatbot.inputText(text);
      Chatbot.send();
    },

    reset: function () {
      Chatbot.isOpen(false);
      Chatbot.messages([]);
      Chatbot.inputText('');
      _mockIndex = 0;
    }
  };

  function _now() {
    var d = new Date();
    return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  return Chatbot;
});
