'use strict';

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

console.debug('SW loaded');

self.addEventListener('message', (event) => {
  console.debug('SW message', event);
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', (event) => {
  console.debug('SW install event');
});

self.addEventListener('activate', function (event) {
  console.debug('SW activate event, claiming control');
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.debug('SW push event',data);
  self.registration.showNotification(data.title, {
    body: data.body.message,
    icon: 'images/icons/favicon-32x32.png',
  });
});

// Caching Section
precacheAndRoute(self.__WB_MANIFEST);

const employeesRoute = new Route(
  ({ url }) => url.pathname === '/employees',
  new NetworkFirst({
    cacheName: 'roberts-employees',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

const imagesRoute = new Route(
  ({ url }) => /.*images\/portraits\/.*.jpg/.test(url.pathname),
  new CacheFirst({
    cacheName: 'roberts-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

registerRoute(employeesRoute);
registerRoute(imagesRoute);
