import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import ClipboardJS from "clipboard";
import { showNotificationSuccess } from "../../pages/Game/Notification";

interface LobbyProps {
	lobbyData: {
		lobbyId: string;
		hasStarted: boolean;
		hasFinished: boolean;
		isSuspended: boolean;
		playersCount: number;
		scores: Record<string, number>;
		playersState: Record<string, boolean>;
		host: { socketId: string, pseudo: string, avatar: string },
		guest: { socketId: string, pseudo: string, avatar: string },
		name: string;
	};
	isReady: boolean;
	onLeaveLobby: () => void;
	handleReadyToggle: () => void;
}

const Lobby: React.FC<LobbyProps> = ({
	lobbyData,
	onLeaveLobby,
	handleReadyToggle,
	isReady,
}) => {
	const socket = useContext(SocketContext) as unknown as Socket;

	const copyToClipboard = () => {
		const roomCodeElement = document.createElement("input");
		roomCodeElement.value = lobbyData.lobbyId;
		document.body.appendChild(roomCodeElement);
		roomCodeElement.select();
		document.execCommand("copy");
		document.body.removeChild(roomCodeElement);

		showNotificationSuccess("Code copied to clipboard", "");
	};

	const handleLeaveLobby = () => {
		if (socket) {
			socket.emit("client.lobby.leave");
		}
		onLeaveLobby();
	};

	return (
		<div>
			<h2>{lobbyData.name}'s lobby</h2>
			<p>
				Room code: {lobbyData.lobbyId}{" "}
				<button onClick={copyToClipboard}>Copy</button>{" "}
			</p>
			<p>{lobbyData.playersCount}/2</p>
			<p>
				Host: {lobbyData.host.pseudo}{" "}
				{lobbyData.playersState[lobbyData.host.socketId] ? "✅" : "❌"}
			</p>
			<p>
				Guest:{" "}
				{lobbyData.guest
					? `${lobbyData.guest.pseudo} ${lobbyData.playersState[lobbyData.guest.socketId]
						? "✅"
						: "❌"
					}`
					: "Waiting for Opponent"}
			</p>
			{/* <h3>Scores:</h3> */}
			<button onClick={handleReadyToggle}>
				{isReady ? "Unready" : "Ready"}
			</button>
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
