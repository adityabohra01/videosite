import auth from "../index"
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth"
import SnackbarUtils from "../../../components/SnackbarUtils"

const LoginGoogle = () => {
  
  const provider = new GoogleAuthProvider()
//   provider.addScope("https://www.googleapis.com/auth/user.phonenumbers.read")
  signInWithRedirect(auth, provider)
    .then(res => {
      getRedirectResult(auth)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          // const credential = GoogleAuthProvider.credentialFromResult(result)
          // const token = credential.accessToken;
          // The signed-in user info.
          // const user = result.user
          //   toast("Signed in with Google !")
          SnackbarUtils.success("Logged in with Google !")
          return result
        })
        .catch(error => {
          // Handle Errors here.
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.email
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error)
          // console.log(email, credential)
          console.error(error)
          //   toast(error.message)
          SnackbarUtils.error(error.message)
          return error
        })
    })
    .catch(error => {
      console.error(error)
          SnackbarUtils.error(error.message)
    //   toast(error.message)
      return error
    })
}

export default LoginGoogle