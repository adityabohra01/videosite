import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import auth from ".."
import SnackbarUtils from "../../../components/SnackbarUtils"



let signupEmail = (userid, password, displayName) => {
    // console.log('Signup with email loaded')
    createUserWithEmailAndPassword(auth, userid, password)
        .then(userCredential => {
            // Signed in
            const user = userCredential.user;
            updateProfile(user, {
                displayName
            })
            console.log("Signed up with email")
            SnackbarUtils.success("Signed up with Email !")
            return userCredential
        })
        .catch(error => {
            console.error(error)
            SnackbarUtils.error(error.message)
            // return error
        })
}

let loginEmail = (userid, password) => {
    // console.log('Login with Email loaded')
    signInWithEmailAndPassword(auth, userid, password)
        .then(userCredential => {
            // Signed in
            // const user = userCredential.user;
            SnackbarUtils.success("Signed in with Email !")
            return userCredential
        })
        .catch(error => {
            console.error(error)
            SnackbarUtils.error(error.message)
            // ..
            // return error
        })
}

export { signupEmail, loginEmail }