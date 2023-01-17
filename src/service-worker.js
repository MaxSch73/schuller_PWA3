'use strict';
console.debug('SW loaded');
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('install', (event) => {
  console.debug('SW install event');
});
self.addEventListener('activate', function (event) {
  console.debug('SW activate event, claiming control');
  return self.clients.claim();
});

import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);
// const employeesRoute = new Route(
// ({ url }) => url.pathname === '/employees',
// new NetworkFirst({
// cacheName: 'roberts-employees',
// plugins: [
// new ExpirationPlugin({
// maxAgeSeconds: 60 * 60 * 24 * 1,
// }),
// ],
// cacheableResponse: {
// statuses: [0, 200],
// },
// }),
// );
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
// registerRoute(employeesRoute);
registerRoute(imagesRoute);

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    caches.delete('roberts-employees');
    caches.delete('roberts-images');
  }
});
