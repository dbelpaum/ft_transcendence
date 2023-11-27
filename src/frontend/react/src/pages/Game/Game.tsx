import React, { useState } from 'react';
import './Game.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import GameScene from '../../components/GameScene/GameScene';
import GameModeButtons from '../../components/GameModeButtons/GameModeButtons';

const Game: React.FC = () => {
	const [selectedGameMode, setSelectedGameMode] = useState<string>(''); // Initial state

  
	const handleSelectMode = (mode: string) => {
	  setSelectedGameMode(mode);
	};


  
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
		  {!selectedGameMode && <GameModeButtons onSelectMode={handleSelectMode} />}
		  <div id="gameScore"></div>
		  <GameScene
			width={800}
			height={600}
			initialGameMode={selectedGameMode}
		  />
		  <div id="info"></div>
		  {!selectedGameMode &&<div style={{ fontSize: '20px' }}>
			<p><span className="keycap">A</span>/<span className="keycap">Q</span>/<span className="keycap">←</span> to move left</p>
			<p><span className="keycap">D</span>/<span className="keycap">→</span> to move right</p>
			<p><span className="keycap">R</span> to switch camera</p>
		  </div>}
		</div>
	  );
	};
  
  export default Game;