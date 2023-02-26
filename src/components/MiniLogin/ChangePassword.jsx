import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { sendEmailVerification, signOut, updatePassword } from "firebase/auth"
import auth from "../../firebase/auth"
import SnackbarUtils from "../SnackbarUtils"
import TextField from "@mui/material/TextField"

function ChangePassword({ user, open, setOpen }) {
    const passwordRef = React.useRef()

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter a new Password to set for <b>{user.email}</b>
                </DialogContentText>
                <DialogContentText>Choose a secure password with various special characters and atleast 8 characters long.</DialogContentText>
                <TextField autoFocus margin="dense" inputRef={passwordRef} label="New Password" type="password" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => signOut(auth)}>
                    Reauthenticate
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        const newPassword = passwordRef.current.value

                        updatePassword(user, newPassword)
                            .then(() => {
                                // Update successful.
                                SnackbarUtils.success("Password Changed Successfully")
                                setOpen(false)
                            })
                            .catch(err => SnackbarUtils.error(err.message))
                    }}
                >
                    Change
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangePassword
