import React, { useRef, useEffect } from 'react';
import { OnlineGameLogic } from './common/OnlineGameLogic'; // Update the import to point to the correct file

interface OnlineGameSceneProps {
  width: number;
  height: number;
}

const OnlineGameScene: React.FC<OnlineGameSceneProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLogicRef = useRef<OnlineGameLogic | null>(null);

  useEffect(() => {
    if (canvasRef.current && !gameLogicRef.current) {
      // Use OnlineGameLogic for online mode
      const onlineGame = new OnlineGameLogic(canvasRef.current, width, height);
      onlineGame.startGame();
      gameLogicRef.current = onlineGame;

      // Cleanup on component unmount
      return () => {
        if (gameLogicRef.current) {
          gameLogicRef.current.dispose();
        }
      };
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      tabIndex={0}
    />
  );
};

export default OnlineGameScene;
