import * as THREE from 'three';

export class SoloGameLogic {
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private camera3D: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private paddleWidth: number = 80;
	private paddleHeight: number = 10;
	private paddleDepth: number = 15;
	private paddleVelocity: number = 2;
	private ballRadius: number = 5;
	private gameTick: number = 0;
	private ballSpeedModifier: number = 1;
	private cameraInUse: { camera: THREE.PerspectiveCamera; id: number } = { camera: new THREE.PerspectiveCamera(), id: 0 };
	private playerScore: number = 0;
	private opponentScore: number = 0;
	private mainLight: THREE.HemisphereLight;
	private ground: THREE.Mesh;
	private player: THREE.Mesh;
	private ai: THREE.Mesh;
	private ball: THREE.Mesh;
	private width: number;
	private height: number;
	private ballVelX: number;
	private ballVelY: number;
	private paddleLeftSpeed: number = 0;
	private paddleRightSpeed: number = 0;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		this.camera.position.z = height / 2;
		this.camera.lookAt(this.scene.position);
		this.camera3D = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
		this.camera3D.position.set(0, -300, 180);
		this.camera3D.lookAt(this.scene.position);
		this.cameraInUse.camera = this.camera;
		this.cameraInUse.id = 0;
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		this.renderer.setClearColor(0x9999ee, 1);

		this.mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
		this.mainLight.position.set(0, 0, 250);
		this.scene.add(this.mainLight);

		const groundGeometry = new THREE.BoxGeometry(width / 1.21, height / 1.21, 1);
		const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x006000 });
		this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
		this.ground.position.set(0, 0, -25);

		const playerPaddle = new THREE.BoxGeometry(this.paddleWidth, this.paddleHeight, this.paddleDepth);
		const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x0000CC });
		this.player = new THREE.Mesh(playerPaddle, playerMaterial);
		this.player.position.y = -height / 2.7; // Place at the bottom
		this.player.position.x = 0;

		const aiPaddle = new THREE.BoxGeometry(this.paddleWidth, this.paddleHeight, this.paddleDepth);
		const aiMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
		this.ai = new THREE.Mesh(aiPaddle, aiMaterial);
		this.ai.position.y = height / 2.7; // Place at the top
		this.ai.position.x = 0;

		const sphereGeometry = new THREE.SphereGeometry(this.ballRadius, 32, 32);
		const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xc45c23 });
		this.ball = new THREE.Mesh(sphereGeometry, ballMaterial);
		this.ball.position.z = 0;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ballVelX = Math.sin(randomAngle);
		this.ballVelY = -Math.cos(randomAngle);

		this.scene.add(this.ground, this.player, this.ai, this.ball);
	}

	private handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
			case 'q':
				this.paddleLeftSpeed = this.paddleVelocity;
				break;
			case 'ArrowRight':
			case 'd':
				this.paddleRightSpeed = this.paddleVelocity;
				break;
			case 'r':
				this.switchCamera();
				break;
			default:
				break;
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
			case 'q':
				this.paddleLeftSpeed = 0;
				break;
			case 'ArrowRight':
			case 'd':
				this.paddleRightSpeed = 0;
				break;
			default:
				break;
		}
	}

	private switchCamera() {
		if (this.cameraInUse.id == 0) {
			this.cameraInUse.camera = this.camera3D;
			this.cameraInUse.id = 1;
		} else {
			this.cameraInUse.id = 0;
			this.cameraInUse.camera = this.camera;
		}
	}

	private checkCollisions(paddle: THREE.Mesh): boolean {
		return (
			this.ball.position.x >= paddle.position.x - this.paddleWidth / 2 &&
			this.ball.position.x <= paddle.position.x + this.paddleWidth / 2 &&
			this.ball.position.y >= paddle.position.y - this.paddleHeight / 2 - this.ballRadius &&
			this.ball.position.y <= paddle.position.y + this.paddleHeight / 2 + this.ballRadius
		);
	}

	private newRound() {
		this.ball.position.x = 0;
		this.ball.position.y = 0;
		this.player.position.x = 0;
		this.ai.position.x = 0;
		this.gameTick = 0;
		this.ballSpeedModifier = 1;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ballVelX = Math.sin(randomAngle);
		this.ballVelY = -Math.cos(randomAngle);
	}

	private isValidMovement(posX: number, offset: number): boolean {
		return (
			posX + offset > -this.camera.position.z + this.paddleWidth / 2 &&
			posX + offset < this.camera.position.z - this.paddleWidth / 2
		);
	}

	private AImovement() {
		if (this.ai.position.x < this.ball.position.x - 10 && this.isValidMovement(this.ai.position.x, this.paddleVelocity))
			this.ai.position.x += this.paddleVelocity;
		else if (this.ai.position.x > this.ball.position.x + 10 && this.isValidMovement(this.ai.position.x, -this.paddleVelocity))
			this.ai.position.x -= this.paddleVelocity;
	}

	public renderScene() {
		if (this.gameTick % 25 === 0) {
			const divInfo = document.getElementById('info');
			if (divInfo) {
				divInfo.innerHTML = 'camera	:' +
					'Position: (' + this.camera.position.x.toFixed(2) + ', ' + this.camera.position.y.toFixed(2) + ', ' + this.camera.position.z.toFixed(2) + ') | ' +
					'Rotation: (' + this.camera.rotation.x.toFixed(2) + ', ' + this.camera.rotation.y.toFixed(2) + ', ' + this.camera.rotation.z.toFixed(2) + ')' +
					'<br>camera3D	:' +
					'Position: (' + this.camera3D.position.x.toFixed(2) + ', ' + this.camera3D.position.y.toFixed(2) + ', ' + this.camera3D.position.z.toFixed(2) + ') | ' +
					'Rotation: (' + this.camera3D.rotation.x.toFixed(2) + ', ' + this.camera3D.rotation.y.toFixed(2) + ', ' + this.camera3D.rotation.z.toFixed(2) + ') ' +
					'<br>ball: ' +
					'Speed: ' + this.ballSpeedModifier.toFixed(2) + ' | ' +
					'Position: (' + this.ball.position.x.toFixed(2) + ', ' + this.ball.position.y.toFixed(2) + ', ' + this.ball.position.z.toFixed(2) + ') ';
			}
		}

		const divGameScore = document.getElementById('gameScore');
		if (divGameScore) {
			divGameScore.textContent = 'Player ' + this.playerScore + ' - ' + this.opponentScore + ' Opponent';
		}

		if (this.ball.position.x > 300 || this.ball.position.x < -300) {
			this.ballVelX = -this.ballVelX;
		}

		if (this.ball.position.y < -230 || this.ball.position.y > 230) {
			if (this.ball.position.y < -230) {
				this.opponentScore++;
			} else {
				this.playerScore++;
			}
			this.newRound();
		}

		this.ball.position.x += this.ballVelX * this.ballSpeedModifier;
		this.ball.position.y += this.ballVelY * this.ballSpeedModifier;

		this.ball.position.z = (185 + (-0.004 * (this.ball.position.y ** 2))) * this.cameraInUse.id;

		if (this.checkCollisions(this.player)) {
			const hitIndex = (this.ball.position.x - this.player.position.x) / (this.paddleWidth / 2);
			const maxReflectionAngle = Math.PI / 3;
			const reflectionAngle = hitIndex * maxReflectionAngle;
			this.ballVelX = Math.sin(reflectionAngle);
			this.ballVelY = Math.cos(reflectionAngle);
			this.ballSpeedModifier = Math.exp(this.gameTick / 5000);
		} else if (this.checkCollisions(this.ai)) {
			const hitIndex = (this.ball.position.x - this.ai.position.x) / (this.paddleWidth / 2);
			const maxReflectionAngle = Math.PI / 3;
			const reflectionAngle = hitIndex * maxReflectionAngle;
			this.ballVelX = Math.sin(reflectionAngle);
			this.ballVelY = -Math.cos(reflectionAngle);
			this.ballSpeedModifier = Math.exp(this.gameTick / 5000);
		}

		this.AImovement();

		if (this.isValidMovement(this.player.position.x, this.paddleRightSpeed - this.paddleLeftSpeed)) {
			this.player.position.x += this.paddleRightSpeed - this.paddleLeftSpeed;
		}

		this.camera3D.position.set(this.player.position.x, -300, 180);

		this.renderer.render(this.scene, this.cameraInUse.camera);
		this.gameTick++;
	}

	private animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderScene();
	}

	public startGame() {
		this.newRound();
		this.animate();
		
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	public dispose(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		// window.removeEventListener('resize', handleResize);
		this.renderer.dispose();
	}
}