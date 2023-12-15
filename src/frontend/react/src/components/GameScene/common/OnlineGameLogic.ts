import * as THREE from 'three';
import { SoloGameLogic } from './SoloGameLogic';
import { SocketContext } from "../../../pages/Game/SocketContext"
import { Socket } from 'socket.io-client';
import { useContext } from 'react';


export class OnlineGameLogic extends SoloGameLogic {
	private isHost: boolean = false;
	// private socket = useContext(SocketContext) as unknown as Socket;

	// Override opponent movement to handle websockets
	override opponentMovement() {
		// this.socket.on('server.game.state', (data: any) => {
		// 	this.opponent.position.x = 0;
		// 	this.opponent.position.y = 0;
		// });
	}

	// Add any additional methods or properties specific to online gameplay
}