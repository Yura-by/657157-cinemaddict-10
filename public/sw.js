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
          `/fonts/opensans-bold-webfont.woff2`,
          `/fonts/opensans-extrabold-webfont.woff2`,
          `/fonts/opensans-regular-webfont.woff2`,
          `/images/emoji/angry.png`,
          `/images/emoji/puke.png`,
          `/images/emoji/sleeping.png`,
          `/images/emoji/smile.png`,
          `/images/emoji/trophy.png`,
          `/images/icons/icon-favorite-active.svg`,
          `/images/icons/icon-favorite.svg`,
          `/images/icons/icon-watched-active.svg`,
          `/images/icons/icon-watched.svg`,
          `/images/icons/icon-watchlist-active.svg`,
          `/images/icons/icon-watchlist.svg`,
          `/images/posters/made-for-each-other.png`,
          `/images/posters/popeye-meets-sinbad.png`,
          `/images/posters/sagebrush-trail.jpg`,
          `/images/posters/santa-claus-conquers-the-martians.jpg`,
          `/images/posters/the-dance-of-life.jpg`,
          `/images/posters/the-great-flamarion.jpg`,
          `/images/posters/the-man-with-the-golden-arm.jpg`,
          `/images/background.png`,
          `/images/bitmap.png`,
          `/images/bitmap@2x.png`,
          `/images/bitmap@3x.png`
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    }
                ).filter(
                    (key) => key !== null
                )
            )
        )
  );
});

const fetchHandler = (evt) => {
  const {request} = evt;
  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(request).then(
              (response) => {
                if (!response || response.status !== 200 || response.type !== `basic`) {
                  return response;
                }

                const clonedResponse = response.clone();

                caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));

                return response;
              }
          );
        })
  );
};

self.addEventListener(`fetch`, fetchHandler);
