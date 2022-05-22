
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

 firebase.initializeApp({
   'messagingSenderId': '674566862087'
 }); 

 const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    click_action: payload.notification.click_action,
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

self.addEventListener('push', function(event) {
  var data = event.data.json();
  var title = data.notification.title || "Welcome To Pushmaze";
  
  var body= data.notification.body ||'Web and mobile push notifications 100x cheaper via Firebase Cloud Messaging';
  
  var icon = data.notification.icon || "https://www.pushmaze.com/wp-content/uploads/2017/04/Favicon-Red.png";

  var click = data.notification.click_action || "https://www.pushmaze.com";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      click_action : click,
  }));
}); 
