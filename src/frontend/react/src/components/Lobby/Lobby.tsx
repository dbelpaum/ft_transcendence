import React, { useContext } from "react";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import "./Lobby.css";
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
		<div className="lobbyDiv">
			<h1 className="roomName">{lobbyData.name}'s room</h1>
			<p>
				<span className="roomCode">Room code:</span>{" "}
				<button onClick={copyToClipboard} className="copyButton">📋 {lobbyData.lobbyId}</button>{" "}
			</p>
			<div className="userContainer">
				<p className="userColumn">
					<img src={lobbyData.host.avatar} alt="avatar" className="lobbyAvatar" />
					<p className="pseudo">{lobbyData.host.pseudo}</p>{" "}
					{lobbyData.playersState[lobbyData.host.socketId] ? "✅" : "❌"}
				</p>
				<p className="userColumn">
					{lobbyData.guest && <><img src={lobbyData.guest.avatar} alt="avatar" className="lobbyAvatar" />
						<p className="pseudo">{lobbyData.guest.pseudo}</p>
						{lobbyData.playersState[lobbyData.guest.socketId] ? "✅" : "❌"}</>
					}
					{!lobbyData.guest && <p>Waiting for opponent</p>}
				</p>
			</div>
			<button onClick={handleReadyToggle} className={isReady ? "unreadyButton" : "readyButton"}>
				{isReady ? "Unready" : "Ready"}
			</button>
			<button onClick={handleLeaveLobby} className="leaveLobbyButton">Leave Lobby</button>
		</div>
	);
};

export default Lobby;
