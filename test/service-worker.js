self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open("my-cache")
      .then(cache => cache.add("/index-with-service-worker.html"))
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("Found", response);
        return response;
      }
      return fetch(event.request);
    })
  );
});
