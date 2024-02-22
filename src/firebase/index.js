// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlVwSahhtAdOc2kbqFB4vFQYLZQQqHQgE",
    authDomain: "video-site-a4155.firebaseapp.com",
    projectId: "video-site-a4155",
    storageBucket: "video-site-a4155.appspot.com",
    messagingSenderId: "937444004789",
    appId: "1:937444004789:web:abee10c8a7ee50eebf3ffc",
    measurementId: "G-PNB60S9E42"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export { firebaseApp }
