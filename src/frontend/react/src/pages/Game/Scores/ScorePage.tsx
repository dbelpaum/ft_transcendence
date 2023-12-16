import React from 'react';
import ScoreRanking from './ScoreRanking'; // Importer le composant ScoreRanking

// Définir l'interface Score dans le même fichier
interface Score {
  player: string;
  score: number;
}

const ScorePage: React.FC = () => {
  // temporaire a adapter avec les logins et/ou la db
  const scores: Score[] = [
    { player: 'Joueur 1', score: 54 },
    { player: 'Brasko91', score: 1 },
    { player: 'Bourlingeurdu77', score: 13563456 },
    { player: 'Tueurdetilted94', score: 345 },
    { player: 'Pourfendeurdenina81', score: 5 },
    { player: 'Schlassdu78', score: 124 },
    { player: 'PGMdu91', score: 12 },
    // ... autres scores
  ];

  return (
    <div>
      <h1>Classement </h1>
      <h2>Qui est le GOAT de ce jeu ??</h2>
      <ScoreRanking scores={scores} />
    </div>
  );
};

export default ScorePage;
