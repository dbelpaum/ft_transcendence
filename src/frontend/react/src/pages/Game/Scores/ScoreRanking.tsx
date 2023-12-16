import React from 'react';

export interface Score {
  player: string;
  score: number;
}

interface ScoreRankingProps {
  scores: Score[];
}

const ScoreRanking: React.FC<ScoreRankingProps> = ({ scores }) => {
  // Trier les scores par ordre décroissant
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div>
      <ol>
        {sortedScores.map((score, index) => (
          <li key={index}>
            <span>{score.player}</span> - <span>{score.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ScoreRanking;
