import React, { useState } from 'react';

interface GameOnlineOptionButtonsProps {
	onSelectMode: (mode: string, roomCode?: string) => void;
}

const GameOnlineOptionButtons: React.FC<GameOnlineOptionButtonsProps> = ({ onSelectMode }) => {
	const [roomCode, setRoomCode] = useState<string>('');

	const handleMatchmakingClick = () => {
		// Add your logic here, for example, logging to the console
		onSelectMode('matchmaking');
	};

	const handleCreateRoomClick = async () => {
		// Add logic for 'Create Room' button click
		// Send a request to the server to create a room
		try {
			const response = await fetch('/api/createRoom', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({}),
			});

			if (response.ok) {
				const data = await response.json();
				onSelectMode('create-room', data.roomCode);
			} else {
				console.error('Failed to create room');
			}
		} catch (error) {
			console.error('Error creating room:', error);
		}
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