import React, { useEffect, useState } from 'react';
import './Game.css';
import SoloGameScene from '../../components/GameScene/SoloGameScene';
import OnlineGameScene from '../../components/GameScene/OnlineGameScene';
import GameModeButtons from '../../components/GameModeButtons/GameModeButtons';
import io from 'socket.io-client';
import Lobby from '../../components/Lobby/Lobby';
import { showNotificationSuccess, showNotificationError, showNotificationWarning } from './Notification';
import SocketContext from './SocketContext';

const DebugPanel: React.FC<{ variables: Record<string, any> }> = ({ variables }) => (
	<div style={{ position: 'fixed', top: 0, right: 0, background: 'white', padding: '10px', border: '1px solid #ddd' }}>
		<h3>Debug Panel</h3>
		<pre>{JSON.stringify(variables, null, 2)}</pre>
	</div>
);

const Game: React.FC = () => {
	const [socket, setSocket] = useState<any>(null);
	const [inLobby, setInLobby] = useState<boolean>(false);
	const [lobbyData, setLobbyData] = useState<any>(null);

	useEffect(() => {
		const socket = io('http://localhost:4000/game');
		setSocket(socket);

		socket.on('exception', (data: any) => {
			showNotificationError('Error', data.message);
		});

		socket.on('server.game.message', (data: any) => {
			showNotificationSuccess('', data.message);
		});


		socket.on('server.lobby.state', (data: any) => {
			console.log('Received Lobby State:', data);
			setInLobby(true);
			setLobbyData(data);
		});

		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, []);

	const handlePing = () => {
		if (socket) {
			console.log('Sending client.ping...');
			socket.emit('client.ping', {});

			socket.once('server.pong', (data: any) => {
				showNotificationSuccess('Pong !', data.message);
			})
		}
	};

	const handleLeaveLobby = () => {
		setInLobby(false);
		setLobbyData(null);
	};

	return (
		<SocketContext.Provider value={socket}>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
				{/* <DebugPanel variables={{ selectedGameMode }} /> */}
				{inLobby ? (<Lobby lobbyData={lobbyData} onLeaveLobby={handleLeaveLobby} />) : (<>
					<GameModeButtons />
					<button onClick={handlePing}>Ping</button> </>)}
			</div>
		</SocketContext.Provider>
	);
};

export default Game;