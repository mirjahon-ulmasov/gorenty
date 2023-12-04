import { initializeApp } from 'firebase/app'
import { MessagePayload, Messaging, getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: 'AIzaSyBpJmR3otXqD-C7QTAcXPXqYxFIjP4F0Hk',
    authDomain: 'gorenty-crm.firebaseapp.com',
    projectId: 'gorenty-crm',
    storageBucket: 'gorenty-crm.appspot.com',
    messagingSenderId: '381728071244',
    appId: '1:381728071244:web:5671119d71f8b94ae61ee9',
    measurementId: 'G-TMRMQ4PNRL',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export const requestPermission = async () => {
    console.log('Requesting User Permission......')
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
        console.log('Notification User Permission Granted.')
        return getToken(messaging, {
            vapidKey: 'BLjec9mpJUD7CK0mJARb5lKSOO3-JA2ATxzy85qjcW3eh2adOWiqYUpX85JyHsvCwNkTwY_d-rv1RLj9aDOQBCI',
        })
            .then(currentToken => {
                if (currentToken) return currentToken;
                console.log('Failed to generate token.')
            })
            .catch(err => {
                console.log('An error occurred when requesting to receive the token.', err)
            })
    } else {
        console.log('User Permission Denied.')
    }
}

export const onMessageListener = (): Promise<MessagePayload> =>
    new Promise(resolve => {
        onMessage(messaging as Messaging, payload => {
            resolve(payload)
        })
    })
