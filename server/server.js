const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

//console.log(vapidKeys)

//remove `{{  }}` when you are providing keys

webpush.setGCMAPIKey('AAAA_B_PjEY:APA91bGj_mQh2L9aT2SC_UNsoTN8AeXaH0LfFEDmMdk648Sv5R5ebg7SZpDPu9-fll8s3hdyoLCVE4UB0W90rNpiqr-1R7XRqme1C5Gu1V6KzU1KO3iuQtEQ1WiJgibqLWZoWER8Izjm');
//Above is obtained from https://console.firebase.google.com/project/push-notification-web-d0beb/settings/cloudmessaging

webpush.setVapidDetails(
  'mailto:yourmailid@domain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription

// TODO the keys are to be obtained yourself and filled out
const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/e_wNuzYyAkE:APA91bGFfznx1KeU1Ye-eIJH1ulRqDzZjpLKShAJJ8AmRowNtsugeHisBdanOE-PUF3n61nIz_RAzJjpwrTVZZWPPQHH_UY0-N1OuOsSURDDKE3r56PHPcT9HTHQ9Jev90grlY3W8YQy",
  "keys":{
  "p256dh":"BJgwsMkZK-zSEW0zdMetDKNb7NMMGCI7bb16yB_P6sFC77cWURfIrVTlziOBxjpCysDEPc9jTogW-pnhNcD4fpQ=",
  "auth":"93XVn3HpwRKrNe_2JQs7_A=="}};

console.log(vapidKeys.publicKey)

webpush.sendNotification(pushSubscription, 'The server remembers!')
.then(function(result){
  console.log(result)
}).catch(function(error){
  console.log('error', error)
})
