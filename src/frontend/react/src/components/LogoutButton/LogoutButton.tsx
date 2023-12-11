import React from "react";
import "./LogoutButton.css";
import { AuthProvider, useAuth } from "../../context/AuthContexte";

function LogoutButton(){
    const {logout} = useAuth();


    return (
        <button className="deconnexion-btn" onClick={logout}>Déconnexion</button>
    )
}

export default LogoutButton;