import * as THREE from "three";
import { Socket } from "socket.io-client";

export class OnlineGameLogic {
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private camera3D: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private paddleWidth = 80;
	private paddleHeight = 10;
	private paddleDepth = 15;
	private paddleVelocity = 2;
	private ballRadius = 5;
	private gameTick = 0;
	private ballSpeedModifier = 1;
	private cameraInUse = {
		camera: new THREE.PerspectiveCamera(),
		id: 0,
	};
	private playerScore = 0;
	private opponentScore = 0;
	private mainLight: THREE.HemisphereLight;
	private ground: THREE.Mesh;
	private player: THREE.Mesh;
	private opponent: THREE.Mesh;
	private ball: THREE.Mesh;
	private width: number;
	private height: number;
	private ballVelX = 0;
	private ballVelY = 0;
	private paddleLeftSpeed = 0;
	private paddleRightSpeed = 0;
	private socket: Socket;
	private isHost = false;

	constructor(
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		socket: Socket,
		isHost: boolean
	) {
		this.isHost = isHost;
		this.socket = socket;
		this.width = width;
		this.height = height;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000
		);
		this.camera.position.z = height / 2;
		this.camera.lookAt(this.scene.position);
		this.camera3D = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
		this.camera3D.position.set(0, -300, 180);
		this.camera3D.lookAt(this.scene.position);
		this.cameraInUse.camera = this.camera;
		this.cameraInUse.id = 0;
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		this.renderer.setClearColor(0x9999ee, 1);

		this.mainLight = new THREE.HemisphereLight(0xffffff, 0x003300);
		this.mainLight.position.set(0, 0, 250);
		this.scene.add(this.mainLight);

		const groundGeometry = new THREE.BoxGeometry(
			width / 1.21,
			height / 1.21,
			1
		);
		const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x006000 });
		this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
		this.ground.position.set(0, 0, -25);

		const playerPaddle = new THREE.BoxGeometry(
			this.paddleWidth,
			this.paddleHeight,
			this.paddleDepth
		);
		const playerMaterial = new THREE.MeshLambertMaterial({
			color: 0x0000cc,
		});
		this.player = new THREE.Mesh(playerPaddle, playerMaterial);
		this.player.position.y = -height / 2.7; // Place at the bottom
		this.player.position.x = 0;

		const opponentPaddle = new THREE.BoxGeometry(
			this.paddleWidth,
			this.paddleHeight,
			this.paddleDepth
		);
		const opponentMaterial = new THREE.MeshLambertMaterial({
			color: 0xcc0000,
		});
		this.opponent = new THREE.Mesh(opponentPaddle, opponentMaterial);
		this.opponent.position.y = height / 2.7; // Place at the top
		this.opponent.position.x = 0;

		const sphereGeometry = new THREE.SphereGeometry(
			this.ballRadius,
			32,
			32
		);
		const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
		this.ball = new THREE.Mesh(sphereGeometry, ballMaterial);
		this.ball.position.z = 0;

		this.scene.add(this.ground, this.player, this.opponent, this.ball);
	}

	private handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case "ArrowLeft":
			case "a":
			case "q":
				if (this.paddleLeftSpeed === this.paddleVelocity)
					break;
				this.paddleLeftSpeed = this.paddleVelocity;
				this.socket.emit("client.game.move", { movingLeft: true, movingRight: false });
				break;
			case "ArrowRight":
			case "d":
				if (this.paddleRightSpeed === this.paddleVelocity)
					break;
				this.paddleRightSpeed = this.paddleVelocity;
				this.socket.emit("client.game.move", { movingLeft: false, movingRight: true });
				break;
			case "r":
				this.switchCamera();
				break;
			default:
				break;
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case "ArrowLeft":
			case "a":
			case "q":
				this.paddleLeftSpeed = 0;
				this.socket.emit("client.game.move", { movingLeft: false, movingRight: (this.paddleRightSpeed != 0) });
				break;
			case "ArrowRight":
			case "d":
				this.paddleRightSpeed = 0;
				this.socket.emit("client.game.move", { movingLeft: (this.paddleLeftSpeed != 0), movingRight: false });
				break;
			default:
				break;
		}
	}

	private switchCamera() {
		if (this.cameraInUse.id === 0) {
			this.cameraInUse.camera = this.camera3D;
			this.cameraInUse.id = 1;
		} else {
			this.cameraInUse.id = 0;
			this.cameraInUse.camera = this.camera;
		}
	}

	private isValidMovement(posX: number, offset: number): boolean {
		return (
			posX + offset > -this.camera.position.z + this.paddleWidth / 2 &&
			posX + offset < this.camera.position.z - this.paddleWidth / 2
		);
	}

	public renderScene() {
		const divGameScore = document.getElementById("gameScore");
		if (divGameScore) {
			divGameScore.textContent =
				"Player " +
				this.playerScore +
				" - " +
				this.opponentScore +
				" Opponent";
		}

		this.ball.position.x += this.ballVelX * this.ballSpeedModifier;
		this.ball.position.y += this.ballVelY * this.ballSpeedModifier;

		this.ball.position.z =
			(185 + -0.004 * this.ball.position.y ** 2) * this.cameraInUse.id;


		if (
			this.isValidMovement(
				this.player.position.x,
				this.paddleRightSpeed - this.paddleLeftSpeed
			)
		) {
			this.player.position.x +=
				this.paddleRightSpeed - this.paddleLeftSpeed;
		}

		this.camera3D.position.set(this.player.position.x, -300, 180);

		this.sendGameState();

		this.renderer.render(this.scene, this.cameraInUse.camera);
		this.gameTick++;
	}

	private sendGameState() { }

	private receiveGameState(data: any) {
		this.ball.position.x = data.ballPosition.x;
		this.ball.position.y = data.ballPosition.y;
		this.ball.position.z = data.ballPosition.z;
		this.ballSpeedModifier = data.ballSpeedModifier;
		this.player.position.x = data.paddlePlayer.x;
		this.opponent.position.x = data.paddleOpponent.x;
		// scores: Record<Socket["id"], number>
		const scores = data.scores as Record<Socket["id"], number>;
		for (let key in scores) {
			if (key === this.socket.id) {
				this.playerScore = scores[key];
			} else {
				this.opponentScore = scores[key];
			}
		}
	}

	private animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderScene();
	}

	public startGame() {
		this.socket.on("server.game.state", (data: any) => {
			this.receiveGameState(data);
		});

		this.animate();

		// Add event listeners for keydown and keyup
		window.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
	}

	public dispose(): void {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
		// window.removeEventListener('resize', handleResize);
		this.renderer.dispose();
	}
}
