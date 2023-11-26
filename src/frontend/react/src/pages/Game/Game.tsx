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
		</div>
	  );
	};
  
  export default Game;