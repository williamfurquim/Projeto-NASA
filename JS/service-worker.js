const CACHE_NAME = 'cache-v1';
const arquivosParaCache = [
  './',
  './index.html',
  './index2.html',
  './index3.html',
  './index4.html',
  './index5.html',
  './index5-1.html',
  './index6.html',
  './index6-1.html',
  './style.css',
  './style2.css',
  './style3.css',
  './style4.css',
  './style5.css',
  './style6.css',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(arquivosParaCache);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); 
          }
        })
      )
    )
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resposta => {
      return resposta || fetch(event.request);
    })
  );
});
