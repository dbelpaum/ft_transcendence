import React, { useContext, useState } from 'react';
import './GameModeButtons.css';
import { SocketContext } from '../../pages/Game/SocketContext';
import { Socket } from 'socket.io-client';

const GameModeButtons: React.FC = () => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const [roomCode, setRoomCode] = useState<string>('');

	const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomCode(event.target.value);
	};

	const handleCreateRoom = () => {
		if (socket) {
			socket.emit('client.lobby.create', { mode: 'vanilla' });
		}
	};

	const handleJoinRoom = () => {
		if (socket) {
			socket.emit('client.lobby.join', { mode: 'vanilla', lobbyId: roomCode });
		}
	}


	return (
		<div className="buttonContainer">
			<div><button className='buttonStyle'>
				Solo
			</button></div>

			<div className="buttonColumn">
			<div><button className='buttonStyle' onClick={handleCreateRoom}>
				Create Room
			</button></div>

			<div><button className='buttonStyle' onClick={handleJoinRoom}>
				Join Room
			</button></div>
			<input placeholder='Room Code' className='inputBar' value={roomCode} onChange={handleRoomCodeChange}></input>
			</div>
			
			<div><button className='buttonStyle'>
				Matchmaking
			</button></div>
		</div>
	);
};

export default GameModeButtons;