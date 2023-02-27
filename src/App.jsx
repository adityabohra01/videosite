import React, { useState, useRef, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import { SnackbarProvider } from "notistack"
import Snack from "./components/Snack"
import Loader from "./components/Loader"
import auth from "./firebase/auth"
import AuthContext from "./firebase/auth/AuthContext"
import { onAuthStateChanged } from "firebase/auth"
import SnackbarUtils from "./components/SnackbarUtils"
import LoaderUtils from "./components/Loader/LoaderUtils"
import LoginWindow from "./components/LoginWindow"
import RoleSelector from "./components/RoleSelector"
import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Navbar from "./components/Navbar"

function App() {
    const notistackRef = useRef()
    const theme = useTheme()
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        window.document.title = "Score Card"
        window.document.body.style.backgroundColor = theme.palette.background.default
        window.document.body.style.height = "100%"
        LoaderUtils.halt()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // get custom claims
                const idTokenResult = await user.getIdTokenResult(true)
                user.isUser = idTokenResult.claims.isUser
                user.isCreator = idTokenResult.claims.isCreator
                setUser(user)
                SnackbarUtils.success("Welcome !")
                LoaderUtils.unhalt()
                if (window.location.pathname === "/login") navigate("/")
            } else {
                LoaderUtils.unhalt()
                setUser(null)
            }
        })
    }, [])

    const authSyncSettings = {
        user: user,
        auth,
        setUser: setUser,
    }

    return (
        <AuthContext.Provider value={authSyncSettings}>
            <SnackbarProvider
                dense
                preventDuplicate
                maxSnack={3}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                ref={notistackRef}
                action={key => (
                    <IconButton aria-label="Close" onClick={() => notistackRef.current.closeSnackbar(key)}>
                        <span className="material-icons" style={{ color: theme.palette.white.main }}>
                            close
                        </span>
                    </IconButton>
                )}
            >
                <div
                    className="App"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <Snack></Snack>
                    <Loader></Loader>
                    <Navbar />
                    {user && (user.isCreator || user.isUser || <RoleSelector />)}
                    <Routes>
                        <Route exact path="/login" element={<LoginWindow />} />
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/upload" element={<Upload />} />
                        {/* <Route exact path="/creator" element={<AddScore />} /> */}
                    </Routes>
                </div>
            </SnackbarProvider>
        </AuthContext.Provider>
    )
}

export default App
