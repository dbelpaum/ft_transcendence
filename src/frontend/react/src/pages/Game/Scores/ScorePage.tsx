import React, { useState, useEffect } from 'react';
import ScoreRanking from './ScoreRanking';
import { useAuth } from '../../../context/AuthContexte';

interface Score {
  player: string;
  score: number;
}

const ScorePage: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
	const {authToken} = useAuth()
	
  useEffect(() => {
    
    fetch('http://localhost:4000/user/wins',
		{
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		}
	)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const adaptedScores = data.map((item: any) => ({
            player: item.pseudo,
            score: item.Wins,
          }));
          setScores(adaptedScores);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des scores :', error);
      });
  }, []);

  return (
    <div>
      <h1>Classement</h1>
      <ScoreRanking scores={scores} />
    </div>
  );
};

export default ScorePage;
