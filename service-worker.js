/* =========================================================
   CASA SÃO NUNO — Guest Guide · Service Worker
   - Saves the guide on the phone so it keeps working offline.
   - Pages, styles, scripts and translations: "network first"
     (guests always see the latest version when online).
   - Images and fonts: "cache first" (fast loading).

   When you add NEW image files, add them to PRECACHE below
   and increase VERSION (e.g. v1.0.1 → v1.0.2).
   ========================================================= */
const VERSION = 'csn-guide-v1.1.0';
const CACHE = VERSION;

const PRECACHE = [
  './',
  './index.html',
  './offline.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './translations/pt.json',
  './translations/en.json',
  './translations/fr.json',
  './translations/pl.json',
  './translations/it.json',
  './translations/es.json',
  './translations/de.json',
  './translations/ko.json',
  './assets/images/hero-fatima.jpg',
  './assets/images/logo-casa-sao-nuno.png',
  './assets/images/lobby-reception.jpg',
  './assets/images/bar-lounge.jpg',
  './assets/images/bar-terrace-view.jpg',
  './assets/images/breakfast.jpg',
  './assets/images/lunch.jpg',
  './assets/images/dinner.jpg',
  './assets/images/restaurant-d-duarte.jpg',
  './assets/images/aljustrel.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon-32.png',
  './assets/fonts/cormorant-garamond-latin-500-normal.woff2',
  './assets/fonts/cormorant-garamond-latin-600-normal.woff2',
  './assets/fonts/cormorant-garamond-latin-400-italic.woff2',
  './assets/fonts/cormorant-garamond-latin-ext-500-normal.woff2',
  './assets/fonts/cormorant-garamond-latin-ext-600-normal.woff2',
  './assets/fonts/cormorant-garamond-latin-ext-400-italic.woff2',
  './assets/fonts/jost-latin-300-normal.woff2',
  './assets/fonts/jost-latin-400-normal.woff2',
  './assets/fonts/jost-latin-500-normal.woff2',
  './assets/fonts/jost-latin-ext-300-normal.woff2',
  './assets/fonts/jost-latin-ext-400-normal.woff2',
  './assets/fonts/jost-latin-ext-500-normal.woff2'
];

const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((url) =>
        // Cache each file individually so one missing file never breaks installation
        cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('csn-guide-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromNetwork(request, timeout) {
  return new Promise((resolve, reject) => {
    const timer = timeout ? setTimeout(() => reject(new Error('timeout')), timeout) : null;
    fetch(request).then((response) => {
      if (timer) clearTimeout(timer);
      if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      resolve(response);
    }, (err) => { if (timer) clearTimeout(timer); reject(err); });
  });
}

async function networkFirst(request, fallbackUrl) {
  try {
    return await fromNetwork(request, NETWORK_TIMEOUT_MS);
  } catch (e) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallbackUrl) {
      const fb = (await caches.match('./index.html')) || (await caches.match('./')) || (await caches.match(fallbackUrl));
      if (fb) return fb;
    }
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fromNetwork(request);
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Google Maps and other sites: browser handles them

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './offline.html').then(async (res) => {
      if (res && res.status !== 504) return res;
      return (await caches.match('./offline.html')) || res;
    }));
    return;
  }

  if (/\.(?:jpg|jpeg|png|webp|gif|svg|woff2?|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
