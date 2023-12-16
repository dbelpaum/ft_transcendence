import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../../pages/Game/SocketContext';
import { Socket } from 'socket.io-client';

interface LobbyProps {
	lobbyData: {
	  lobbyId: string;
	  hasStarted: boolean;
	  hasFinished: boolean;
	  isSuspended: boolean;
	  playersCount: number;
	  scores: Record<string, number>;
	};
	onLeaveLobby: () => void;
  }

const Lobby: React.FC<LobbyProps> = ({ lobbyData, onLeaveLobby }) => {
	const socket = useContext(SocketContext) as unknown as Socket;

	const handleLeaveLobby = () => {
		if (socket) {
			socket.emit('client.lobby.leave');
		}
		onLeaveLobby();
	};

	return (
		<div>
			<h2>Lobby Information</h2>
			<p>Room code: {lobbyData.lobbyId}</p>
			<p>Started: {lobbyData.hasStarted ? 'Yes' : 'No'}</p>
			<p>Finished: {lobbyData.hasFinished ? 'Yes' : 'No'}</p>
			<p>Suspended: {lobbyData.isSuspended ? 'Yes' : 'No'}</p>
			<p>Players Count: {lobbyData.playersCount}</p>
			<h3>Scores:</h3>
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
