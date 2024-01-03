import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContexte';
import defautProfilePic from '../../assets/default-profile.png';

import './Historique.css';

interface Match {
    id: number;
    user1Id: number;
    user2Id: number;
    user1Score: number;
    user2Score: number;
    playedAt: string;
    user1Pseudo: string;
    user1ImageURL: string;
    user2Pseudo: string;
    user2ImageURL: string;
}

const Historique: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const auth = useAuth();
	const {authToken} = useAuth()

    useEffect(() => {
        if (auth.user && auth.user.id) {
            fetchMatches(auth.user.id);
        }
    }, [auth.user]);


    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return `${Math.floor(interval)} ans`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} mois`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} jours`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} heures`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} minutes`;

        return `${Math.floor(seconds)} secondes`;
    };

    const fetchUserDetails = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:4000/user/by-id/${userId}`,
				{
					headers: {
						'Authorization': `Bearer ${authToken}`
					}
				}
			);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
            return null; 
        }
    };

    const fetchMatches = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:4000/score/matches/${userId}`,
			{
				headers: {
					'Authorization': `Bearer ${authToken}`
				}
			});
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const matchesData = await response.json();

            const matchesWithUserDetails = await Promise.all(matchesData.map(async (match: Match) => {
                const user1Details = await fetchUserDetails(match.user1Id);
                const user2Details = await fetchUserDetails(match.user2Id);

                
            
                return {
                    ...match,
                    user1Pseudo: user1Details?.pseudo,
                    user1ImageURL: user1Details?.imageURL,
                    user2Pseudo: user2Details?.pseudo,
                    user2ImageURL: user2Details?.imageURL,
                };
            }));
            matchesWithUserDetails.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

            console.log('Matches:', matchesWithUserDetails);

            setMatches(matchesWithUserDetails);
        } catch (error) {
            console.error('Erreur lors de la récupération des matchs:', error);
        }
    };

    const isUserWinner = (match: Match) => {
        return match.user1Id === auth.user?.id ? match.user1Score > match.user2Score : match.user2Score > match.user1Score;
    };

    return (
        <div className="historique">
            <h1>Historique des parties</h1>
            {matches.map((match) => (
                <div key={match.id} className={`match ${isUserWinner(match) ? 'green' : 'red'}`}>
                    <div className="player-info">
                        <img src={auth.user?.id === match.user1Id  ? match.user1ImageURL || defautProfilePic : match.user2ImageURL || defautProfilePic} alt="User" />
                        <p>{auth.user?.id === match.user1Id ? match.user1Pseudo : match.user2Pseudo}</p>
                    </div>
                    <div className="score">
                        <p>{auth.user?.id === match.user1Id ? `${match.user1Score} - ${match.user2Score}` : `${match.user2Score} - ${match.user1Score}`}</p>
                    </div>
                    <div className="player-info">
                        <img src={auth.user?.id === match.user1Id ? match.user2ImageURL : match.user1ImageURL || defautProfilePic} alt="player-info opponent" />
                        <p>{auth.user?.id === match.user1Id ? match.user2Pseudo : match.user1Pseudo}</p>
                        <div className="time-since">
                        <p>Il y a {timeSince(match.playedAt)}</p>
                    </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
};

export default Historique;
