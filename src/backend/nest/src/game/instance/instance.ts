import { Socket } from "socket.io";
import { Lobby } from "../lobby/lobby";
import { ServerPayloads } from "../shared/server/ServerPayloads";
import { ServerEvents } from "../shared/server/ServerEvents";
import { Server } from "http";
import { ClientMovementDto } from "../dtos";
import { Ball, Paddle } from "./types";
import { enregistrerScores } from "../score/score.controller";
const TICK_RATE = 1000 / 60; // 60 updates per second
const PADDLE_SPEED = 3.75;
const BALL_SPEED_INCREMENT = 0.0003;
const BALL_DEFAULT_SPEED = 2;
const WIDTH = 600;
const HEIGHT = 800;

export class Instance {
	public hasStarted: boolean = false;
	public hasFinished: boolean = false;
	public isSuspended: boolean = false;
	public scores: Record<Socket["id"], number> = {};

	private ball: Ball;
	private paddleHost: Paddle;
	private paddleGuest: Paddle;
	private gameTick: number;
	private updateInterval: NodeJS.Timeout | null = null;
	constructor(private readonly lobby: Lobby) {
		this.ball = {
			radius: 5,
			speedModifier: BALL_DEFAULT_SPEED,
			velocity: { x: 0, y: 0, z: 0 },
			position: { x: 0, y: 0, z: 0 },
		};
		this.paddleGuest = {
			width: 80,
			height: 10,
			depth: 15,
			position: { x: 0, y: WIDTH / 2.7, z: 0 },
			movement: 0,
		};
		this.paddleHost = {
			width: 80,
			height: 10,
			depth: 15,
			position: { x: 0, y: -WIDTH / 2.7, z: 0 },
			movement: 0,
		};
	}

	public triggerStart(): void {
		if (this.hasStarted) {
			return;
		}

		this.hasStarted = true;
		this.scores[this.lobby.hostSocketId] = 0;
		this.scores[this.lobby.guestSocketId] = 0;
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
		this.gameTick = 0;
		this.ball.position = { x: 0, y: 0, z: 0 };
		this.ball.speedModifier = BALL_DEFAULT_SPEED;
		this.paddleGuest.position.x = 0;
		this.paddleHost.position.x = 0;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ball.velocity.x = Math.sin(randomAngle);
		this.ball.velocity.y = -Math.cos(randomAngle);
	}

	private makePaddleMove(): void {
		if (this.paddleHost.position.x + this.paddleHost.movement * PADDLE_SPEED >= - WIDTH / 2 + this.paddleHost.width / 2
			&& this.paddleHost.position.x + this.paddleHost.movement * PADDLE_SPEED <= WIDTH / 2 - this.paddleHost.width / 2)
			this.paddleHost.position.x -= -this.paddleHost.movement * PADDLE_SPEED;
		if (this.paddleGuest.position.x - this.paddleGuest.movement * PADDLE_SPEED >= - WIDTH / 2 + this.paddleGuest.width / 2
			&& this.paddleGuest.position.x - this.paddleGuest.movement * PADDLE_SPEED <= WIDTH / 2 - this.paddleGuest.width / 2)
			this.paddleGuest.position.x -= this.paddleGuest.movement * PADDLE_SPEED;
	}

	private checkGoal(): void {
		//Check si la balle est sortie du terrain
		if (this.ball.position.y > 270) {
			this.scores[this.lobby.hostSocketId]++;
			this.newRound();
		}
		else if (this.ball.position.y < -270) {
			this.scores[this.lobby.guestSocketId]++;
			this.newRound();
		}
	}

	private checkCollisions(): void {
		// Check collisions des joueurs avec la balle
		if (
			this.ball.position.x >= this.paddleHost.position.x - this.paddleHost.width / 2
			&& this.ball.position.x <= this.paddleHost.position.x + this.paddleHost.width / 2
			&& this.ball.position.y >= this.paddleHost.position.y - this.paddleHost.height / 2 - this.ball.radius
			&& this.ball.position.y <= this.paddleHost.position.y + this.paddleHost.height / 2 + this.ball.radius
		) {
			const hitIndex = (this.ball.position.x - this.paddleHost.position.x) / (this.paddleHost.width / 2);
			const maxReflectionAngle = Math.PI / 3;
			const reflectionAngle = hitIndex * maxReflectionAngle;
			this.ball.velocity.x = Math.sin(reflectionAngle);
			this.ball.velocity.y = Math.cos(reflectionAngle);
			this.ball.speedModifier = Math.exp(this.gameTick * BALL_SPEED_INCREMENT) * BALL_DEFAULT_SPEED;
		}
		else if (
			this.ball.position.x >= this.paddleGuest.position.x - this.paddleGuest.width / 2
			&& this.ball.position.x <= this.paddleGuest.position.x + this.paddleGuest.width / 2
			&& this.ball.position.y >= this.paddleGuest.position.y - this.paddleGuest.height / 2 - this.ball.radius
			&& this.ball.position.y <= this.paddleGuest.position.y + this.paddleGuest.height / 2 + this.ball.radius
		) {
			const hitIndex = (this.ball.position.x - this.paddleGuest.position.x) / (this.paddleGuest.width / 2);
			const maxReflectionAngle = Math.PI / 3;
			const reflectionAngle = hitIndex * maxReflectionAngle;
			this.ball.velocity.x = Math.sin(reflectionAngle);
			this.ball.velocity.y = - Math.cos(reflectionAngle);
			this.ball.speedModifier = Math.exp(this.gameTick * BALL_SPEED_INCREMENT) * BALL_DEFAULT_SPEED;
		}

		//Check collisions de la balle avec les murs
		if (Math.abs(this.ball.position.x) >= WIDTH / 2) {
			this.ball.velocity.x = -this.ball.velocity.x;
		}

		// console.log("Scores: " + this.scores[this.lobby.hostSocketId] + " h-g " + this.scores[this.lobby.guestSocketId])
		// console.log(this.ball.speedModifier);
	}

	private gameRuntime(): void {
		// Update ball position
		this.ball.position.x += this.ball.velocity.x * this.ball.speedModifier;
		this.ball.position.y += this.ball.velocity.y * this.ball.speedModifier;

		// Check for goals
		this.checkGoal();

		// Check for collisions
		this.checkCollisions();


		// Make player move
		if (this.paddleHost.movement != 0 || this.paddleGuest.movement != 0)
			this.makePaddleMove();

		// Send updates to clients
		this.sendGameState();

		// Check for game end conditions and stop the game if necessary
		if (this.scores[this.lobby.hostSocketId] >= 5 || this.scores[this.lobby.guestSocketId] >= 5) {
			this.hasFinished = true;
			this.stopGameRuntime();
			
			// lenny add
	
			enregistrerScores(this.lobby.hostSocketId, this.lobby.guestSocketId, this.scores[this.lobby.hostSocketId], this.scores[this.lobby.guestSocketId])
				.then((nouveauScore) => {

				console.log('New score added:', nouveauScore);
				})
				.catch((erreur) => {

					console.error('Error during adding score in db', erreur);
				})
			//
			return;
		}

		this.gameTick++;
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
				x: - this.paddleHost.position.x,
				y: this.paddleHost.position.y,
				z: this.paddleHost.position.z
			},
			paddlePlayer: {
				x: - this.paddleGuest.position.x,
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
