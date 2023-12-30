import React, { useRef, useEffect, useContext, useState } from "react";
import { OnlineGameLogic } from "./common/OnlineGameLogic"; // Update the import to point to the correct file
import { SocketContext } from "../../pages/Game/SocketContext";
import { Socket } from "socket.io-client";
import Switch from '@mui/material/Switch';

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
	const [onlineGame, setOnlineGame] = useState<OnlineGameLogic | null>(null);
	const [is3DCamera, setIs3DCamera] = useState(false);

	useEffect(() => {
		if (canvasRef.current && !gameLogicRef.current) {
			// Use OnlineGameLogic for online mode
			const onlineGameInstance = new OnlineGameLogic(
				canvasRef.current,
				width,
				height,
				socket,
				isHost
			);
			onlineGameInstance.startGame();
			gameLogicRef.current = onlineGameInstance;
			setOnlineGame(onlineGameInstance);

			// Cleanup on component unmount
			return () => {
				if (gameLogicRef.current) {
					gameLogicRef.current.dispose();
				}
			};
		}
	}, [width, height, isHost, socket]);

	const label = { inputProps: { 'aria-label': 'WWWWWWWW' } };
	const handleCameraSwitch = () => {
		setIs3DCamera((prev) => !prev); // Toggle the camera mode
		if (onlineGame) {
			onlineGame.switchCamera();
		}
		console.log(is3DCamera);
	};

	return (
		<div>
			<canvas ref={canvasRef} width={width} height={height} tabIndex={0} />
			<Switch {...label} checked={is3DCamera} onChange={handleCameraSwitch} />
		</div>
	);
};

export default OnlineGameScene;
