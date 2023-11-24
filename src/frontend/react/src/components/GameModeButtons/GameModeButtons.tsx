import React from 'react';

interface GameModeButtonsProps {
  onSelectMode: (mode: string) => void;
}

const GameModeButtons: React.FC<GameModeButtonsProps> = ({ onSelectMode }) => {
	return (
	  <div style={{ textAlign: 'center', marginTop: '20px' }}>
		<button
		  style={buttonStyle}
		  onClick={() => onSelectMode('ai')}
		>
		  Play alone
		</button>
		<button
		  style={buttonStyle}
		  onClick={() => onSelectMode('online')}
		>
		  Play online
		</button>
	  </div>
	);
  };

const buttonStyle: React.CSSProperties = {
	backgroundColor: '#4CAF50', /* Green background color */
	border: 'none', /* Remove borders */
	color: 'white', /* White text color */
	padding: '15px 32px', /* Set padding */
	textAlign: 'center', /* Center text */
	textDecoration: 'none', /* Remove underline */
	display: 'inline-block', /* Make the button a block element */
	fontSize: '16px', /* Set font size */
	borderRadius: '8px', /* Rounded corners */
	cursor: 'pointer', /* Add a pointer cursor on hover */
	margin: '10px' /* Add some margin between buttons */
  };

export default GameModeButtons;