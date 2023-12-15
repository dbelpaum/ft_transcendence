import * as THREE from 'three';

export class SoloGameLogic {
	protected scene: THREE.Scene;
	protected camera: THREE.PerspectiveCamera;
	protected camera3D: THREE.PerspectiveCamera;
	protected renderer: THREE.WebGLRenderer;
	protected paddleWidth: number = 80;
	protected paddleHeight: number = 10;
	protected paddleDepth: number = 15;
	protected paddleVelocity: number = 2;
	protected ballRadius: number = 5;
	protected gameTick: number = 0;
	protected ballSpeedModifier: number = 1;
	protected cameraInUse: { camera: THREE.PerspectiveCamera; id: number } = { camera: new THREE.PerspectiveCamera(), id: 0 };
	protected playerScore: number = 0;
	protected opponentScore: number = 0;
	protected mainLight: THREE.HemisphereLight;
	protected ground: THREE.Mesh;
	protected player: THREE.Mesh;
	protected opponent: THREE.Mesh;
	protected ball: THREE.Mesh;
	protected width: number;
	protected height: number;
	protected ballVelX: number;
	protected ballVelY: number;
	protected paddleLeftSpeed: number = 0;
	protected paddleRightSpeed: number = 0;

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

		const opponentPaddle = new THREE.BoxGeometry(this.paddleWidth, this.paddleHeight, this.paddleDepth);
		const opponentMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
		this.opponent = new THREE.Mesh(opponentPaddle, opponentMaterial);
		this.opponent.position.y = height / 2.7; // Place at the top
		this.opponent.position.x = 0;

		const sphereGeometry = new THREE.SphereGeometry(this.ballRadius, 32, 32);
		const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xc45c23 });
		this.ball = new THREE.Mesh(sphereGeometry, ballMaterial);
		this.ball.position.z = 0;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ballVelX = Math.sin(randomAngle);
		this.ballVelY = -Math.cos(randomAngle);

		this.scene.add(this.ground, this.player, this.opponent, this.ball);
	}

	protected handleKeyDown(event: KeyboardEvent) {
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

	protected handleKeyUp(event: KeyboardEvent) {
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

	protected switchCamera() {
		if (this.cameraInUse.id == 0) {
			this.cameraInUse.camera = this.camera3D;
			this.cameraInUse.id = 1;
		} else {
			this.cameraInUse.id = 0;
			this.cameraInUse.camera = this.camera;
		}
	}

	protected checkCollisions(paddle: THREE.Mesh): boolean {
		return (
			this.ball.position.x >= paddle.position.x - this.paddleWidth / 2 &&
			this.ball.position.x <= paddle.position.x + this.paddleWidth / 2 &&
			this.ball.position.y >= paddle.position.y - this.paddleHeight / 2 - this.ballRadius &&
			this.ball.position.y <= paddle.position.y + this.paddleHeight / 2 + this.ballRadius
		);
	}

	protected newRound() {
		this.ball.position.x = 0;
		this.ball.position.y = 0;
		this.player.position.x = 0;
		this.opponent.position.x = 0;
		this.gameTick = 0;
		this.ballSpeedModifier = 1;

		const randomAngle = (Math.PI / 3) * (Math.random() * 2 - 1);
		this.ballVelX = Math.sin(randomAngle);
		this.ballVelY = -Math.cos(randomAngle);
	}

	protected isValidMovement(posX: number, offset: number): boolean {
		return (
			posX + offset > -this.camera.position.z + this.paddleWidth / 2 &&
			posX + offset < this.camera.position.z - this.paddleWidth / 2
		);
	}

	protected opponentMovement() {
		if (this.opponent.position.x < this.ball.position.x - 10 && this.isValidMovement(this.opponent.position.x, this.paddleVelocity))
			this.opponent.position.x += this.paddleVelocity;
		else if (this.opponent.position.x > this.ball.position.x + 10 && this.isValidMovement(this.opponent.position.x, -this.paddleVelocity))
			this.opponent.position.x -= this.paddleVelocity;
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
		} else if (this.checkCollisions(this.opponent)) {
			const hitIndex = (this.ball.position.x - this.opponent.position.x) / (this.paddleWidth / 2);
			const maxReflectionAngle = Math.PI / 3;
			const reflectionAngle = hitIndex * maxReflectionAngle;
			this.ballVelX = Math.sin(reflectionAngle);
			this.ballVelY = -Math.cos(reflectionAngle);
			this.ballSpeedModifier = Math.exp(this.gameTick / 5000);
		}

		this.opponentMovement();

		if (this.isValidMovement(this.player.position.x, this.paddleRightSpeed - this.paddleLeftSpeed)) {
			this.player.position.x += this.paddleRightSpeed - this.paddleLeftSpeed;
		}

		this.camera3D.position.set(this.player.position.x, -300, 180);

		this.renderer.render(this.scene, this.cameraInUse.camera);
		this.gameTick++;
	}

	protected animate() {
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