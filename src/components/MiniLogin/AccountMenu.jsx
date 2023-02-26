import React from "react"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { signOut } from "firebase/auth"
import LoaderUtils from "../Loader/LoaderUtils"
import SnackbarUtils from "../SnackbarUtils"
import { useNavigate } from "react-router-dom"
import ChangePassword from "./ChangePassword"
import AuthContext from "../../firebase/auth/AuthContext"

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [openPasswordChange, setOpenPasswordChange] = React.useState(false)
    const navigator = useNavigate()
    const authContext = React.useContext(AuthContext)
    const open = Boolean(anchorEl)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        console.log("Signout")
        LoaderUtils.open()
        signOut(authContext.auth)
            .then(() => {
                SnackbarUtils.success("Signed Out Successfully")
                LoaderUtils.close()
                navigator("/login")
            })
            .catch(error => {
                SnackbarUtils.error(error.message)
                LoaderUtils.close()
            })
    }

    return (
        <React.Fragment>
            <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
                    <Avatar
                        sx={{ width: 32, height: 32, fontSize: "1em" }}
                        alt={authContext.user.displayName || ""}
                        src={authContext.user.photoURL || ""}
                    >
                        {(() => {
                            if (authContext.user) {
                                const name = authContext.user.displayName || authContext.user.email
                                const arr = name.split(" ")
                                if (arr.length > 1) return arr[0].charAt(0) + arr[1].charAt(0)
                                else if (arr.length === 1) return arr[0].charAt(0)
                                else return "U"
                            } else return "U"
                        })()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >

                <MenuItem>
                    <Avatar src={authContext.user.photoURL || ""} /> {authContext.user.displayName || authContext.user.email}
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        if (document.fullscreenElement) document.exitFullscreen()
                        else document.querySelector("html").requestFullscreen()
                    }}
                >
                    <ListItemIcon>
                        <span className="material-icons" fontSize="small">
                            fullscreen
                        </span>
                    </ListItemIcon>
                    Fullscreen
                </MenuItem>
                <MenuItem onClick={() => {
                    setOpenPasswordChange(true)
                }}>
                    <ListItemIcon>
                        <span className="material-icons" fontSize="small">
                            lock_reset
                        </span>
                    </ListItemIcon>
                    Change Password
                </MenuItem>
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <span className="material-icons" fontSize="small">
                            logout
                        </span>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            { openPasswordChange ? <ChangePassword open={openPasswordChange} setOpen={setOpenPasswordChange} user={authcontext.user} /> : null}
        </React.Fragment>
    )
}
