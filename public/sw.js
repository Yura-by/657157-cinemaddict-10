const CACHE_PREFIX = `cinemaddict-cache`;
const CACHE_VERSION = `v-1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/main.css`,
          `/css/normalize.css`,

        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {

});

self.addEventListener(`fetch`, (evt) => {

});
