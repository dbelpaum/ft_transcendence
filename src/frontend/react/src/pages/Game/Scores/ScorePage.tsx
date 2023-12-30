import React, { useEffect, useState } from 'react';
import ScoreRanking from './ScoreRanking'; // Importer le composant ScoreRanking

// Définir l'interface Score dans le même fichier
interface Score {
  player: string;
  score: number;
}

const ScorePage: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:4000/score'); // Remplacez URL_DE_VOTRE_BACKEND par l'URL de votre API de scores
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des scores');
        }
        const data = await response.json();
        setScores(data); // Mettre à jour les scores avec les données récupérées depuis le backend
      } catch (error) {
        console.error('Erreur lors de la récupération des scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h1>Classement</h1>
      <h2>Qui est le GOAT de ce jeu ?</h2>
      <ScoreRanking scores={scores} />
    </div>
  );
};

export default ScorePage;
