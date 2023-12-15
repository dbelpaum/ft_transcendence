import React, { useContext, useState } from 'react';
import './GameModeButtons.css';
import { SocketContext } from '../../pages/Game/SocketContext';
import { Socket } from 'socket.io-client';
import SoloGameScene from '../GameScene/SoloGameScene';
import { showNotificationSuccess } from '../../pages/Game/Notification';

const GameModeButtons: React.FC = () => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const [roomCode, setRoomCode] = useState<string>('');
	const [showSoloGame, setShowSoloGame] = React.useState<boolean>(false);

	const handleSelectSoloMode = () => {
		setShowSoloGame(true);
	};

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

	const handlePing = () => {
		if (socket) {
			console.log('Sending client.ping...');
			socket.emit('client.ping', {});

			socket.once('server.pong', (data: any) => {
				showNotificationSuccess('Pong !', data.message);
			})
		}
	};

	const handleKeyDown = (e : React.KeyboardEvent) => {
		if ( e.key === 'Enter')
			handleJoinRoom();
	}


	return (
		<div className="buttonContainer">
			{showSoloGame ? (
        <SoloGameScene width={800} height={600}/>
      ) : (
        <>
			<div><button className='buttonStyle' onClick={handleSelectSoloMode}>
				Solo
			</button></div>

			<div className="buttonColumn">
				<div><button className='buttonStyle' onClick={handleCreateRoom}>
					Create Room
				</button></div>

				<div><button className='buttonStyle' onClick={handleJoinRoom}>
					Join Room
				</button></div>
				<input placeholder='Room Code' onKeyDown={handleKeyDown} className='inputBar' value={roomCode} onChange={handleRoomCodeChange}></input>
			</div>

			<div><button className='buttonStyle'>
				Matchmaking
			</button></div>
			<button onClick={handlePing}>Ping</button>
			</>)}
		</div>
	);
};

export default GameModeButtons;