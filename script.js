/* =========================================================
   CASA SÃO NUNO — Guest Guide
   Language detection · i18n · menu · Wi-Fi copy · PWA
   ========================================================= */
(function () {
  'use strict';

  var SUPPORTED = ['pt', 'en', 'fr', 'pl', 'it', 'es', 'de', 'ko'];
  var FALLBACK = 'en';
  var STORAGE_KEY = 'csn-guest-guide-lang';
  var HTML_LANG = { pt: 'pt-PT', en: 'en', fr: 'fr', pl: 'pl', it: 'it', es: 'es', de: 'de', ko: 'ko' };

  var root = document.documentElement;
  var cache = {};
  var dict = null;
  var currentLang = null;

  /* ---------- Small helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, obj);
  }
  function t(key, fallback) {
    var v = dict ? get(dict, key) : undefined;
    return typeof v === 'string' ? v : (fallback || '');
  }
  function storageGet() { try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function storageSet(v) { try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* private mode */ } }

  /* ---------- Language detection ---------- */
  function normalise(code) {
    if (!code) return null;
    var base = String(code).toLowerCase().split(/[-_]/)[0];
    return SUPPORTED.indexOf(base) !== -1 ? base : null;
  }

  function detectLanguage() {
    // 1. Explicit ?lang=xx in the address (useful for tests and links)
    var param = null;
    try { param = new URLSearchParams(window.location.search).get('lang'); } catch (e) { /* old browser */ }
    if (normalise(param)) return normalise(param);

    // 2. Language chosen manually on a previous visit
    var saved = normalise(storageGet());
    if (saved) return saved;

    // 3. Phone / browser preferred languages, in order
    var prefs = [];
    if (navigator.languages && navigator.languages.length) prefs = prefs.concat(navigator.languages);
    if (navigator.language) prefs.push(navigator.language);
    if (navigator.userLanguage) prefs.push(navigator.userLanguage);
    for (var i = 0; i < prefs.length; i++) {
      var match = normalise(prefs[i]);
      if (match) return match;
    }

    // 4. Not available → English
    return FALLBACK;
  }

  /* ---------- Translations ---------- */
  function loadDict(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('./translations/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (json) { cache[lang] = json; return json; });
  }

  function applyDict(lang) {
    $$('[data-i18n]').forEach(function (el) {
      var v = get(dict, el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var v = get(dict, parts[1].trim());
        if (typeof v === 'string') el.setAttribute(parts[0].trim(), v);
      });
    });

    root.setAttribute('lang', HTML_LANG[lang] || lang);
    document.title = t('meta.title', document.title);
    var md = $('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta.description', md.getAttribute('content')));

    var label = $('[data-lang-current]');
    if (label) label.textContent = lang.toUpperCase();
    $$('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }

  function setLanguage(lang, opts) {
    opts = opts || {};
    lang = normalise(lang) || FALLBACK;
    return loadDict(lang)
      .catch(function () { return lang === FALLBACK ? Promise.reject() : (lang = FALLBACK, loadDict(FALLBACK)); })
      .then(function (json) {
        dict = json;
        currentLang = lang;
        applyDict(lang);
        if (opts.save) storageSet(lang);
      })
      .catch(function () { /* Offline with no cache and no file: keep the built-in English text */ })
      .then(function () { root.classList.remove('i18n-pending'); });
  }

  /* ---------- Language menu ---------- */
  function initLanguageMenu() {
    var toggle = $('[data-lang-toggle]');
    var list = $('[data-lang-list]');
    if (!toggle || !list) return;

    function open() {
      list.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      var sel = $('[aria-selected="true"]', list) || $('button', list);
      if (sel) sel.focus();
    }
    function close(focusToggle) {
      list.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (list.hidden) open(); else close();
    });
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lang]');
      if (!btn) return;
      setLanguage(btn.getAttribute('data-lang'), { save: true });
      close(true);
    });
    list.addEventListener('keydown', function (e) {
      var items = $$('button', list);
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === 'Escape') close(true);
    });
    document.addEventListener('click', function (e) {
      if (!list.hidden && !e.target.closest('[data-lang-root]')) close();
    });
  }

  /* ---------- Drawer menu ---------- */
  function initDrawer() {
    var drawer = $('[data-drawer]');
    var backdrop = $('.drawer-backdrop');
    var openBtn = $('[data-menu-open]');
    if (!drawer || !openBtn) return;

    function open() {
      backdrop.hidden = false;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = $('a', drawer);
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      backdrop.hidden = true;
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', open);
    $$('[data-menu-close]').forEach(function (el) { el.addEventListener('click', close); });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });
    $('[data-install-open]', drawer).addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) { close(); openBtn.focus(); }
    });
  }

  /* ---------- Header state & back to top ---------- */
  function initScroll() {
    var header = $('.site-header');
    var toTop = $('[data-to-top]');
    var ticking = false;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('scrolled', y > 40);
      if (toTop) toTop.classList.toggle('show', y > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(message, isError) {
    var el = $('[data-toast]');
    if (!el) return;
    $('[data-toast-text]', el).textContent = message;
    el.classList.toggle('error', !!isError);
    el.hidden = false;
    // restart animation
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, isError ? 4200 : 2600);
  }

  /* ---------- Wi-Fi password copy ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error('copy failed'));
    });
  }
  function selectPassword() {
    var el = $('[data-wifi-password]');
    if (!el || !window.getSelection) return;
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
  }

  function initWifi() {
    var passEl = $('[data-wifi-password]');
    if (!passEl) return;
    $$('[data-copy-wifi]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var password = passEl.textContent.trim();
        copyText(password).then(function () {
          toast(t('wifi.copied', 'Password copied'));
          if (btn.classList.contains('btn')) {
            var use = $('use', btn);
            var label = $('[data-i18n]', btn);
            btn.classList.add('is-done');
            if (use) use.setAttribute('href', '#i-check');
            if (label) label.textContent = t('wifi.copied', 'Password copied');
            setTimeout(function () {
              btn.classList.remove('is-done');
              if (use) use.setAttribute('href', '#i-copy');
              if (label) label.textContent = t('wifi.copy', 'Copy password');
            }, 2400);
          }
        }).catch(function () {
          selectPassword();
          toast(t('wifi.copyError', 'Could not copy. Please enter the password manually.'), true);
        });
      });
    });
  }

  /* ---------- PWA install ---------- */
  var deferredPrompt = null;

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function platform() {
    var ua = navigator.userAgent || '';
    var iOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (iOS) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'desktop';
  }

  function initInstall() {
    var sheet = $('[data-install-sheet]');
    var backdrop = $('.sheet-backdrop');
    var openers = $$('[data-install-open]');
    var lastFocus = null;

    function hideInstallButtons() {
      openers.forEach(function (b) { b.hidden = true; });
    }
    if (isStandalone()) hideInstallButtons();

    function openSheet() {
      lastFocus = document.activeElement;
      var p = isStandalone() ? 'installed' : platform();
      sheet.setAttribute('data-platform', p);
      $('[data-install-done]', sheet).hidden = p !== 'installed';
      backdrop.hidden = false;
      sheet.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(function () { var c = $('.sheet-close', sheet); if (c) c.focus(); }, 50);
    }
    function closeSheet() {
      sheet.hidden = true;
      backdrop.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
    });
    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      hideInstallButtons();
    });

    openers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (deferredPrompt) {
          var promptEvent = deferredPrompt;
          deferredPrompt = null;
          promptEvent.prompt();
          if (promptEvent.userChoice) {
            promptEvent.userChoice.then(function (choice) {
              if (choice && choice.outcome === 'accepted') hideInstallButtons();
            });
          }
        } else {
          openSheet();
        }
      });
    });
    $$('[data-install-close]').forEach(function (el) { el.addEventListener('click', closeSheet); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) closeSheet();
    });
  }

  /* ---------- Online / offline ---------- */
  function initConnectivity() {
    window.addEventListener('offline', function () { toast(t('common.offline', 'You are offline.'), true); });
    window.addEventListener('online', function () { toast(t('common.online', 'Connection restored.')); });
  }

  /* ---------- Service worker ---------- */
  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    var secure = window.location.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    if (!secure) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(function () { /* ignore */ });
    });
  }

  /* ---------- Boot ---------- */
  // Never keep the page hidden for long, even on a very slow connection
  setTimeout(function () { root.classList.remove('i18n-pending'); }, 1500);

  setLanguage(detectLanguage());
  initLanguageMenu();
  initDrawer();
  initScroll();
  initReveal();
  initWifi();
  initInstall();
  initConnectivity();
  initServiceWorker();
})();
