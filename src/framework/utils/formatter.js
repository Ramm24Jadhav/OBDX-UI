define([
  'app-data',
  'ojs/ojconverter-number',
  'ojs/ojconverter-datetime'
], function (AppData, NumberConverter, DateTimeConverter) {
  'use strict';

  // ── Locale resolution ─────────────────────────────────────────────
  function _locale() {
    return AppData.getLocale();
  }

  // ── Number / Currency formatters ──────────────────────────────────
  var _currencyCache = {};

  function _currencyConverter(currency, locale) {
    var key = (currency || 'LYD') + ':' + (locale || _locale());
    if (!_currencyCache[key]) {
      _currencyCache[key] = new NumberConverter.IntlNumberConverter({
        style:                 'currency',
        currency:              currency || 'LYD',
        currencyDisplay:       'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping:           true
      });
    }
    return _currencyCache[key];
  }

  var _decimalConverter = new NumberConverter.IntlNumberConverter({
    style:                 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping:           true
  });

  // ── Date/Time formatters ──────────────────────────────────────────
  var _dateShort = new DateTimeConverter.IntlDateTimeConverter({
    pattern: 'dd MMM yyyy'
  });

  var _dateLong = new DateTimeConverter.IntlDateTimeConverter({
    dateStyle: 'long'
  });

  var _timeShort = new DateTimeConverter.IntlDateTimeConverter({
    timeStyle: 'short'
  });

  var _dateTime = new DateTimeConverter.IntlDateTimeConverter({
    pattern: 'dd MMM yyyy, hh:mm a'
  });

  var _monthYear = new DateTimeConverter.IntlDateTimeConverter({
    pattern: 'MMM yyyy'
  });

  // ── Public API ────────────────────────────────────────────────────
  var Formatter = {

    // formatCurrency(42000, 'LYD') → 'LYD 42,000.00'
    formatCurrency: function (amount, currency) {
      try {
        return _currencyConverter(currency).format(Number(amount));
      } catch (e) {
        // Fallback for unsupported currency codes
        return (currency || 'LYD') + ' ' + _decimalConverter.format(Number(amount));
      }
    },

    // formatAmount(42000) → '42,000.00' (no currency symbol)
    formatAmount: function (amount) {
      try {
        return _decimalConverter.format(Number(amount));
      } catch (e) {
        return Number(amount).toFixed(2);
      }
    },

    // formatDate(isoString) → '22 Jul 2026'
    formatDate: function (value) {
      if (!value) return '';
      try { return _dateShort.format(value); } catch (e) { return String(value); }
    },

    // formatDateLong(isoString) → 'July 22, 2026'
    formatDateLong: function (value) {
      if (!value) return '';
      try { return _dateLong.format(value); } catch (e) { return String(value); }
    },

    // formatTime(isoString) → '09:14 AM'
    formatTime: function (value) {
      if (!value) return '';
      try { return _timeShort.format(value); } catch (e) { return String(value); }
    },

    // formatDateTime(isoString) → '22 Jul 2026, 09:14 AM'
    formatDateTime: function (value) {
      if (!value) return '';
      try { return _dateTime.format(value); } catch (e) { return String(value); }
    },

    // formatMonthYear(isoString) → 'Jul 2026'
    formatMonthYear: function (value) {
      if (!value) return '';
      try { return _monthYear.format(value); } catch (e) { return String(value); }
    },

    // formatRelative('2026-07-22T09:14:00Z') → 'Today', 'Yesterday', 'Mon 22 Jul'
    formatRelative: function (isoString) {
      if (!isoString) return '';
      var d    = new Date(isoString);
      var now  = new Date();
      var diff = Math.floor((now - d) / 86400000);
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      try { return _dateShort.format(isoString); } catch (e) { return String(isoString); }
    },

    // formatPercent(84.5) → '84.5%'
    formatPercent: function (value, decimals) {
      var d = decimals !== undefined ? decimals : 1;
      return Number(value).toFixed(d) + '%';
    }
  };

  return Formatter;
});
