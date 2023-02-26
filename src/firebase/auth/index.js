import { firebaseApp } from "../index"
import { getAuth } from "firebase/auth"

const auth = getAuth(firebaseApp)

export default auth
export * from "./"