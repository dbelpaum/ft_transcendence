import React, { useRef, useEffect, useContext } from "react";
import { OnlineGameLogic } from "./common/OnlineGameLogic"; // Update the import to point to the correct file
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";

interface OnlineGameSceneProps {
	width: number;
	height: number;
	isHost: boolean;
}

const OnlineGameScene: React.FC<OnlineGameSceneProps> = ({
	width,
	height,
	isHost,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameLogicRef = useRef<OnlineGameLogic | null>(null);
	const socket = useContext(SocketContext) as unknown as Socket;

	useEffect(() => {
		if (canvasRef.current && !gameLogicRef.current) {
			// Use OnlineGameLogic for online mode
			const onlineGame = new OnlineGameLogic(
				canvasRef.current,
				width,
				height,
				socket,
				isHost
			);
			onlineGame.startGame();
			gameLogicRef.current = onlineGame;

			// Cleanup on component unmount
			return () => {
				if (gameLogicRef.current) {
					gameLogicRef.current.dispose();
				}
			};
		}
	}, [width, height, socket, isHost]);

	return (
		<canvas ref={canvasRef} width={width} height={height} tabIndex={0} />
	);
};

export default OnlineGameScene;
