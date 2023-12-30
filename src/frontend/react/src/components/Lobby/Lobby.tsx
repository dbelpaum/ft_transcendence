import React, { useContext } from "react";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import "./Lobby.css";
import { showNotificationSuccess } from "../../pages/Game/Notification";
import { PulseLoader } from "react-spinners";

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
		<div className="buttonContainer lobby">
			<div className="video-background">
				<video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
					{/* Utilisez un lien ou un fichier local */}
					<source src={'./pong_example.mp4'} type="video/mp4" />
				</video>
        	</div>
			<h1 className="roomName">{lobbyData.name}'s room</h1>
			<div>
				<span className="roomCode">Room code:</span>{" "}
				<button onClick={copyToClipboard} className="copyButton">📋 {lobbyData.lobbyId}</button>{" "}
			</div>
			<div className="userContainer">
				<div className="userColumn">
					<img src={lobbyData.host.avatar} alt="avatar" className="lobbyAvatar" />
					<p className="pseudo">{lobbyData.host.pseudo}</p>{" "}
					{lobbyData.playersState[lobbyData.host.socketId] ? "✅" : "❌"}
				</div>
				<div className="userColumn">
					{lobbyData.guest && <><img src={lobbyData.guest.avatar} alt="avatar" className="lobbyAvatar" />
						<p className="pseudo">{lobbyData.guest.pseudo}</p>
						{lobbyData.playersState[lobbyData.guest.socketId] ? "✅" : "❌"}</>
					}
					{!lobbyData.guest && <PulseLoader size={10} color={"#ffffff"} />}
				</div>
			</div>
			<div className="buttonLobby">
				<button onClick={handleReadyToggle} className={isReady ? "unreadyButton" : "readyButton"}>
					{isReady ? "Unready" : "Ready"}
				</button>
				<button onClick={handleLeaveLobby} className="leaveLobbyButton">Leave Lobby</button>

			</div>
		</div>
	);
};

export default Lobby;
