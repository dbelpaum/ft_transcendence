import React from "react";
import "./LogoutButton.css";
import { useNavigate } from "react-router-dom";
import * as dotenv from "dotenv";
import { AuthProvider, useAuth } from "../../context/AuthContexte";

function LogoutButton(){
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

return (
  <button className="deconnexion-btn" onClick={handleLogout}>Déconnexion</button>
);
}

export default LogoutButton;