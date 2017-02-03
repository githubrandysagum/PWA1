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



(function() {
 

  var AddToListPost = function(post){
   var _title = document.createElement('label');
                _title.innerHTML ="<strong>Title:</strong><br>" + post.title;
           
            var _body = document.createElement('p');
                _body.innerHTML = "<strong>Content:</strong><br>" + post.body;
              
            var _post = document.createElement('div');
                _post.appendChild(_title).appendChild(_body);

                document.querySelector('#listuser').appendChild(_post);
  }
  //TODO add service worker code here
    if('serviceWorker' in navigator){
        navigator.serviceWorker
        .register('./service-worker.js', {scope: '/'})
          .then(function(){
          console.log('Service Worker Registered');
         
        })
    }

            //  get('https://jsonplaceholder.typicode.com/posts/1')
            //    .then(function(post){
            //       console.log('Post', post);
            //         AddToListPost(post);
            
            //   });
        //list 1 post
         var url = "https://jsonplaceholder.typicode.com/posts/1";

         if ('caches' in window) {
            /*
            * Check if the service worker has already cached this city's weather
            * data. If the service worker has the data, then display the cached
            * data while the app fetches the latest data.
            */
            caches.match(url).then(function(response) {
              console.log('data found in cache', response);
              if (response) {
                response.json().then(function(json) {

                  console.log('This data is found in cache', json);
                  // var results = json.query.results;
                  //       console.log(result);
                   AddToListPost(json);
                });
              }else{
                  get('https://jsonplaceholder.typicode.com/posts/1')
                  .then(function(post){
                      console.log('Post on else', post);
                        AddToListPost(post);
                
                  })
              }
            }, function(e){ console.log('error: ', e)});
         }else{
                get('https://jsonplaceholder.typicode.com/posts/1')
               .then(function(post){
                  console.log('Post', post);
                    AddToListPost(post);
            
              })


         }

})();
