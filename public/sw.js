/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const OFFLINE_URL = '/offline/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ayaselva-offline').then((cache) => cache.add(OFFLINE_URL))
  );
});

if (workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'ayaselva' });
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  workbox.navigationPreload.enable();

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'font'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets'
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );

  workbox.routing.setCatchHandler(async ({ request }) => {
    if (request.mode === 'navigate') {
      return caches.match('/offline/index.html') || Response.error();
    }
    return Response.error();
  });
}
