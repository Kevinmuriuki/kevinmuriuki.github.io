// install service worker

const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1';
const assets = [
  '/',
  'index.html',
  'app.js',
  'styles.css'
];

const weatherapidata = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units${x},${y}&units=metric';

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
  evt.waitUntil(
    caches.keys()
    .then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  );
  evt.waitUntil(
    createDB()
  );
});

// fetch event

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(cacheRes => {
        return cacheRes || fetch(evt.request)
      })
  );
});

function createDB() {
  const idb = indexedDB;
  idb.open('weatherData', 1, upgradeDB => {
    let store = idb.createObjectStore('weather', {
      keyPath: 'id'
    });
    fetch(weatherapidata)
    .then(response => {
        store.put(response.json())
      })
    }); 
}

function readDB() {
  idb.open('weatherData', 1).then(db => {
    let tx = idb.transaction(['weather'], 'readonly');
    let data = tx.objectData('weather');
    return data.getAll();
  }).then(items => {
    time.textContent = timeManage(todayDateTime);
    date.textContent = dateManage(todayDateTime);
    city.textContent = data.name;
    temp.textContent = Math.floor(data.main.temp);
    description.textContent = data.weather[0].description;
    icon.setAttribute("src", `http://openweathermap.org/imgwn/${data.weather[0].icon}@2x.png`);
    icon
  });
}