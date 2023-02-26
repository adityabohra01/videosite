import React, { useCallback, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from '@mui/material/Container'
import { Box, InputAdornment, TextField, Button, Typography } from "@mui/material";
import { loginEmail } from "../../firebase/auth/email"
import google from "../../media/google.png"
import SnackbarUtils from "../SnackbarUtils";
import LoginGoogle from "../../firebase/auth/google"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoaderUtils from "../Loader/LoaderUtils";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../../firebase/auth";
import { useTheme } from "@emotion/react";

function LoginWindow() {
    const matches = useMediaQuery("(min-width:756px)")
    const theme = useTheme()
    const [passVisible, setPassVisible] = useState(false)
    const containerRef = useRef(null)
    const emailRef = useRef(null)
    const emailResetRef = useRef(null)
    const passwordRef = useRef(null)
    const [open, setOpen] = React.useState(false)
    // const [email, setEmail] = useState("email")


    const EmailLogin = useCallback(() => {
        // console.log(emailRef.current.value, passwordRef.current.value)
        loginEmail(emailRef.current.value, passwordRef.current.value)
    }, [])
    
    return (
        <Container
            maxWidth="lg"
            style={{
                display: "flex",
                height: "min-content",
                width: matches ? 756 : "calc(100% - 40px)",
                minHeight: 400,
                // background: "#eee",
                margin: "0 auto",
                flexDirection: "column",
                alignItems: "center",
            }}
            sx={{
                mt: 2,
                p: 2,
                backdropFilter: "blur(10px)",
                borderRadius: 1,
                boxShadow: "inset 0 0 0 200px rgba(255,255,255,0.2), " + theme.shadows[7],
                background:
                    "linear-gradient(\
                        60deg,\
                        rgba(128,128,128,0.05) 0%,\
                        rgba(128,128,128,0.05) 60%,\
                        rgba(255,255,255,0.4) 65%,\
                        rgba(255,255,255,0.4) 70%,\
                        rgba(128,128,128,0.05) 75%,\
                        rgba(128,128,128,0.01) 100%\
                    )",
                // background: "linear-gradient(322deg, \
                //                 #ba4aff, rgba(#ba4aff, 1) 70%),\
                //             linear-gradient(178deg,\
                //                 #008aff, rgba(#008aff, 1) 70%),\
                //             linear-gradient(24deg,\
                //                 #00ffc6, rgba(#00ffc6, 0) 35%);"
            }}
            ref={containerRef}
        >
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                Welcome to Cards
            </Typography>
            <Box
                component="form"
                noValidate
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "center",
                        justifyContent: "center",
                    }}
                >
                    <br />
                    <TextField
                        color="primary"
                        id="emailLogin"
                        variant="outlined"
                        label="Email"
                        type="email"
                        // defaultValue=""
                        // helperText="johncena@wwe.com"
                        placeholder="Enter Email"
                        required
                        fullWidth
                        inputRef={emailRef}
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="material-icons">email</span>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <br />
                    <TextField
                        color="primary"
                        id="outlined-password-input"
                        label="Password"
                        type={passVisible ? "text" : "password"}
                        autoComplete="current-password"
                        // helperText="Your Password"
                        placeholder="********"
                        required
                        fullWidth
                        inputRef={passwordRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="material-icons">lock</span>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <span className="material-icons" aria-label="toggle password visibility" onClick={() => setPassVisible(!passVisible)} edge="end">
                                        {passVisible ? "visibility_off" : "visibility"}
                                    </span>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <span
                        style={{
                            margin: "0 0 10px auto",
                            fontSize: 12,
                            color: "grey",
                            cursor: "pointer",
                        }}
                        onClick={() => setOpen(true)}
                    >
                        Forgot Password ?
                    </span>
                    <Button variant="contained" color="primary" onClick={EmailLogin}>
                        Login
                    </Button>
                    <br></br>
                    <Button variant="outlined" startIcon={<img src={google} style={{ cursor: "pointer" }} alt="Login with Google"></img>} onClick={LoginGoogle}>
                        Login with Google
                    </Button>
                </div>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Forgot Password ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter your email to get a password reset Link.</DialogContentText>
                    <TextField autoFocus margin="dense" inputRef={emailResetRef} label="Email Address" type="email" fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            LoaderUtils.halt()
                            SnackbarUtils.info("Sending Password Reset Link...")
                            sendPasswordResetEmail(auth, emailResetRef.current.value)
                                .then(() => {
                                    // Password reset email sent!
                                    // ..
                                    SnackbarUtils.success("Password reset link sent to your email.")
                                    LoaderUtils.unhalt()
                                    setOpen(false)
                                })
                                .catch(error => {
                                    const errorCode = error.code
                                    const errorMessage = error.message
                                    SnackbarUtils.error(errorMessage)
                                    LoaderUtils.unhalt()
                                    setOpen(false)
                                    // ..
                                })
                        }}
                    >
                        Send Link
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default LoginWindow