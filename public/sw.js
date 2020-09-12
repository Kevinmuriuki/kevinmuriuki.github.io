'use strict';

const staticCacheName = "site-static-v1";
const assets = [
    "/",
    "index.html",
    "app.js",
    "styles.css",
    "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units${x},${y}&units=metric",
    "https://openweathermap.org/img/wn/01d@2x.png"
];

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== staticCacheName) {
                    return caches.delete(key);
                }
            }))
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    evt.respondWith(
        caches.match(e.request)
            .then((response) => {
                if(response) {
                    return response;  
                }
                
                return fetch(e.request).then((responce) => {
                    return caches.open(staticCacheName).then((cache) => {
                        cache.put(e.request.url, responce.clone());
                        return responce;
                    });
                });
            })
            .catch((error)=> {
                console.error('error installing service worker', error);
            })
    );
});
