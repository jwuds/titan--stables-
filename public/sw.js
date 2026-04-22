/* eslint-disable no-restricted-globals */

// Cache Name
const CACHE_NAME = 'titan-stables-v1';
const STATIC_CACHE = 'titan-static-v1';
const DYNAMIC_CACHE = 'titan-dynamic-v1';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html' // We need to create this
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate Event - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
          return null;
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API Requests: Network First, then Cache (if we wanted to cache API, but usually we don't for dynamic data)
  // Actually for Supabase, strictly Network only is safer for data integrity
  if (url.href.includes('supabase.co')) {
    return; // Let browser handle it directly (no caching for DB)
  }

  // 2. Images: Cache First
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            // Only cache valid responses
            if (response.ok) {
                cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Fonts): Cache First
  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(STATIC_CACHE).then((cache) => {
              if (fetchRes.ok) cache.put(event.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
    );
    return;
  }

  // 4. HTML Navigation: Network First, Fallback to Cache, Fallback to Offline Page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              if (response) return response;
              // Fallback to offline page if available
              return caches.match('/offline.html'); 
              // Or fallback to home if single page app
              // return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Default: Network Only
  // event.respondWith(fetch(event.request));
});