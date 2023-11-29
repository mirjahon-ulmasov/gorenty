/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
)

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: 'AIzaSyBpJmR3otXqD-C7QTAcXPXqYxFIjP4F0Hk',
    authDomain: 'gorenty-crm.firebaseapp.com',
    projectId: 'gorenty-crm',
    storageBucket: 'gorenty-crm.appspot.com',
    messagingSenderId: '381728071244',
    appId: '1:381728071244:web:5671119d71f8b94ae61ee9',
    measurementId: 'G-TMRMQ4PNRL',
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
