import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./UserProfil.css";
import { useAuth } from "../../context/AuthContexte";
import { Link } from "react-router-dom";
import FriendshipButton from "../../components/FriendshipButton/FriendshipButton";
import { MpChannel } from "../Chat/chat.interface";
import { useNavigate } from 'react-router-dom';


interface UserInfo {
    id: number;
    id42: number;
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
    const [buttonStatus, setButtonStatus] = useState<"addFriend" | "removeFriend" | "block" | "cancelRequest">('addFriend');

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const {authToken, user, chatSocket, recharger} = useAuth();
    const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null); // 'friend' | 'pending' | 'blocked' | null
	const navigate = useNavigate();
    

    const { pseudo } = useParams<{ pseudo: string }>();

    useEffect(() => {
        if (!pseudo) {
            console.log("Aucun pseudo utilisateur fourni");
            return;
        }

        

        
        fetch(`http://localhost:4000/user/by-pseudo/${pseudo}`)
            .then(response => response.json())
            .then((data: UserInfo) => {
                setUserInfo(data);
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



useEffect(() => {
    if (!user?.id42 || !userInfo?.id42) {
        return;
    }
    fetch(`http://localhost:4000/friendship/${user?.id42}/relation/${userInfo?.id42}`)
        .then(response => response.json())
        .then((data) => {
            setFriendshipStatus(data.status);
            if (data === 'friend') {
                setButtonStatus('removeFriend');
            } else if (data === 'pending') {
                setButtonStatus('cancelRequest');
            } else if (data === 'blocked') {
                setButtonStatus('block');
            } else {
                setButtonStatus('addFriend');
            }
        })
        .catch(error => console.log(error));
     }, [user?.id42, userInfo?.id42]);

    // console.log(friendshipStatus);
    // console.log(buttonStatus);


    // console.log(`L'utilisateur a ajouter est: ${userInfo?.pseudo}`);
    // console.log(`L'utilisateur connecté est: ${user?.pseudo}`)

    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    const handleAddFriendClick = () => {
        // Envoyer la requête d'ami
        fetch(`http://localhost:4000/friendship/${user?.id}/add-friend/${userInfo?.id}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                setButtonStatus('cancelRequest');
            }
            // } else {
            //     throw new Error('Échec de la demande d\'ami');
            // }
        })
        .catch(error => {
            console.error(error);
            setButtonStatus('addFriend');
        });

    }

	const triggerMp = () => {
		if (user && chatSocket)
		{
			const mpCreateInfo : MpChannel =
			{
				user1: user,
				user2: userInfo,
			}
			chatSocket.emit('mp_create', mpCreateInfo);
			recharger()
			navigate(`/chat?mp=${userInfo.pseudo}`);
		}

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
            {friendshipStatus === 'notFriends' && (
				<FriendshipButton
					status={buttonStatus}
					onButtonClick={ handleAddFriendClick}
					color="green"
				/>
          )}
			</div>
			<div className="mp">
				<button onClick={triggerMp}>Envoyer un mp</button>
			</div>
		</main>
  );
};

export default UserProfile;