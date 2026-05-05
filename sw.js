const CACHE_NAME = 'mc-v3.4';
const SHELL_URL = './index.html';

// Take over immediately — replaces any old self-destructing SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(SHELL_URL))
  );
  self.skipWaiting();
});

// Delete old caches from previous SW versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for HTML: always fetch fresh, fall back to cache if offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(SHELL_URL))
    );
  }
});
