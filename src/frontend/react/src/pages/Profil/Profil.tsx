import React from 'react';
import './Profil.css';
import Title from '../../components/Title/Title';
import { useAuth } from '../../context/AuthContexte';
import '../../components/LogoutButton/LogoutButton';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

function Profil() {
    const { user } = useAuth();

    return (
        <main className="profil-container">
            <Title title="Votre Profil" />
            <LogoutButton/>
            <div className="profil-details">
                <p>Nom d'utilisateur: {user?.login}</p>
                <p>Adresse Email: {user?.email}</p>
                <p>Nom: {user?.lastname}</p>
                <p>Prénom: {user?.firstname}</p>
                {/* Image de profil */}
                <div className="profil-image-container">
                    <img src={user?.imageUrl || 'default-profile.png'} alt="profil" />
                </div>
            </div>
        </main>
    );
}

export default Profil;
