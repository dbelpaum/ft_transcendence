// src/components/GameScene/OnlineGameScene.tsx
import React, { useRef, useEffect } from 'react';
import { OnlineGameLogic } from './common/OnlineGameLogic';

interface OnlineGameSceneProps {
  // Add necessary props for online mode
}

const OnlineGameScene: React.FC<OnlineGameSceneProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Use OnlineGameLogic for online mode
      const onlineGame = new OnlineGameLogic(canvasRef.current, 800, 600); // Adjust width and height as needed
      onlineGame.setup();
      onlineGame.animate();

      // Cleanup on component unmount
      return () => onlineGame.dispose();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800} // Adjust width as needed
      height={600} // Adjust height as needed
      tabIndex={0}
    />
  );
};

export default OnlineGameScene;