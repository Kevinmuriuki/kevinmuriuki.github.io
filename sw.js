// install service worker

const staticCacheName = 'site-static-v2';
const dynamicCache = 'site-dynamic-v1';
const assets = [
  '/',
  'index.html',
  'app.js',
  'styles.css',
  'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units${x},${y}&units=metric'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      cache.addAll(assets);
    })
  )
});

// activate sw

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys()
    .then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
});

// fetch event

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCache).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          })
        })
      })
  )
});