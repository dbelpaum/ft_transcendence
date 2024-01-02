import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContexte';

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

    useEffect(() => {
        if (auth.user && auth.user.id) {
            fetchMatches(auth.user.id);
        }
    }, [auth.user]);

    const fetchUserDetails = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:4000/user/by-id/${userId}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
            return null; // Retourne null en cas d'erreur
        }
    };

    const fetchMatches = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:4000/score/matches/${userId}`);
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
            {matches.map((match) => (
                <div key={match.id} className={`match ${isUserWinner(match) ? 'green' : 'red'}`}>
                    <div className="player-info">
                        <img src={match.user1Id === auth.user?.id ? match.user1ImageURL : match.user2ImageURL} alt="User" />
                        <p>{match.user1Id === auth.user?.id ? match.user1Pseudo : match.user2Pseudo}</p>
                    </div>
                    <div className="score">
                        <p>{match.user1Score} - {match.user2Score}</p>
                    </div>
                    <div className="player-info">
                        <img src={match.user1Id === auth.user?.id ? match.user2ImageURL : match.user1ImageURL} alt="Opponent" />
                        <p>{match.user1Id === auth.user?.id ? match.user2Pseudo : match.user1Pseudo}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Historique;
