import { Socket } from "socket.io";
import { Lobby } from "../lobby/lobby";
import { ServerPayloads } from "../shared/server/ServerPayloads";
import { ServerEvents } from "../shared/server/ServerEvents";
import { Server } from "http";
import { ClientMovementDto } from "../dtos";
import { Ball, Paddle } from "./types";

const TICK_RATE = 1000 / 60; // 60 updates per second
const PADDLE_SPEED = 3.5;

export class Instance {
	public hasStarted: boolean = false;
	public hasFinished: boolean = false;
	public isSuspended: boolean = false;
	public scores: Record<Socket["id"], number> = {};

	private ball: Ball;
	private paddleHost: Paddle;
	private paddleGuest: Paddle;
	private gameTick = 0;
	private updateInterval: NodeJS.Timeout | null = null;
	constructor(private readonly lobby: Lobby) {
		this.ball = {
			radius: 5,
			speedModifier: 1,
			velocity: { x: 0, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
		};
		this.paddleGuest = {
			width: 80,
			height: 10,
			depth: 15,
			position: { x: 0, y: 0, z: 0 },
			movement: 0,
		};
		this.paddleHost = {
			width: 80,
			height: 10,
			depth: 15,
			position: { x: 0, y: 0, z: 0 },
			movement: 0,
		};
	}

	public triggerStart(): void {
		if (this.hasStarted) {
			return;
		}

		this.hasStarted = true;
		this.lobby.dispatchToLobby(ServerEvents.GameStart, {});
		this.newRound();
		this.startGameRuntime();
	}

	public clientMove(clientId: Socket['id'], data: ClientMovementDto) {
		if (clientId === this.lobby.hostSocketId) {
			this.paddleHost.movement = data.movingLeft ? -1 : (data.movingRight ? 1 : 0);
		}
		else {
			this.paddleGuest.movement = data.movingLeft ? -1 : (data.movingRight ? 1 : 0);
		}
	}

	private startGameRuntime(): void {
		if (this.updateInterval === null) {
			this.updateInterval = setInterval(() => {
				this.gameRuntime();
			}, TICK_RATE);
		}
	}

	private stopGameRuntime(): void {
		if (this.updateInterval !== null) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	private newRound(): void {
		this.ball.position = { x: 0, y: 0, z: 0 };
		this.ball.speedModifier = 1;
		this.paddleGuest.position.x = 0;
		this.paddleHost.position.x = 0;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ball.velocity.x = Math.sin(randomAngle);
		this.ball.velocity.y = -Math.cos(randomAngle);
	}

	private makePaddleMove(): void {
		if (this.paddleHost.position.x + this.paddleHost.movement * PADDLE_SPEED >= -300 + this.paddleHost.width / 2
			&& this.paddleHost.position.x + this.paddleHost.movement * PADDLE_SPEED <= 300 - this.paddleHost.width / 2)
			this.paddleHost.position.x -= -this.paddleHost.movement * PADDLE_SPEED;
		if (this.paddleGuest.position.x + this.paddleGuest.movement * PADDLE_SPEED <= 300 - this.paddleGuest.width / 2
			&& this.paddleGuest.position.x + this.paddleGuest.movement * PADDLE_SPEED >= -300 + this.paddleGuest.width / 2)
			this.paddleGuest.position.x += this.paddleGuest.movement * PADDLE_SPEED;
	}

	private checkCollisions(): void {
		if (this.ball.position.x >= this.paddleHost.position.x + this.paddleHost.width / 2
			&& this.ball.position.x <= this.paddleHost.position.x + this.paddleHost.width / 2
			&& this.ball.position.y >= this.paddleHost.position.y - this.paddleHost.height / 2 - this.ball.radius
			&& this.ball.position.y <= this.paddleHost.position.y + this.paddleHost.height / 2 + this.ball.radius) {
			this.ball.velocity.x = -this.ball.velocity.x;
			this.ball.velocity.y = -this.ball.velocity.y;
		}
		else if (this.ball.position.x >= this.paddleGuest.position.x - this.paddleGuest.width / 2
			&& this.ball.position.x <= this.paddleGuest.position.x + this.paddleGuest.width / 2
			&& this.ball.position.y >= this.paddleGuest.position.y - this.paddleGuest.height / 2 - this.ball.radius
			&& this.ball.position.y <= this.paddleGuest.position.y + this.paddleGuest.height / 2 + this.ball.radius) {
			this.ball.velocity.x = -this.ball.velocity.x;
			this.ball.velocity.y = -this.ball.velocity.y;
		}
		// else if (this.ball.position.x >= 100 - this.ball.radius) {
		// 	this.scores[this.lobby.hostSocketId]++;
		// 	this.newRound();
		// }
		// else if (this.ball.position.x <= -100 + this.ball.radius) {
		// 	this.scores[this.lobby.guestSocketId]++;
		// 	this.newRound();
		// }
		// else if (this.ball.position.y >= 100 - this.ball.radius) {
		// 	this.ball.velocity.y = -this.ball.velocity.y;
		// }
		// else if (this.ball.position.y <= -100 + this.ball.radius) {
		// 	this.ball.velocity.y = -this.ball.velocity.y;
		// }
	}

	private gameRuntime(): void {
		// Perform game logic here
		this.gameTick++;

		// Update ball position
		this.ball.position.x += this.ball.velocity.x * this.ball.speedModifier;
		this.ball.position.y += this.ball.velocity.y * this.ball.speedModifier;

		// Check for collisions


		// Make player move
		this.makePaddleMove();

		// Send updates to clients
		this.sendGameState();

		// Check for game end conditions and stop the game if necessary
		if (this.hasFinished) {
			this.stopGameRuntime();
		}
	}

	private sendGameState(): void {
		this.lobby.sendToUser(this.lobby.hostSocketId, ServerEvents.GameState, {
			ballPosition: {
				x: this.ball.position.x,
				y: this.ball.position.y,
				z: this.ball.position.z
			},
			ballSpeedModifier: this.ball.speedModifier,
			paddleOpponent: {
				x: this.paddleGuest.position.x,
				y: this.paddleGuest.position.y,
				z: this.paddleGuest.position.z
			},
			paddlePlayer: {
				x: this.paddleHost.position.x,
				y: this.paddleHost.position.y,
				z: this.paddleHost.position.z
			},
			scores: {
				[this.lobby.hostSocketId]: this.scores[this.lobby.hostSocketId],
				[this.lobby.guestSocketId]: this.scores[this.lobby.guestSocketId],
			}
		});
		this.lobby.sendToUser(this.lobby.guestSocketId, ServerEvents.GameState, {
			ballPosition: {
				x: - this.ball.position.x,
				y: - this.ball.position.y,
				z: this.ball.position.z
			},
			ballSpeedModifier: this.ball.speedModifier,
			paddleOpponent: {
				x: this.paddleHost.position.x,
				y: this.paddleHost.position.y,
				z: this.paddleHost.position.z
			},
			paddlePlayer: {
				x: this.paddleGuest.position.x,
				y: this.paddleGuest.position.y,
				z: this.paddleGuest.position.z
			},
			scores: {
				[this.lobby.hostSocketId]: this.scores[this.lobby.hostSocketId],
				[this.lobby.guestSocketId]: this.scores[this.lobby.guestSocketId],
			}
		});
	}
}
