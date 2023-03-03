import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React from "react";
import AuthContext from "../../firebase/auth/AuthContext";
import LoaderUtils from "../Loader/LoaderUtils";
import SnackbarUtils from "../SnackbarUtils";
import "./index.css";

export default function RoleSelector() {
    const authContext = React.useContext(AuthContext);
    const [open, setOpen] = React.useState(true);
    const nameRef = React.useRef(null);
    
    const setRole = async (role) => {
        // if (!nameRef.current.value) {
        //     SnackbarUtils.error("Please enter a name");
        //     return;
        // }
        // LoaderUtils.open();
        // authContext.user.updateProfile({
        //     displayName: nameRef.current.value,
        // }).then(() => {
        //     authContext.setUser(user => ({
        //         ...user,
        //         displayName: nameRef.current.value,
        //     }));
        // }).catch(err => {
        //     SnackbarUtils.error("Unable to update name");
        // }).finally(() => {
        //     LoaderUtils.close();
        // });
        fetch("/api/setRole/" + role, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + authContext.user.token,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                setOpen(false);
                setTimeout(() => {
                    authContext.setUser(user => ({
                        ...user,
                        isUser: true,
                        isCreator: role === 'creator' ? true : false,
                    }));
                    LoaderUtils.close();
                }, 300);
            }
        })
        .catch(err => {
            LoaderUtils.close()
            throw err;
        })

    }

    return (
        <Dialog open={open}>
            <DialogTitle>Choose your role and name</DialogTitle>
            <DialogContent>
                <DialogContentText>Choose between a content Creator or Consumer</DialogContentText>
                <div className="option-container">
                    <div className="optionBox" onClick={() => setRole("creator")}>
                        <span className="material-icons">person</span>
                        <Typography>Creator</Typography>
                    </div>
                    <div className="optionBox" onClick={() => setRole("user")}>
                        <span className="material-icons">person</span>
                        <Typography>Consumer</Typography>
                    </div>
                </div>
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    )
}