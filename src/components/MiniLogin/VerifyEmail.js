import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { sendEmailVerification, signOut } from "firebase/auth"
import auth from "../../firebase/auth"
import SnackbarUtils from "../SnackbarUtils"
function VerifyEmail({user}) {


    return (
        <Dialog open={true}>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent>
                <DialogContentText>To continue, please verify an email sent to <b>{user.email}</b></DialogContentText>
                <DialogContentText>Please retry login after verification .</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => signOut(auth)}>Retry Signin</Button>
                <Button variant="contained" onClick={() => {
                    sendEmailVerification(user)
                        .then(() => {
                            SnackbarUtils.success("Verification Email Sent !")
                            SnackbarUtils.toast("Returning to signin page...")
                            setTimeout(() => {
                                signOut(auth)
                            }, 3000)
                        })
                        .catch(err => SnackbarUtils.error(err.message))
                }}>Resend Email</Button>
            </DialogActions>
        </Dialog>
    )
}

export default VerifyEmail