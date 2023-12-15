import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../../pages/Game/SocketContext';
import { Socket } from 'socket.io-client';

interface LobbyProps {
	lobbyData: {
		lobbyId: string;
		hostId: string;
		guestId: string;
		hasStarted: boolean;
		hasFinished: boolean;
		isSuspended: boolean;
		playersCount: number;
		scores: Record<string, number>;
		playersState: Record<string, boolean>;
	};
	isReady: boolean;
	onLeaveLobby: () => void;
	handleReadyToggle: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ lobbyData, onLeaveLobby, handleReadyToggle, isReady }) => {
	const socket = useContext(SocketContext) as unknown as Socket;

	const handleLeaveLobby = () => {
		if (socket) {
			socket.emit('client.lobby.leave');
		}
		onLeaveLobby();
	};

	return (
		<div>
			<h2>{lobbyData.hostId}'s lobby</h2>
			<p>Room code: {lobbyData.lobbyId}</p>
			<p>{lobbyData.playersCount}/2</p>
			<p>Host: {lobbyData.hostId} {lobbyData.playersState[lobbyData.hostId] ? '✅' : '❌'}</p>
			<p>Guest: {lobbyData.guestId ? `${lobbyData.guestId} ${lobbyData.playersState[lobbyData.guestId] ? '✅' : '❌'}` : 'Waiting for Opponent'}</p>
			{/* <h3>Scores:</h3> */}
			<button onClick={handleReadyToggle}>{isReady ? 'Unready' : 'Ready'}</button>
			<ul>
				{Object.entries(lobbyData.scores).map(([player, score]) => (
					<li key={player}>
						{player}: {score}
					</li>
				))}
			</ul>
			<button onClick={handleLeaveLobby}>Leave Lobby</button>
		</div>
	);
};

export default Lobby;
