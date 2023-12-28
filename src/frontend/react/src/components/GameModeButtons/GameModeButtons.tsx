import React, { useContext, useState, useEffect } from "react";
import "./GameModeButtons.css";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import SoloGameScene from "../GameScene/SoloGameScene";
import { showNotificationSuccess, showNotificationWarning } from "../../pages/Game/Notification";
import { PulseLoader } from "react-spinners";
import { useLocation } from 'react-router-dom';

const GameModeButtons: React.FC = () => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const [roomCode, setRoomCode] = useState<string>("");
	const [showSoloGame, setShowSoloGame] = React.useState<boolean>(false);
	const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const roomUrl = query.get('room');
	const createUrl = query.get('create');
	const idOther = query.get('id');
	const mp = query.get('mp');
	if (roomUrl && socket)
	{
		socket.emit("client.lobby.join", {
			mode: "vanilla",
			lobbyId: roomUrl,
		});
	}
	if (createUrl && idOther && mp && socket)
	{
		socket.emit("client.lobby.create", { mode: "vanilla" });
	}

	const handleSelectSoloMode = () => {
		setShowSoloGame(true);
	};

	const handleRoomCodeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRoomCode(event.target.value);
	};

	const handleCreateRoom = () => {
		if (socket) {
			socket.emit("client.lobby.create", { mode: "vanilla" });
		}
	};

	const handleJoinRoom = () => {
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

	const handlePing = () => {
		if (socket) {
			console.log("Sending client.ping...");
			socket.emit("client.ping", {});

			socket.once("server.pong", (data: any) => {
				showNotificationSuccess("Pong !", data.message);
			});
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleJoinRoom();
	};

	return (
		<div className="buttonContainer">
			{showSoloGame ? (
				<SoloGameScene width={800} height={600} />
			) : (
				<>
					<div>
						<button
							className="buttonStyle"
							onClick={handleSelectSoloMode}
						>
							Solo
						</button>
					</div>

					<div className="buttonColumn">
						<div>
							<button
								className="buttonStyle"
								onClick={handleCreateRoom}
							>
								Create Room
							</button>
						</div>

						<div>
							<button
								className="buttonStyle"
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
					</div>

					<div>
						<button className="buttonStyle" onClick={handleMatchmaking}>Matchmaking {isMatchmaking && <PulseLoader size={10} color={"#ffffff"} />}</button>
					</div>
					<button onClick={handlePing}>Ping</button>
				</>
			)}
		</div>
	);
};

export default GameModeButtons;
