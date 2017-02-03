var cacheName = 'pwa-appshell-v1';
var dataCacheName = 'pwa-data-v1';


var filesToCache = [
    '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png',
  'https://jsonplaceholder.typicode.com/posts/1'
];

self.addEventListener('install', function(e){

    console.log('[serviceWorker] installed');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );

});

self.addEventListener('activate', function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
           return Promise.all(keyList.map(function(key){
               if(key !== cacheName && key !== dataCacheName){
                   console.log('[ServiceWorker] Removing old cache', key);
                   return caches.delete(key);
               }      
           }));       
        })    
    );
    //return self.clients.claim();
});


self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url);

   var dataUrl = 'https://jsonplaceholder.typicode.com/posts/1';


    if(e.request.url.indexOf(dataUrl) > -1){
            /*
        * When the request URL contains dataUrl, the app is asking for fresh
        *  data. In this case, the service worker always goes to the
        * network and then caches the response. This is called the "Cache then
        * network" strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
        */

        console.log('fatching', e.request.url);

        e.respondWith(
            
            caches.open(dataCacheName).then(function(cache) {

                console.log('Cache https://jsonplaceholder.typicode.com/posts/1', cache)
                return fetch(e.request) 
                        .then(function(response){
                            console.log("fetch result https://jsonplaceholder.typicode.com/posts/1", response)
                        cache.put(e.request.url, response.clone());
                            console.log('caching appdata');
                            return response;
                        })
            })
        );

    } else{

           /*
            * The app is asking for app shell files. In this scenario the app uses the
            * "Cache, falling back to the network" offline strategy:
            * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
            */
        console.log('appshell');
        e.respondWith(
            caches.match(e.request).then(function(response){
                console.log('response',response);
                return response || fetch(e.request);
            })
        );
    

    }
})