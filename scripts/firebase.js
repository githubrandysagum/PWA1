// Set the configuration for your app
  // TODO: Replace with your project's config object
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDMDC7fLF0wHXW-1MZmqGHxav2ajDiRivI",
    authDomain: "pwa-test-84c98.firebaseapp.com",
    databaseURL: "https://pwa-test-84c98.firebaseio.com",
    storageBucket: "pwa-test-84c98.appspot.com",
    messagingSenderId: "1082865454150"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();


function writeMessage( name, message, callback) {
   
    database.ref('messages/' + name).set({
    username: name,
    message: message
  });
}




 function sendMessage(){
     var messageText = document.getElementById('message');
    var name = document.getElementById('username');
    console.log('name:', username.value , ', message: ' , message.value);
    writeMessage('Goy' , "Hello");
    
}


// function getMessage(name){
//     database.ref('/users/' + userId).once('value').then(function(snapshot) {
//     var username = snapshot.val().username;
//         console.log(username);
//     });
// };












