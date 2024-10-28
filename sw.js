let cacheName = 'latestNews-v1';
// Cache our known resources during install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
                './js/main.js',
                './js/article.js',
                './images/newspaper.svg',
                './css/site.css',
                './data/latest.json',
                './data/data-1.json',
                './article.html',
                './index.html'
            ]))
    );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(function(response) {
                if (response) {
                    return response;
                }
                let fetchRequest = event.request.clone();

                if(fetchRequest.url.includes( "chrome-extension:")) {
                    return
                }

                return fetch(fetchRequest).then(
                    function(response) {
                        if(!response || response.status !== 200) {
                            return response;
                        }

                        let responseToCache = response.clone();
                        caches.open(cacheName)
                            .then(async function(cache) {
                                await cache.put(fetchRequest, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
