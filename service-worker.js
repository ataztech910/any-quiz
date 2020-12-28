// Имя кэша для версионности
var cacheName = "v1:static";

// После инсталяции нам надо кэшировать файлы
self.addEventListener("install", function(e) {
  // Как только сервис заработает то файлы будут доступны офлайн.
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache
        .addAll([
          "./",
          "./css/styles.css",
          "./css/snackbar.css",
          "./js/app-data.js",
          "./js/app-state-utils.js",
          "./js/app.js"
        ])
        .then(function() {
          self.skipWaiting();
        });
    })
  );
});

// когда браузер разбираетURL…
self.addEventListener("fetch", function(event) {
  // … кэшируются запросы по URL
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // взять из кэша
        return response;
      }
      // обычный запрос
      return fetch(event.request);
    })
  );
});
