import React, { useRef, useEffect } from 'react';
import { SoloGameLogic } from './common/SoloGameLogic';

interface SoloGameSceneProps {
  width: number;
  height: number;
}

const SoloGameScene: React.FC<SoloGameSceneProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLogicRef = useRef<SoloGameLogic | null>(null);

  useEffect(() => {
    if (canvasRef.current && !gameLogicRef.current) {
      // Use SoloGameLogic for solo mode
      const soloGame = new SoloGameLogic(canvasRef.current, width, height);
      soloGame.startGame();
      gameLogicRef.current = soloGame;

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

export default SoloGameScene;
