import React, { useEffect, useState } from "react";
import "./Game.css";
import SoloGameScene from "../../components/GameScene/SoloGameScene";
import OnlineGameScene from "../../components/GameScene/OnlineGameScene";
import GameModeButtons from "../../components/GameModeButtons/GameModeButtons";
import ScorePage from "./Scores/ScorePage";
import io from "socket.io-client";
import Lobby from "../../components/Lobby/Lobby";
import {
	showNotificationSuccess,
	showNotificationError,
	showNotificationWarning,
} from "./Notification";
import SocketContext from "./SocketContext";

const DebugPanel: React.FC<{ variables: Record<string, any> }> = ({
	variables,
}) => (
	<div
		style={{
			position: "fixed",
			top: 0,
			right: 0,
			background: "white",
			padding: "10px",
			border: "1px solid #ddd",
		}}
	>
		<h3>Debug Panel</h3>
		<pre>{JSON.stringify(variables, null, 2)}</pre>
	</div>
);

const Game: React.FC = () => {
	const [socket, setSocket] = useState<any>(null);
	const [inLobby, setInLobby] = useState<boolean>(false);
	const [lobbyData, setLobbyData] = useState<any>(null);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [showScoreRanking, setShowScoreRanking] = useState<boolean>(false); // Ajout d'un état pour afficher ou masquer la superposition du classement
	const [isReady, setIsReady] = useState<boolean>(false);

	const toggleScoreRanking = () => {
		setShowScoreRanking(!showScoreRanking);
	};

	const handleReadyToggle = () => {
		if (socket && !isReady) {
			socket.emit("client.lobby.ready", { isReady: !isReady });
		} else if (socket) {
			socket.emit("client.lobby.unready", { isReady: !isReady });
		}
		setIsReady(!isReady);
	};

	useEffect(() => {
		const socket = io("http://localhost:4000/game");
		socket.connect();
		setSocket(socket);

		socket.on("exception", (data: any) => {
			showNotificationError("Error", data.message);
		});

		socket.on("server.game.message", (data: any) => {
			showNotificationSuccess("", data.message);
		});

		socket.on("server.lobby.state", (data: any) => {
			console.log("Received Lobby State:", data);
			setInLobby(true);
			setLobbyData(data);
		});

		socket.on("server.matchmaking.found", (data: any) => {
			showNotificationSuccess("Matchmaking", "Found an opponent !");
			setInLobby(true);
			setGameStarted(true);
		});

		socket.on("server.game.start", (data: any) => {
			if (!gameStarted) setGameStarted(true);
		});

		return () => {
			// changer la dépendance gameStarted pour arreter de deco quand le jeu se lance
			if (socket) {
				socket.disconnect();
				setSocket(null); // Set socket to null after disconnecting
			}
		};
	}, []);

	const handleLeaveLobby = () => {
		setInLobby(false);
		setLobbyData(null);
		setIsReady(false);
	};

	return (
		<SocketContext.Provider value={socket}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
				}}
			>
				{/* <DebugPanel variables={{ gameStarted }} /> */}
				{/*Rendering du du Menu OU du Lobby OU de rien car on est in game*/}
				{!gameStarted && (
					<>
						{inLobby ? (
							<Lobby
								lobbyData={lobbyData}
								onLeaveLobby={handleLeaveLobby}
								handleReadyToggle={handleReadyToggle}
								isReady={isReady}
							/>
						) : (
							<>
								<GameModeButtons />
							</>
						)}
					</>
				)}
				{gameStarted && (
					<div>
						<div className="gameScore" id="gameScore"></div>
						<OnlineGameScene
							width={800}
							height={600}
							isHost={lobbyData.hostId === socket.id}
						/>
					</div>
				)}

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
		</SocketContext.Provider>
	);
};

export default Game;
