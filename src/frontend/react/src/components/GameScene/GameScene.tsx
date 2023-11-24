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
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });

      const paddleWidth = 80;
      const paddleHeight = 10;
      const ballRadius = 5;

      const playerPaddle = new THREE.BoxGeometry(paddleWidth, paddleHeight, 1);
      const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const player = new THREE.Mesh(playerPaddle, playerMaterial);
      player.position.y = -height / 2.7; // Place at the bottom
      player.position.x = 0;

      const aiPaddle = new THREE.BoxGeometry(paddleWidth, paddleHeight, 1);
      const aiMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const ai = new THREE.Mesh(aiPaddle, aiMaterial);
      ai.position.y = height / 2.7; // Place at the top
      ai.position.x = 0;

      const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	  let ballVelX: number = Math.random() * (0.6 - -0.6) + -0.6;
	  let ballVelY: number = -0.5;
      ball.position.x = 0;
      ball.position.y = 0;

      scene.add(player, ai, ball);

      // Adjust camera position
      camera.position.z = height / 2;


	  const checkCollisions = (ball: THREE.Mesh, paddle: THREE.Mesh, paddleHeight: number, paddleWidth: number, ballRadius:number): boolean => {
		return (
			ball.position.x >= paddle.position.x - paddleWidth / 2 &&
			ball.position.x <= paddle.position.x + paddleWidth / 2 &&
			ball.position.y  >= paddle.position.y - paddleHeight / 2 - ballRadius &&
			ball.position.y  <= paddle.position.y + paddleHeight / 2 + ballRadius
		)
	  };
      // Function for rendering the scene
	  const renderScene = () => {
        // Move the ball
		if (ball.position.x > 300 || ball.position.x < -300)	// Rebonds murs
			ballVelX = -ballVelX;

		if (ball.position.y < -230 || ball.position.y > 230) // Fin du match
		{
			ball.position.x  = 0;
			ball.position.y = 0;
			player.position.x = 0;
			ai.position.x = 0;
			ballVelX = Math.random() * (0.6 - -0.6) + -0.6;
			ballVelY = -0.5
		}
		
		if (checkCollisions(ball,player,paddleHeight,paddleWidth, ballRadius))	// Check joueur
		{
			// const hitIndex = ball.position.x - player.position.x; // -40 --> 40
			// console.log(hitIndex);
			ballVelY = - ballVelY;
		}
		else if (checkCollisions(ball,ai,paddleHeight,paddleWidth, ballRadius))	//	Check AI
		{
			ballVelY = - ballVelY;
		}

		if (ai.position.x < ball.position.x - 10 && ai.position.x + 5 < camera.position.z - paddleWidth / 2)	// Logique AI
			ai.position.x += 5
		else if (ai.position.x > ball.position.x + 10 && ai.position.x - 5 > -camera.position.z + paddleWidth / 2)
			ai.position.x -= 5
		
		

		ball.position.x += ballVelX;	// La balle se déplace
		ball.position.y += ballVelY;

        renderer.render(scene, camera);
      };

      // Use requestAnimationFrame for smooth rendering
      const animate = () => {
        requestAnimationFrame(animate);
        renderScene();
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // Update camera aspect ratio and renderer size
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);

        // Render the scene after resize
        renderScene();
      };

      // Add player paddle movement with arrow keys
      const handleKeyDown = (event: KeyboardEvent) => {
        const speed = 5; // Adjust the speed as needed
        switch (event.key) {
          case 'ArrowLeft':
          case 'a':
		  case 'q':
            if (player.position.x - speed > -camera.position.z + paddleWidth / 2) {	// /!\ Potentiellement changer le camera.position.z pour du responsive
              player.position.x -= speed;
            }
            break;
          case 'ArrowRight':
          case 'd':
            if (player.position.x + speed < camera.position.z - paddleWidth / 2) {	// /!\ Potentiellement changer le camera.position.z pour du responsive
              player.position.x += speed;
            }
            break;
          default:
            break;
        }

        // Render the scene after the paddle is moved
        renderScene();
      };

      // Add event listener for arrow keys
      window.addEventListener('keydown', handleKeyDown);

      // Attach event listener for window resize
      window.addEventListener('resize', handleResize);

      // Dispose of resources when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
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
