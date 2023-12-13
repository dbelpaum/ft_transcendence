import React, { useEffect, useState } from 'react';
import './Game.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import SoloGameScene from '../../components/GameScene/SoloGameScene';
import OnlineGameScene from '../../components/GameScene/OnlineGameScene';
import GameModeButtons from '../../components/GameModeButtons/GameModeButtons';
import GameOnlineOptionButtons from '../../components/GameModeButtons/OnlineGameOptions';
import io from 'socket.io-client';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import LobbyPage from '../../components/LobbyPage/LobbyPage';

const Game: React.FC = () => {
	const [selectedGameMode, setSelectedGameMode] = useState<string>(''); // Initial state
	const [selectedOnlineOption, setSelectedOnlineOption] = useState<string>(''); // Initial state
	const [socket, setSocket] = useState<any>(null);  // State to store the WebSocket connection
	const navigate = useNavigate(); // useNavigate instead of useHistory
	const [roomId, setRoomId] = useState<string | null>(null);
	const [lobbyState, setLobbyState] = useState<any>(null);
	const location = useLocation();

	useEffect(() => {
		// Connect to the WebSocket server when the component mounts
		const socket = io('http://localhost:4000/game'); // Replace with your WebSocket server address
		setSocket(socket);

		// Clean up the WebSocket connection when the component unmounts
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on('server.lobby.state', (data: any) => {
				console.log('Received Lobby State:', data);
				// Update the UI or perform actions based on the lobby state data
				setLobbyState(data);
				setRoomId(data.lobbyId);
			});
		}

		return () => {
			if (socket) {
				socket.off('server.lobby.state');
			}
		};
	}, [socket]);

	useEffect(() => {
		if (lobbyState) {
			console.log('Initial Lobby State:', lobbyState);
		}
	}, [lobbyState]);

	const handlePing = () => {
		// Send a "Ping" event to the server when the button is clicked
		if (socket) {
			console.log('Sending client.ping...');
			socket.emit('client.ping', {});
		}
	};

	const handleCreateRoom = () => {
		// Send a "client.lobby.create" event to the server when the "Create Room" button is clicked
		if (socket) {
			console.log('Creating room...');
			socket.emit('client.lobby.create', { mode: 'vanilla' });
		}
	};

	const handleSelectMode = (mode: string) => {
		setSelectedGameMode(mode);
	};

	const handleSelectOnlineOption = (mode: string) => {
		setSelectedOnlineOption(mode);
	};

	useEffect(() => {
		// Check if there is a roomId parameter in the URL
		if (roomId) {
			console.log('Joined room with ID:', roomId);
			// Perform actions related to joining the room based on the roomId parameter
			navigate(`/game?roomId=${roomId}`);
		}
	}, [roomId, navigate]);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
			{!roomId && !selectedGameMode && <GameModeButtons onSelectMode={handleSelectMode} />}
			<div id="gameScore"></div>
			{!roomId && selectedGameMode === 'solo' && <SoloGameScene width={800} height={600} />}
			{!roomId && selectedGameMode === 'online' && selectedOnlineOption === '' && (
				<div>
					<GameOnlineOptionButtons onSelectMode={handleSelectOnlineOption} onCreateRoom={handleCreateRoom} />
				</div>
			)}
			{/* {selectedGameMode === 'online' && selectedOnlineOption != '' && <OnlineGameScene width={800} height={600}/>}
      <div id="info"></div> */}
			{!roomId && !selectedGameMode && (
				<div style={{ fontSize: '20px' }}>
					<p><span className="keycap">A</span>/<span className="keycap">Q</span>/<span className="keycap">←</span> to move left</p>
					<p><span className="keycap">D</span>/<span className="keycap">→</span> to move right</p>
					<p><span className="keycap">R</span> to switch camera</p>
				</div>
			)}
			<button onClick={handlePing}>Send Ping</button>
			{roomId && <LobbyPage roomId={roomId} socket={socket} initialLobbyState={lobbyState}/>}
		</div>
	);
};

export default Game;