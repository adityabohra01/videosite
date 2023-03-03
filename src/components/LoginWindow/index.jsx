import React, { useCallback, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from '@mui/material/Container'
import { Box, InputAdornment, TextField, Button, Typography, Divider, Tabs, Tab, Slide } from "@mui/material";
import { loginEmail, signupEmail } from "../../firebase/auth/email"
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
    const emailSignupRef = useRef(null)
    const passwordSignupRef = useRef(null)
    const emailResetRef = useRef(null)
    const passwordRef = useRef(null)
    const nameRef = useRef(null)
    const [open, setOpen] = React.useState(false)
    const [tab, setTab] = useState(1) // 1 = login, 2 = signup
    const container = useRef(null)
    // const [email, setEmail] = useState("email")


    const EmailLogin = useCallback(() => {
        // console.log(emailRef.current.value, passwordRef.current.value)
        loginEmail(emailRef.current.value, passwordRef.current.value)
    }, [])

    const EmailSignup = useCallback(() => {
        // console.log(emailRef.current.value, passwordRef.current.value)
        signupEmail(emailSignupRef.current.value, passwordSignupRef.current.value, nameRef.current.value)
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
                margin: "56px auto",
                flexDirection: "column",
                alignItems: "center",
            }}
            sx={{
                mt: 2,
                p: 2,
                backdropFilter: "blur(10px)",
                borderRadius: 1,
                boxShadow: theme.shadows[7],
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
            <Typography variant="h5" align="left" sx={{ mt: 0, mr: "auto" }} color="white.main">
                Welcome to Cards
            </Typography>
            <Box
                ref={container}
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
                        position: "relative",
                        height: tab === 2 ? 326 : 252,
                        width: "100%",
                        maxWidth: 360,
                        transition: "height 0.2s",
                    }}
                >
                    <Slide direction="left" in={tab === 1} mountOnEnter unmountOnExit container={container.current}>
                        <div
                            style={{
                                display: "flex",
                                position: "absolute",
                                width: "100%",
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
                                    margin: "8px 0 10px auto",
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
                            <span
                                style={{
                                    margin: "8px 0 10px auto",
                                    fontSize: 12,
                                    color: "grey",
                                    cursor: "pointer",
                                }}
                                onClick={() => setTab(2)}
                            >
                                Or signup with email
                            </span>
                        </div>
                    </Slide>
                    <Slide direction="right" in={tab === 2} mountOnEnter unmountOnExit container={container.current}>
                        <div
                            style={{
                                display: "flex",
                                position: "absolute",
                                width: "100%",
                                flexDirection: "column",
                                alignContent: "center",
                                justifyContent: "center",
                            }}
                        >
                            <br />
                            <TextField
                                color="primary"
                                id="nameSignup"
                                variant="outlined"
                                label="Name"
                                type="text"
                                // defaultValue=""
                                // helperText="johncena@wwe.com"
                                placeholder="Enter Name"
                                required
                                fullWidth
                                inputRef={nameRef}
                                // value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span className="material-icons">badge</span>
                                        </InputAdornment>
                                    ),
                                }}
                            />
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
                                inputRef={emailSignupRef}
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
                                inputRef={passwordSignupRef}
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
                            <Button variant="contained" color="primary" onClick={EmailSignup} sx={{ mt: 2, mb: 2 }}>
                                Signup
                            </Button>
                            <span
                                style={{
                                    margin: "0 0 10px auto",
                                    fontSize: 12,
                                    color: "grey",
                                    cursor: "pointer",
                                }}
                                onClick={() => setTab(1)}
                            >
                                Continue Login with email
                            </span>
                        </div>
                    </Slide>
                </div>

                <Divider sx={{ width: "100%", my: 1 }} />
                <Typography variant="caption" align="center" sx={{ mb: 2 }} color="white.main">
                    Or continue with
                </Typography>
                <Button variant="outlined" sx={{ width: "100%", maxWidth: 360 }} startIcon={<img src={google} style={{ cursor: "pointer" }} alt="Login with Google"></img>} onClick={LoginGoogle}>
                    Continue using Google
                </Button>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ width: "100%", mt: 2 }} variant="fullWidth" indicatorColor="primary" textColor="primary">
                    <Tab label="Login" value={1} />
                    <Tab label="Signup" value={2} />
                </Tabs>
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