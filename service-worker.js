


var cacheName = 'pwa-appshell-v1';
var dataCacheName = 'pwa-data-v2';


var filesToCache = [
    '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/manifest.json',
  '/images/main.png'
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
    return self.clients.claim();
});


self.addEventListener('fetch', function(e){
    

   var dataUrl = 'https://jsonplaceholder.typicode.com/posts';
   console.log("Request Url", e.request.url);
   console.log("Request url index of ", e.request.url.indexOf(dataUrl))
    if(e.request.url.indexOf(dataUrl) > -1){
            /*
        * When the request URL contains dataUrl, the app is asking for fresh
        *  data. In this case, the service worker always goes to the
        * network and then caches the response. This is called the "Cache then
        * network" strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
        */

        e.respondWith( caches.open(dataCacheName)
                .then(function(cache) {
                    console.log('Cache https://jsonplaceholder.typicode.com/posts/1', cache)
                    return fetch(e.request) 
                    .then(function(response){
                        console.log("Caching request url", e.request.url)
                        cache.put(e.request.url, response.clone());
                        console.log('caching appdata');
                        return response;
                    })
                }).catch(function(e){
                    console.warn("Error in network connection", e);
                })
        );

    } else{

           /*
            * The app is asking for app shell files. In this scenario the app uses the
            * "Cache, falling back to the network" offline strategy:
            * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
            */
         console.log('appshell');
         console.log('fetching data', e.request)
         e.respondWith(
            caches.match(e.request).then(function(response){
                console.log('response', response);
                return response || fetch(e.request);
            })
        );
    

    }
})


/***
 * For push notification
 */

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: event.data.text(),
    icon: 'images/main.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});



self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://127.0.0.1:8812/')
  );
});


 //////////////////////////

 self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(doSomeStuff());
  }
});


function doSomeStuff(){
   
             var networkDataReceived = false;
              // fetch fresh data
              return fetch('https://jsonplaceholder.typicode.com/posts/1').then(function(response) {
                  return response.json();
              }).then(function(data) {
                networkDataReceived = true;
               //  AddToListPost(data);

                console.log('Sync is ok');
                self.registration.showNotification('Sync is ok');
                console.log(data);
             
              })
   
}