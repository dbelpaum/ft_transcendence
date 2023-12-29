import React, { useContext, useState, useEffect } from "react";
import "./GameModeButtons.css";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import { showNotificationSuccess, showNotificationWarning } from "../../pages/Game/Notification";
import { PulseLoader } from "react-spinners";
import ScorePage from "../../pages/Game/Scores/ScorePage";
import { useLocation } from 'react-router-dom';

const GameModeButtons: React.FC = () => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const [roomCode, setRoomCode] = useState<string>("");
	const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);
	const [showScoreRanking, setShowScoreRanking] = useState<boolean>(false); // Ajout d'un état pour afficher ou masquer la superposition du classement

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const roomUrl = query.get('room');
	const createUrl = query.get('create');
	const idOther = query.get('id');
	const mp = query.get('mp');

	useEffect(() => {

		if (roomUrl && socket)
		{
			socket.emit("client.lobby.join", {
				mode: "vanilla",
				lobbyId: roomUrl,
			});
		}
	}, []);

	const handleRoomCodeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRoomCode(event.target.value);
	};

	const handleCreateRoom = () => {
		if (isMatchmaking) return;
		if (socket) {
			socket.emit("client.lobby.create", { mode: "vanilla" });
		}
	};

	const handleJoinRoom = () => {
		if (isMatchmaking) return;
		if (socket) {
			socket.emit("client.lobby.join", {
				mode: "vanilla",
				lobbyId: roomCode,
			});
		}
	};

	const handleMatchmaking = () => {
		if (socket) {

			// Emit matchmaking event
			if (!isMatchmaking)
				socket.emit("client.matchmaking.join", {});
			else
				socket.emit("client.matchmaking.leave", {});

			socket.once("server.matchmaking.status", (data: any) => {
				if (data.status === "joined") {
					setIsMatchmaking(true);
					showNotificationSuccess("Matchmaking", "Looking for opponent...");
				}
				else if (data.status === "left") {
					setIsMatchmaking(false);
					showNotificationWarning("Matchmaking", "Left matchmaking");
				}
			});
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleJoinRoom();
	};

	const toggleScoreRanking = () => {
		setShowScoreRanking(!showScoreRanking);
	};


	return (
		<div className="buttonContainer">
			<div className="buttonColumn">
				<div>
					<button className="buttonStyle" onClick={handleMatchmaking}>
						Matchmaking {isMatchmaking && <PulseLoader size={10} color={"#ffffff"} />}
					</button>
				</div>
				<div>
					<button
						className={`buttonStyle ${isMatchmaking ? "darkened" : ""}`}
						onClick={handleCreateRoom}
					>
						Create Room
					</button>
				</div>

				<div>
					<button
						className={`buttonStyle ${isMatchmaking ? "darkened" : ""}`}
						onClick={handleJoinRoom}
					>
						Join Room
					</button>
				</div>
				<input
					placeholder="Room Code"
					onKeyDown={handleKeyDown}
					className="inputBar"
					value={roomCode}
					onChange={handleRoomCodeChange}
				></input>
				{/* Bouton pour ouvrir/fermer la superposition du classement */}
				<button onClick={toggleScoreRanking}>Voir le classement</button>
				{/* Superposition modale du classement des scores */}
				<div
					className={`scoreRankingOverlay ${showScoreRanking ? "active" : ""
						}`}
				>
					<div
						className={`scoreRankingModal ${showScoreRanking ? "active" : ""
							}`}
					>
						<button onClick={toggleScoreRanking}>Fermer</button>
						{/* Affichage du classement des scores */}
						<ScorePage />
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameModeButtons;
