import AppBar from "@mui/material/AppBar"
import React, { useContext, useEffect } from "react"
// import { Link } from "react-router-dom"
import Container from '@mui/material/Container'
import Toolbar from "@mui/material/Toolbar"
import Typography from '@mui/material/Typography'
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"
// import "./navbar.css"
import AuthContext from "../../firebase/auth/AuthContext"
import { redirect, useNavigate } from "react-router-dom"
import AccountMenu from "../MiniLogin/AccountMenu"



function NavBar(props) {
    const trigger = useScrollTrigger()
    const authContext = useContext(AuthContext)
    const navigation = useNavigate()
    useEffect(() => {
        if (authContext.user && window.location.pathname !== "/" && window.location.pathname !== "/join" && !window.location.hash.startsWith("#UID")) {
            // history.push("/user")
            console.log(authContext.access)
            navigation( "/" + authContext.access )
            console.log(authContext.user)
        }
    }, [authContext.user])

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar color="navbar" position="sticky" style={{ zIndex: 5 }}>
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        style={{
                            justifyContent: "space-between",
                            flexDirection: "row-reverse",
                        }}
                    >
                        {/* <img
                            src={logo}
                            alt="Logo"
                            className="navIcon"
                            style={{
                                height: matches ? "42px" : "36px",
                                width: matches ? "42px" : "36px",
                                borderRadius: 8,
                                // margin: "0 11px",
                            }}
                        ></img> */}
                        <Typography
                            style={{
                                fontWeight: "bold",
                                // margin: "10px",
                                fontSize: "1.5em",
                                color: "#323232",
                                position: "absolute",
                                left: "50%",
                                transform: "translate(-50%, 0)",
                            }}
                        >
                            King Solomon's Goldmine
                        </Typography>
                        {authContext.user && window.location.pathname != "/" ? <AccountMenu authContext={authContext} /> : null}
                    </Toolbar>
                </Container>
            </AppBar>
        </Slide>
    )
}

export default NavBar
