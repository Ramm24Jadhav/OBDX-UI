define(['knockout', 'ojL10n!components/more/nls/strings'], function (ko, nls) {
  'use strict';

  var ACCENTS = [
    { id: 'maroon', label: 'Maroon',   color: '#7A1531', hover: '#A01A3B', dark: '#5A0F23', dd: '#3A0716', rgb: '122,21,49',  light: '#FCE7EE', bright: '#E0607A' },
    { id: 'navy',   label: 'Navy',     color: '#1E3A5F', hover: '#264D80', dark: '#152840', dd: '#0D1E30', rgb: '30,58,95',   light: '#DBEAFE', bright: '#60A5FA' },
    { id: 'forest', label: 'Forest',   color: '#166534', hover: '#1A7C40', dark: '#0D4A24', dd: '#073317', rgb: '22,101,52',  light: '#DCFCE7', bright: '#4ADE80' },
    { id: 'slate',  label: 'Slate',    color: '#334155', hover: '#475569', dark: '#1E293B', dd: '#0F172A', rgb: '51,65,85',   light: '#E2E8F0', bright: '#94A3B8' },
    { id: 'gold',   label: 'Gold',     color: '#B45309', hover: '#D97706', dark: '#8A3E07', dd: '#5A2A04', rgb: '180,83,9',   light: '#FEF3C7', bright: '#FCD34D' },
    { id: 'rose',   label: 'Rose',     color: '#9F1239', hover: '#BE185D', dark: '#771030', dd: '#4C0720', rgb: '159,18,57',  light: '#FCE7EE', bright: '#FB7185' }
  ];

  function applyAccent(accent) {
    var r = document.documentElement;
    r.style.setProperty('--c-primary',        accent.color);
    r.style.setProperty('--c-primary-h',      accent.hover);
    r.style.setProperty('--c-primary-d',      accent.dark);
    r.style.setProperty('--c-primary-dd',     accent.dd);
    r.style.setProperty('--c-primary-rgb',    accent.rgb);
    r.style.setProperty('--c-primary-light',  accent.light);
    r.style.setProperty('--c-primary-bright', accent.bright);
  }

  function applyFontSize(size) {
    document.documentElement.style.setProperty('font-size', size === 'large' ? '17px' : '16px');
  }

  function ThemeViewModel(Context) {
    var params = Context.properties ? Context.properties.params : Context;
    var self = this;
    self.nls = nls;

    self.open    = params.open;
    self.onClose = params.onClose;

    // ── Load persisted prefs ──────────────────────────────────
    var stored = {};
    try { stored = JSON.parse(localStorage.getItem('obdxThemePrefs') || '{}'); } catch (e) {}

    self.themeMode = ko.observable(stored.themeMode || 'system');
    self.accents   = ACCENTS;
    self.selectedAccent = ko.observable(stored.accent || 'maroon');
    self.fontSize  = ko.observable(stored.fontSize || 'normal');

    // ── Pending (preview) state ───────────────────────────────
    self.previewMode   = ko.observable(self.themeMode());
    self.previewAccent = ko.observable(self.selectedAccent());
    self.previewFont   = ko.observable(self.fontSize());

    self.previewAccentObj = ko.computed(function () {
      return ACCENTS.find(function (a) { return a.id === self.previewAccent(); }) || ACCENTS[0];
    });

    // ── Mode selection (preview only) ─────────────────────────
    self.setThemePreview = function (mode) { self.previewMode(mode); };
    self.setAccentPreview = function (accent) { self.previewAccent(accent.id); };
    self.setFontPreview = function (size) { self.previewFont(size); };

    // ── Apply live (called on save) ───────────────────────────
    self.applyAll = function () {
      var mode   = self.previewMode();
      var accent = self.previewAccentObj();
      var fsz    = self.previewFont();

      // Theme mode
      if (mode === 'dark')  document.documentElement.setAttribute('data-theme', 'dark');
      else if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');

      // Accent
      applyAccent(accent);

      // Font size
      applyFontSize(fsz);

      // Save
      self.themeMode(mode);
      self.selectedAccent(accent.id);
      self.fontSize(fsz);
      localStorage.setItem('obdxThemePrefs', JSON.stringify({ themeMode: mode, accent: accent.id, fontSize: fsz }));

      window.obdxApp && window.obdxApp.showToast('Appearance saved', 'success');
      self.onClose();
    };

    self.resetPreview = function () {
      self.previewMode(self.themeMode());
      self.previewAccent(self.selectedAccent());
      self.previewFont(self.fontSize());
    };

    self.accentClass = function (accent) {
      return 'more-accent-swatch' + (self.previewAccent() === accent.id ? ' sel' : '');
    };

    // Re-sync preview when panel opens
    self.open.subscribe(function (v) {
      if (v) self.resetPreview();
    });

    // Apply stored prefs on init
    (function () {
      var initAccent = ACCENTS.find(function (a) { return a.id === self.selectedAccent(); });
      if (initAccent) applyAccent(initAccent);
      applyFontSize(self.fontSize());
      var mode = self.themeMode();
      if (mode === 'dark')  document.documentElement.setAttribute('data-theme', 'dark');
      else if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
    }());
  }

  return ThemeViewModel;
});
