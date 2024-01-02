
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./UserProfil.css";
import DefaultProfilePic from "../../assets/default-profile.png";
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
    const [buttonStatus, setButtonStatus] = useState<"addFriend" | "removeFriend" | "block"  |  'unblock'>('addFriend');

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const {authToken, user, chatSocket, recharger} = useAuth();
    const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null); // 'friend' | 'pending' | 'blocked' | null
	const navigate = useNavigate();
    const [userScore, setUserScore] = useState({ actualUser: 0, OpponentUser: 0 });
    

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
    fetch(`http://localhost:4000/friendship/${user?.id}/relation/${userInfo?.id}`)
        .then(response => response.json())
        .then((response) => {
            setFriendshipStatus(response.status);
            if (friendshipStatus === 'friend') {
                setButtonStatus('removeFriend');
            } else if (friendshipStatus === 'blocked') {
                setButtonStatus('unblock');
                console.log('On rentre dans le else if')
            } else {
                
                setButtonStatus('addFriend');
                console.log('On rentre dans le else')
            }
        })
        .catch(error => console.log(error));
     }, [user?.id, userInfo?.id]);



     useEffect(() => {
        if (!user || !userInfo) {
            return;
        }
    
        fetch(`http://localhost:4000/score/${user.id}/consult_score/${userInfo.id}`, {
            method: 'GET',
                headers: {
					'Authorization': `Bearer ${authToken}`
                },
    })
            .then(response => response.json())
            .then(score => {
                if (score.user1Id === user.id) {
                    setUserScore({ actualUser: score.user1Wins, OpponentUser: score.user2Wins });
                } else {
                    setUserScore({ actualUser: score.user2Wins, OpponentUser: score.user1Wins });
                }
            })
            .catch(error => console.error("Erreur lors de la récupération du score", error));
    }, [user, userInfo]);


    if (!userInfo) {
        return <div>Chargement...</div>;
    }

    console.log('Friendship status initial ' + friendshipStatus);

    const handleAddFriendClick = () => {
        // Envoyer la requête d'ami
        fetch(`http://localhost:4000/friendship/${user?.id}/add-friend/${userInfo?.id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        })
        .then(response => {
            if (response.ok) {
                setButtonStatus('removeFriend');
                setFriendshipStatus('friend');
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

    const handleRemoveFriendClick = async () => {
        try {
            const response = await fetch(`http://localhost:4000/friendship/${user?.id}/remove-friend/${userInfo?.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove friend');
            }
    
            setButtonStatus('addFriend');
            setFriendshipStatus('notFriend');
        } catch (error) {
            console.error(error);
        }
    }

    const handleBlockUserClick = async () => {
        try {
            const response = await fetch(`http://localhost:4000/friendship/${user?.id}/block/${userInfo?.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to block user');
            }
    
            setButtonStatus('unblock');
            setFriendshipStatus('blocked');
        } catch (error) {
            console.error(error);
        }
    }

    const handleUnblockUserClick = async () => {
        try {
            const response = await fetch(`http://localhost:4000/friendship/${user?.id}/unblock/${userInfo?.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to unblock user');
            }
    
            setButtonStatus('block');
            setFriendshipStatus('notFriend');
        } catch (error) {
            console.error(error);
        }
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
				<img src={userInfo.imageURL || DefaultProfilePic} alt={userInfo.pseudo} className="profile-pic"/>
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
            {friendshipStatus === 'notFriend' && user?.id !== userInfo?.id &&  (
            <FriendshipButton
                status={'addFriend'}
                onButtonClick={ handleAddFriendClick}
                color="green"
            />
          )}

            {friendshipStatus === 'friend' && (
            <FriendshipButton
                status={'removeFriend'}
                onButtonClick={handleRemoveFriendClick}
                color="red"
                />
            )}

            {friendshipStatus !== 'blocked' && user?.id !== userInfo?.id && (
            <FriendshipButton
                status={'block'}
                onButtonClick={handleBlockUserClick}
                color="red"
                />
            )

            }
            

            {friendshipStatus === 'blocked' && (
            <FriendshipButton
                status={'unblock'}
                onButtonClick={handleUnblockUserClick}
                color="green"
                />
            )}


			</div>
			<div className="mp">{
                user?.id !== userInfo?.id && (
				<button onClick={triggerMp}>Envoyer un mp</button>
                )
            }
			</div>

            <div className="profile-score">
            <h2>Score contre moi</h2>
            <div className="score-display">
                <span className="user-score">{userScore.actualUser}</span>
                <span>-</span>
                <span className="opponent-score">{userScore.OpponentUser}</span>
            </div>
</div>
		</main>
  );
};

export default UserProfile;