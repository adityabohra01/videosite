import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginWindow from "../../components/LoginWindow";
import Scorer from "../../components/Scorer";
import AuthContext from "../../firebase/auth/AuthContext";

export default function AddScore() {
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div>
            <br></br>
            {authContext.user ? (
                <Scorer />
            ) : (
                <LoginWindow />
            )}
        </div>
    );
}