import React, { useContext, useState } from "react";
import "./GameModeButtons.css";
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import { showNotificationSuccess, showNotificationWarning } from "../../pages/Game/Notification";
import { PulseLoader } from "react-spinners";

const GameModeButtons: React.FC = () => {
	const socket = useContext(SocketContext) as unknown as Socket;
	const [roomCode, setRoomCode] = useState<string>("");
	const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);

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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleJoinRoom();
	};

	return (
		<div className="buttonContainer">
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
		</div>
	);
};

export default GameModeButtons;
