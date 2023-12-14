import React, { useState } from 'react';
import './Game.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import SoloGameScene from '../../components/GameScene/SoloGameScene';
import OnlineGameScene from '../../components/GameScene/OnlineGameScene';
import GameModeButtons from '../../components/GameModeButtons/GameModeButtons';
import GameOnlineOptionButtons from '../../components/GameModeButtons/OnlineGameOptions';
import ScorePage from './Scores/ScorePage';
const Game: React.FC = () => {
  const [selectedGameMode, setSelectedGameMode] = useState<string>(''); // Initial state
  const [selectedOnlineOption, setSelectedOnlineOption] = useState<string>(''); // Initial state
  const [showScoreRanking, setShowScoreRanking] = useState<boolean>(false); // Ajout d'un état pour afficher ou masquer la superposition du classement

  const handleSelectMode = (mode: string) => {
    setSelectedGameMode(mode);
  };

  const handleSelectOnlineOption = (mode: string) => {
    setSelectedOnlineOption(mode);
  };

  const toggleScoreRanking = () => {
    setShowScoreRanking(!showScoreRanking);
  };


  
return (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    {!selectedGameMode && <GameModeButtons onSelectMode={handleSelectMode} />}
    <div id="gameScore"></div>
    {selectedGameMode === 'solo' && <SoloGameScene width={800} height={600} />}
    {selectedGameMode === 'online' && selectedOnlineOption === '' && (
      <div>
        <GameOnlineOptionButtons onSelectMode={handleSelectOnlineOption} />
      </div>
    )}
    {/* {selectedGameMode === 'online' && selectedOnlineOption != '' && <OnlineGameScene width={800} height={600}/>}
    <div id="info"></div> */}
    {!selectedGameMode && (
      <div style={{ fontSize: '20px' }}>
        <p><span className="keycap">A</span>/<span className="keycap">Q</span>/<span className="keycap">←</span> to move left</p>
        <p><span className="keycap">D</span>/<span className="keycap">→</span> to move right</p>
        <p><span className="keycap">R</span> to switch camera</p>
      </div>
    )}
    {/* Bouton pour ouvrir/fermer la superposition du classement */}
    <button onClick={toggleScoreRanking}>Voir le classement</button>
      {/* Superposition modale du classement des scores */}
      <div className={`scoreRankingOverlay ${showScoreRanking ? 'active' : ''}`}>
        <div className={`scoreRankingModal ${showScoreRanking ? 'active' : ''}`}>
          <button onClick={toggleScoreRanking}>Fermer</button>
          {/* Affichage du classement des scores */}
          <ScorePage />
        </div>
      </div>
    </div>
  );
};




export default Game;