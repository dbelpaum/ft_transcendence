// src/components/GameScene/GameScene.tsx
import { exit } from 'process';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface GameSceneProps {
  width: number;
  height: number;
  initialGameMode: string;
}

const GameScene: React.FC<GameSceneProps> = ({ width, height, initialGameMode }) => {
  const divInfo = document.getElementById('info');
  const divGameScore = document.getElementById('gameScore');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameMode, setGameMode] = React.useState(initialGameMode);
  useEffect(() => {
    setGameMode(initialGameMode);
  }, [initialGameMode]);

  useEffect(() => {
    if (canvasRef.current && gameMode === 'ai') {
      // Set up Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	  camera.position.z = height / 2;
	  camera.lookAt(scene.position);
	  const camera3D = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
	  camera3D.position.set(0, -300, 180);
	  camera3D.lookAt(scene.position);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
	  renderer.setClearColor(0x9999ee, 1);

      const paddleWidth = 80;
      const paddleHeight = 10;
	  const paddleDepth = 15;
	  const paddleVelocity = 2; // Vitesse de déplacement
      const ballRadius = 5;
	  let gameTick: number = 0;
	  let ballSpeedModifier: number = 1;
	  let cameraInUse: { camera: THREE.PerspectiveCamera; id: number } = { camera: camera, id: 0 };
	  let playerScore: number = 0;
	  let opponentScore: number = 0;

	  const mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
	  scene.add(mainLight);

	  const groundGeometry = new THREE.BoxGeometry(width/1.21, height/1.21, 1);
	  const groundMaterial =  new THREE.MeshBasicMaterial({ color: 0x006000 });
	  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	  ground.position.set(0, 0, -25);

      const playerPaddle = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
      const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x0000CC });
      const player = new THREE.Mesh(playerPaddle, playerMaterial);
      player.position.y = -height / 2.7; // Place at the bottom
      player.position.x = 0;

      const aiPaddle = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
      const aiMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
      const ai = new THREE.Mesh(aiPaddle, aiMaterial);
      ai.position.y = height / 2.7; // Place at the top
      ai.position.x = 0;

      const SphereGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // THREE.MeshLambertMaterial({ color: 0xCC0000 });
      const ball = new THREE.Mesh(SphereGeometry, ballMaterial);
	  ball.position.z = 0;
	  let ballVelX: number;
	  let ballVelY: number;
	  let paddleLeftSpeed: number = 0;
	  let paddleRightSpeed: number = 0;

      scene.add(player, ai, ball, ground);

	  const switchCamera = function() {
		if (cameraInUse.id == 0)
		{
			cameraInUse.camera = camera3D;
			cameraInUse.id = 1;
		}
		else
		{
			cameraInUse.id = 0;
			cameraInUse.camera = camera;
		}
	  }


	  const checkCollisions = (paddle: THREE.Mesh): boolean => {
		return (
			ball.position.x >= paddle.position.x - paddleWidth / 2 &&
			ball.position.x <= paddle.position.x + paddleWidth / 2 &&
			ball.position.y  >= paddle.position.y - paddleHeight / 2 - ballRadius &&
			ball.position.y  <= paddle.position.y + paddleHeight / 2 + ballRadius
		)
	  };

	  const newRound = function() {
		ball.position.x = 0;
		ball.position.y = 0;
		player.position.x = 0;
		ai.position.x = 0;
		gameTick = 0;
		ballSpeedModifier = 1;

		const randomAngle = Math.PI / 3 * (Math.random() * 2 - 1);
		ballVelX = Math.sin(randomAngle);
		ballVelY = -Math.cos(randomAngle);
	  }

	  const isValidMovement = (posX: number, offset: number): boolean => {
		return (
			posX + offset > -camera.position.z + paddleWidth / 2 &&
			posX + offset < camera.position.z - paddleWidth / 2
		)
	  };

	  const AImovement = function() {
		if (ai.position.x < ball.position.x - 10 && isValidMovement(ai.position.x, paddleVelocity))
			ai.position.x += paddleVelocity;
		else if (ai.position.x > ball.position.x + 10 && isValidMovement(ai.position.x, -paddleVelocity))
			ai.position.x -= paddleVelocity;
	  }

      // Function for rendering the scene
	  const renderScene = () => {
		if (gameTick % 10 == 0 && divInfo) {
			divInfo.innerHTML = 'camera	:' +
									'Position: (' + camera.position.x.toFixed(2) + ', ' + camera.position.y.toFixed(2) + ', ' + camera.position.z.toFixed(2) + ') | ' +
									'Rotation: (' + camera.rotation.x.toFixed(2) + ', ' + camera.rotation.y.toFixed(2) + ', ' + camera.rotation.z.toFixed(2) + ')' +
									'<br>camera3D	:' +
									'Position: (' + camera3D.position.x.toFixed(2) + ', ' + camera3D.position.y.toFixed(2) + ', ' + camera3D.position.z.toFixed(2) + ') | ' +
									'Rotation: (' + camera3D.rotation.x.toFixed(2) + ', ' + camera3D.rotation.y.toFixed(2) + ', ' + camera3D.rotation.z.toFixed(2) + ') ' +
									'<br>ball: ' + 
									'Speed: ' + ballSpeedModifier.toFixed(2) + ' | ' +
									'Position: (' + ball.position.x.toFixed(2) + ', ' + ball.position.y.toFixed(2) + ', ' + ball.position.z.toFixed(2) + ') ';
		}
		if (divGameScore) {
			divGameScore.textContent = 'Player ' + playerScore + ' - ' + opponentScore + ' Opponent';
		}

		


		if (ball.position.x > 300 || ball.position.x < -300)	// Rebonds murs
			ballVelX = -ballVelX;

		if (ball.position.y < -230 || ball.position.y > 230) // Fin du match
		{
			if (ball.position.y < -230) {
				opponentScore++;
			} else {
				playerScore++;
			}
			newRound();
		}
		
		
		ball.position.x += ballVelX * ballSpeedModifier;	// La balle se déplace
		ball.position.y += ballVelY * ballSpeedModifier;

		// Trajectoire 3D de la balle, = 0 si en caméra 2D
		ball.position.z = (185 + (-0.004 * (ball.position.y ** 2))) * cameraInUse.id;


		if (checkCollisions(player))	// Check joueur touche balle
		{
			const hitIndex = (ball.position.x - player.position.x) / (paddleWidth / 2); // -1 < hitIndex < 1
			const maxReflectionAngle = Math.PI / 3; // Maximum reflection angle in radians
			// Calculate the reflection angle based on hitIndex
			const reflectionAngle = hitIndex * maxReflectionAngle;
			// Adjust ball's velocity based on the reflection angle
			ballVelX = Math.sin(reflectionAngle);
			ballVelY = Math.cos(reflectionAngle);
			ballSpeedModifier = Math.exp(gameTick / 5000);
		}
		else if (checkCollisions(ai))	//	Check AI touche balle
		{
			const hitIndex = (ball.position.x - ai.position.x) / (paddleWidth / 2); // -1 < hitIndex < 1
			const maxReflectionAngle = Math.PI / 3; // Maximum reflection angle in radians
			// Calculate the reflection angle based on hitIndex
			const reflectionAngle = hitIndex * maxReflectionAngle;
			// Adjust ball's velocity based on the reflection angle
			ballVelX = Math.sin(reflectionAngle);
			ballVelY = -Math.cos(reflectionAngle);
			ballSpeedModifier = Math.exp(gameTick / 5000);
		}

		AImovement();

		if (isValidMovement(player.position.x, paddleRightSpeed - paddleLeftSpeed))
			player.position.x += paddleRightSpeed - paddleLeftSpeed;

		// Camera 3D Qui suit le joueur
		camera3D.position.set(player.position.x, -300, 180);

        renderer.render(scene, cameraInUse.camera);
		gameTick++;
      };

      // Use requestAnimationFrame for smooth rendering
      const animate = () => {
        requestAnimationFrame(animate);
        renderScene();
      };

	  newRound();
      animate();

      // Handle window resize
    //   const handleResize = () => {
    //     const newWidth = window.innerWidth;
    //     const newHeight = window.innerHeight;

    //     // Update camera aspect ratio and renderer size
    //     camera.aspect = newWidth / newHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(newWidth, newHeight);

    //     // Render the scene after resize
    //     renderScene();
    //   };

      // Add player paddle movement with arrow keys

      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
          case 'a':
		  case 'q':
            paddleLeftSpeed = paddleVelocity;
            break;
          case 'ArrowRight':
          case 'd':
			paddleRightSpeed = paddleVelocity;
            break;
		  case 'r':
			switchCamera();
			break;
          default:
            break;
        }
      };

	  const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
          case 'a':
		  case 'q':
			paddleLeftSpeed = 0;
            break;
          case 'ArrowRight':
          case 'd':
			paddleRightSpeed = 0;
            break;
          default:
            break;
        }
      };


      // Add event listener for arrow keys
      window.addEventListener('keydown', handleKeyDown);
	  window.addEventListener('keyup', handleKeyUp);

      // Attach event listener for window resize
    //   window.addEventListener('resize', handleResize);

      // Dispose of resources when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
        // window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }
  }, [width, height, gameMode]);

  if (gameMode === 'online')
    return (
		<h1> Patience chacal </h1>
	); // Don't render anything if the game mode is not "ai"
  if (gameMode !== 'ai') {
    return null; // Don't render anything if the game mode is not "ai"
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      tabIndex={0} // Ensure the canvas can receive keyboard events
    >
      {/* Your JSX/HTML here */}
    </canvas>
  );
};

export default GameScene;
