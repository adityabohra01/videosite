import {initializeApp, cert} from "firebase-admin/app"
import { config } from "dotenv"

config()
const credential = cert({ ...process.env, private_key: process.env.private_key.replace(/\\n/gm, "\n") })

const firebaseApp = initializeApp({
    credential,
    storageBucket: "videosite-16374.appspot.com"
})

export default firebaseApp