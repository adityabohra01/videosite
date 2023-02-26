// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZAulZasGmLYumEymf7ECEOmV4BXPR36o",
    authDomain: "videosite-16374.firebaseapp.com",
    projectId: "videosite-16374",
    storageBucket: "videosite-16374.appspot.com",
    messagingSenderId: "165678288417",
    appId: "1:165678288417:web:7bb3dfdf24011c09fe5d60",
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export { firebaseApp }
