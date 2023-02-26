import {initializeApp, cert} from "firebase-admin/app"
import { config } from "dotenv"

config()
const credential = cert({ ...process.env })

const firebaseApp = initializeApp({
    credential,
    storageBucket: "videosite-16374.appspot.com"
})

export default firebaseApp