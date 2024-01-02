import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContexte'; // Importez votre hook useAuth
import './Historique.css'; // Assurez-vous d'avoir ce fichier CSS dans votre projet

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
    const auth = useAuth(); // Utilisation de useAuth pour accéder au contexte d'authentification

    useEffect(() => {
        if (auth.user && auth.user.id) {
            fetchMatches(auth.user.id);
        }
    }, [auth.user]);

    const fetchMatches = async (userId: number) => {
        // Remplacez cette URL par l'URL de votre API
        const response = await fetch(`http://localhost:4000/score/matches/${userId}`);
        const data = await response.json();
        setMatches(data);
        
    };

    const isUserWinner = (match: Match) => {
        if (match.user1Id === auth.user?.id) {
            return match.user1Score > match.user2Score;
        } else {
            return match.user2Score > match.user1Score;
        }
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
