import React, { useState } from 'react';
import './Game.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import GameScene from '../../components/GameScene/GameScene';
import GameModeButtons from '../../components/GameModeButtons/GameModeButtons';

const Game: React.FC = () => {
	const [selectedGameMode, setSelectedGameMode] = useState<string>(''); // Initial state
	const [playerPaddlePosition, setPlayerPaddlePosition] = useState<number>(0);
  
	const handleSelectMode = (mode: string) => {
	  setSelectedGameMode(mode);
	};

	const handlePlayerMove = (deltaX: number) => {
		// Update the player paddle position or perform other actions as needed
		setPlayerPaddlePosition((prevPosition) => prevPosition + deltaX);
	};
  
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
		  {!selectedGameMode && <GameModeButtons onSelectMode={handleSelectMode} />}
		  <GameScene
			width={800}
			height={600}
			initialGameMode={selectedGameMode}
		  />
		</div>
	  );
	};
  
  export default Game;