import React, { useState } from 'react';

interface GameOnlineOptionButtonsProps {
	onSelectMode: (mode: string, roomCode?: string) => void;
	onCreateRoom: () => void;  // Add this prop
	onJoinRoom: (lobbyId: string) => void;
}

const GameOnlineOptionButtons: React.FC<GameOnlineOptionButtonsProps> = ({ onSelectMode, onCreateRoom }) => {
	const [roomCode, setRoomCode] = useState<string>('');

	const handleMatchmakingClick = () => {
		// Add your logic here, for example, logging to the console
		onSelectMode('matchmaking');
	};

	const handleCreateRoomClick = async () => {
		onCreateRoom();  // Call the new prop function when "Create Room" is clicked
	};

	const handleJoinRoomClick = () => {
		// Add logic for 'Join Room' button click if needed
		if (roomCode) {
			onSelectMode('join-room', roomCode);
		}
	};
	return (
		<div style={{ textAlign: 'center', marginTop: '20px' }}>
			<button
				style={buttonStyle}
				onClick={handleMatchmakingClick}
			>
				Matchmaking
			</button>
			<button
				style={buttonStyle}
				onClick={handleCreateRoomClick}
			>
				Create Room
			</button>
			<br />
			<input placeholder='Room Code' value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input>
			<button
				style={buttonStyle}
				onClick={handleJoinRoomClick}
			>
				Join Room
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

export default GameOnlineOptionButtons;