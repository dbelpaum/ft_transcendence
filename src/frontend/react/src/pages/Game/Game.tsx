import React, { useEffect, useState } from "react";
import "./Game.css";
import OnlineGameScene from "../../components/GameScene/OnlineGameScene";
import GameModeButtons from "../../components/GameModeButtons/GameModeButtons";
import io from "socket.io-client";
import Lobby from "../../components/Lobby/Lobby";
import {
	showNotificationSuccess,
	showNotificationError,
} from "./Notification";
import SocketContext from "./SocketContext";
import { useAuth } from "../../context/AuthContexte";

const Game: React.FC = () => {

	const {
		authToken,
		socket,
		setSocket,
		user,
		inLobby,
		setInLobby,
		lobbyData,
		setLobbyData,
		gameStarted,
		setGameStarted,
		showScoreRanking,
		setShowScoreRanking,
		isReady,
		setIsReady,
	} = useAuth();

	const handleReadyToggle = () => {
		if (socket && !isReady) {
			socket.emit("client.lobby.ready", { isReady: !isReady });
		} else if (socket) {
			socket.emit("client.lobby.unready", { isReady: !isReady });
		}
		setIsReady(!isReady);
	};

	useEffect(() => {

		socket.on("exception", (data: any) => {
			showNotificationError("Error", data.message);
		});

		socket.on("server.game.message", (data: any) => {
			showNotificationSuccess("", data.message);
		});

		socket.on("server.game.error", (data: any) => {
			showNotificationError("Error", data.message);
		});

		socket.on("server.lobby.state", (data: any) => {
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
					<div className="game-container">
						<div className="gameScore1" id="gameScore1"></div>
						<OnlineGameScene
							width={800}
							height={600}
						/>
						<div className="gameScore2" id="gameScore2"></div>
					</div>
				)}
			</div>
		</SocketContext.Provider>
	);
};

export default Game;
