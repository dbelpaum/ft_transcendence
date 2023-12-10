import React, { useEffect, useState } from 'react';
import './Profil.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import profil from './profil.png';
import { useAuth } from '../../context/AuthContexte';

// interface Data {
//     message: string;
//     image:string;
//     id: number;
//     email:string; // Adjust the structure according to your API response
// }

function Profil() {
    const {user, setUser} = useAuth();

    return (
        <main>
            <br /><br /><br /><br />
            <p>Nom d'utilisateur: {user?.login}</p>
            <p>Adresse Email: {user?.email}</p>
            <p>Identifiant: {user?.id}</p>
            image: <img src={user?.imageUrl} alt="profil" />
        </main>
    )
}

export default Profil;

