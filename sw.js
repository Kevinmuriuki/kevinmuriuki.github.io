// install service worker

const staticCacheName = 'site-static';
const assets = [
  '/',
  'index.html',
  'app.js',
  'styles.css',
  'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units${x},${y}&units=metric',
  'http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units=metric'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      cache.addAll(assets);
    })
  );
});

// activate sw

self.addEventListener('activate', evt => {
  console.log("sw was activated");
});

// fetch event

self.addEventListener('fetch', evt => {
  console.log('fetch event', evt);
});