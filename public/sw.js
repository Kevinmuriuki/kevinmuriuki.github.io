'use strict';

const staticCacheName = "site-static-v1";
const assets = [
    "index.html",
    "app.js",
    "styles.css"
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
    evt.respondWith(
        caches.match(evt.request).then(cachesRes => {
            return cachesRes || fetch(evt.request);
        })
    );
});
