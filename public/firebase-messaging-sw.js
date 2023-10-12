import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s",
    authDomain: "pregnancare.firebaseapp.com",
    projectId: "pregnancare",
    storageBucket: "pregnancare.appspot.com",
    messagingSenderId: "986327922001",
    appId: "1:986327922001:web:68074764c77e88581d4f70",
    measurementId: "G-9Q3P9CKENM",
};

// Initialize the Firebase app in the service worker
const firebaseApp = initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = getMessaging(firebaseApp);

// Handle incoming background messages
onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize the notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'  // Make sure this icon exists in your public directory
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});