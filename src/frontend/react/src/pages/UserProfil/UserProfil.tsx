import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./UserProfil.css";
import { Link } from "react-router-dom";

interface UserInfo {
    pseudo: string;
    email: string;
    isFriend: boolean;
    
   
}

interface UserProfileProps {
    pseudo: string;
}

const UserProfile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isFriend, setIsFriend] = useState<boolean>(false);

    const { pseudo } = useParams<{ pseudo: string }>(); // Utilisation de useParams pour récupérer le pseudo

    useEffect(() => {
        if (!pseudo) {
            console.log("Aucun pseudo utilisateur fourni");
            return;
        }

        console.log(`Le pseudo est: ${pseudo}`);

        
        fetch(`http://localhost:4000/user/by-pseudo/${pseudo}`)
            .then(response => response.json())
            .then((data: UserInfo) => {
                setUserInfo(data);
                setIsFriend(data.isFriend);
            })
            .catch(error => console.log(error));
    }, [pseudo]);

    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    return (
          <main className="user-profile-container">
          <br /><br /><br /><br />
          <h1>Profil de {userInfo.pseudo}</h1>
          <p>Email: {userInfo.email}</p>
          
          {isFriend ? (
            <p>Vous êtes déjà amis.</p>
          ) : (
            <button>Ajouter comme ami</button>
          )}
        </main>
    );
};

export default UserProfile;
