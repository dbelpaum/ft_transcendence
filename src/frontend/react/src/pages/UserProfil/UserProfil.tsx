import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./UserProfil.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContexte";
import { User } from "../../context/AuthInteface";

interface UserInfo {
	id: number;
    pseudo: string;
    email: string;
    isFriend: boolean;
    imageURL: string;
    firstname: string;
    lastname: string;
    bio: string;
    createdAt: string;
}

interface UserProfileProps {
    pseudo: string;
}

const UserProfile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isFriend, setIsFriend] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const {authToken, user} = useAuth();

    const { pseudo } = useParams<{ pseudo: string }>();

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


	useEffect(() => {
        if (!userInfo) {
            console.log("Aucun pseudo utilisateur fourni");
            return;
        }

        // Fonction pour faire la requête
        const checkConnection = () => {
            fetch(`http://localhost:4000/channel/connected/` + userInfo.id, 
			{
				headers: {
					'Authorization': `Bearer ${authToken}`
				}
			})
                .then(response => response.json())
                .then((isConnected) => {
                    setIsConnected(isConnected);
                })
                .catch(error => console.log(error));
        };

        // Appel initial
        checkConnection();

        // Configuration de l'intervalle
        const interval = setInterval(checkConnection, 30000); // 30000 ms = 30 secondes

        // Nettoyage en cas de démontage du composant
        return () => clearInterval(interval);
    }, [userInfo]);


    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    return (
		<main className="user-profile-container">
			<div className="profile-header">
				<img src={userInfo.imageURL} alt={userInfo.pseudo} className="profile-pic"/>
				<h1>{userInfo.firstname} {userInfo.lastname}
					<span className='channel_status'>
						<div className={isConnected ? "status_indicator connected" : "status_indicator"}></div>
					</span>
				</h1>
				<p className="user-email">{userInfo.email}</p>
				<p className="user-bio">{userInfo.bio}</p>
			</div>
			<div className="profile-details">
				<h2>À propos de moi</h2>
				<p>Pseudo: {userInfo.pseudo}</p>
				<p>Membre depuis: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
				
			</div>
			<div className="friend-action">
				{userInfo.isFriend ? (
					<p>Vous êtes déjà amis.</p>
				) : (
					<button>Ajouter comme ami</button>
				)}
			</div>
			<div className="mp">
				<button>Envoyer un mp</button>
			</div>
		</main>
  );
};

export default UserProfile;