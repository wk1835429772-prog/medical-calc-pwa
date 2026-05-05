// Minimal Service Worker — no caching, no self-destruct
// Purpose: keep SW active so Chrome grants navigator.storage.persist()
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
// Passthrough — always fetch from network, no cache
self.addEventListener('fetch', () => {});
