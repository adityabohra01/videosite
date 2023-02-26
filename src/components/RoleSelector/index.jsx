import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import React from "react";
import AuthContext from "../../firebase/auth/AuthContext";
import LoaderUtils from "../Loader/LoaderUtils";
import "./index.css";

export default function RoleSelector() {
    const authContext = React.useContext(AuthContext);
    const [open, setOpen] = React.useState(true);
    
    const setRole = async (role) => {
        LoaderUtils.open();
        const token = await authContext.user.getIdToken();
        fetch("/api/setRole/" + role, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
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
            <DialogTitle>Choose your role</DialogTitle>
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