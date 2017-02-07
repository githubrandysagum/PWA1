// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Function to perform HTTP request


// var imported = document.createElement('script');
// imported.src = './firebase';
// document.head.appendChild(imported);












        var get = function(url) {
          return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var result = xhr.responseText
                        result = JSON.parse(result);
                        resolve(result);
                    } else {
                        reject(xhr);
                    }
                }
            };
            
            xhr.open("GET", url, true);
            xhr.send();

          }); 
        };


        var notify = function(){
          return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", "key=AAAA_B_PjEY:APA91bGj_mQh2L9aT2SC_UNsoTN8AeXaH0LfFEDmMdk648Sv5R5ebg7SZpDPu9-fll8s3hdyoLCVE4UB0W90rNpiqr-1R7XRqme1C5Gu1V6KzU1KO3iuQtEQ1WiJgibqLWZoWER8Izjm");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var result = xhr.responseText
                        result = JSON.parse(result);
                        resolve(result);
                    } else {
                        reject(xhr);
                    }
                }
            };
            
            xhr.open("POST", "https://fcm.googleapis.com/fcm/send", true);

            var body = JSON.stringify({ "notification": {
                            "title": "Portugal vs. Denmark",
                            "body": "5 to 1"
                          },
                          "to" : "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1..."
                        });
            xhr.send();

          }); 


        }




   


   
      
      //   //TODO add service worker code here
      if ('serviceWorker' in navigator && 'PushManager' in window ) {
      console.log('Service Worker and Push is supported');
     
      navigator.serviceWorker.register('service-worker.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);
        swRegistration = swReg;
        //Check if there is subscriber
        initialiseUI();

        //To be use for background sync
        //  document.querySelector('#showUser').addEventListener('click', function(){
        //     navigator.serviceWorker.ready.then(function(swRegistration) {
        //       return swRegistration.sync.register('myFirstSync').then(function(data){
        //         console.log('Sync is registered');

        //       });
        //     });
        //  });

      })
    
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
    } else {
      console.warn('Push messaging is not supported');
      pushButton.textContent = 'Push Not Supported';
     
    }


        function AddToListPost(post){
                var _title = document.createElement('div');
                    _title.innerHTML ="<label>"+post['origin']+"</label><br><strong>Title:</strong>" + post.title;
              
                var _body = document.createElement('div');
                    _body.innerHTML = "<strong>Content:</strong>" + post.body;
                  
                var _post = document.createElement('div');
                    _post.className = "post";
                    _post.appendChild(_title).appendChild(_body);

                   // document.querySelector('#listuser').innerHTML = "";
                   var $list =  document.getElementById("listuser");
                    $list.insertBefore(_post, $list.firstChild);
      }
    
    
      function updateCache(data){
           var url = "https://jsonplaceholder.typicode.com/posts";
           var response = new Response(JSON.stringify(data), {
                                     headers: { 'content-type': 'application/json' }         
                          });         
          console.log('caching data', data);                   
           caches.open("pwa-data-v2").then(function(cache) {
               cache.put(url, response).then(function(response){
                 console.log('data is being cache', response)
               });
           });
      }

      function getDataCache(success, failure){
          var url = "https://jsonplaceholder.typicode.com/posts";
          caches.match(url).then(function(response) {
                console.log('Response in cache',response);
                if (!response) throw Error("No data");
                return response.json();
              }).then(function(data) {
                console.log('data length', data.length)
                 success(data);
              }).catch(function(e){
                 failure(e);
              })
      }

      function displayPosts(data, origin){
          document.querySelector("#listuser").innerHTML = "";
        console.log('displaring data', data);
            for(var i = 0 ;i < data.length ; i ++){
                     data[i]['origin'] = origin;
                      console.log("Displaying data", data[i]);
                      AddToListPost(data[i]);
             }
      }

       document.querySelector('#butt_post').addEventListener('click', function(){
          var url = "https://jsonplaceholder.typicode.com/posts";
            
              getDataCache(function(posts){
                  var post = {
                      title : document.getElementById('post_title').value,
                      body : document.getElementById('post_body').value
                  }
                    console.log('get cache',posts)
                    posts[posts.length] = post;
                    updateCache(posts);
                  var origin =  "from cache";
                    displayPosts(posts, origin);
              }, function(error){
                  if(error.message == "No data"){
                      console.log('No data')
                       var post = {
                          title : document.getElementById('post_title').value,
                          body : document.getElementById('post_body').value
                      }
                    var posts = [];
                    posts.push(post);
                    updateCache(posts);
                     var origin =  "New Post";
                    displayPosts(posts, origin);
                  }else{
                    console.log('Error on get cache data', error.message);
                  }

              })
       });

      function  loadPosts(){
          var url = "https://jsonplaceholder.typicode.com/posts";

        // if ('caches' in window) {
            /*
            * Check if the service worker has already cached this city's weather
            * data. If the service worker has the data, then display the cached
            * data while the app fetches the latest data.
            */
            var networkDataReceived = false;



              // fetch fresh data
              var networkUpdate = fetch(url).then(function(response) {
                return response.json();
              }).then(function(data) {
               var posts = [];
                for(var c = 0; c < 5; c++){
                    posts.push(data[c]);
                }

                networkDataReceived = true;
                updateCache(posts);
                 var origin =  "From Network";
                    displayPosts(posts, origin);
              }).catch(function(e){
                  console.log('Failed to get posts', e);

              });



              // fetch cached data
               getDataCache(function(posts){
                    console.log('get cache',posts);
                     var origin =  "From Cache";
                    displayPosts(posts, origin);
              }, function(error){
                    console.log('Error on caching data', error.message);
              })
      };

      loadPosts();



    
       





/**
 * For Push ntification
 * 
 * 
 * 
 */

          const applicationServerPublicKey = 'AAAA_B_PjEY:APA91bGj_mQh2L9aT2SC_UNsoTN8AeXaH0LfFEDmMdk648Sv5R5ebg7SZpDPu9-fll8s3hdyoLCVE4UB0W90rNpiqr-1R7XRqme1C5Gu1V6KzU1KO3iuQtEQ1WiJgibqLWZoWER8Izjm';

          const pushButton = document.querySelector('.js-push-btn');

          let isSubscribed = false;
          let swRegistration = null;

          function urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              .replace(/\-/g, '+')
              .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          }





          
        /**
         * initialiseUI
         * Its check if user is currently subscribe
         */

        function initialiseUI() {
          pushButton.addEventListener('click', function() {
          
          pushButton.disabled = true;
          if (isSubscribed) {
            unsubscribeUser();
          } else {
            subscribeUser();
          }
        });

          // Set the initial subscription value
          /***
           *  getSubscription() 
           *  is a method that returns a promise
           *  that resolves with the current subscription if there is one,
           *  otherwise it'll return null. 
           */

          //subscribe user
          
          
          swRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
              console.log('User IS subscribed.');
            } else {
              console.log('User is NOT subscribed.');
            }

            updateBtn();
          });
        }

        /**
         * This will enable PushButton if there is one subscriber
         */
        function updateBtn() {
          if (Notification.permission === 'denied') {
            pushButton.textContent = 'Push Messaging Blocked.';
            pushButton.disabled = true;
            updateSubscriptionOnServer(null);
            return;
          }


          if (isSubscribed) {
            pushButton.textContent = 'Disable Push Messaging';
          } else {
            pushButton.textContent = 'Enable Push Messaging';
          }

          pushButton.disabled = false;
        }


        //This will subscribe a user
        function subscribeUser() {

          console.log("Subscriptions: ",applicationServerPublicKey)
          const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        
        /**
          * we call the subscribe() method on our service worker's pushManager,
          * passing in our application server's public key
          * and the value userVisibleOnly: true.
          */


          /***
           * 
           * The userVisibleOnly parameter 
           * is basically an admission that you will show a notification 
           * every time a push is sent.
           * At the time of writing this value is required and must be true.
           */
          swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
          .then(function(subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
          })
          .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
          });
          
        }

        function updateSubscriptionOnServer(subscription) {
          // TODO: Send subscription to application server

          const subscriptionJson = document.querySelector('.js-subscription-json');
          const subscriptionDetails =
            document.querySelector('.js-subscription-details');

          if (subscription) {
            subscriptionJson.textContent = JSON.stringify(subscription);
            subscriptionDetails.classList.remove('is-invisible');
          } else {
            subscriptionDetails.classList.add('is-invisible');
          }
        }

        function unsubscribeUser() {
          swRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            if (subscription) {
              return subscription.unsubscribe();
            }
          })
          .catch(function(error) {
            console.log('Error unsubscribing', error);
          })
          .then(function() {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
          });
        }

        //subscribing the user
          


