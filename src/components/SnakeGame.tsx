import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';
import { ServerCrash, Cpu } from 'lucide-react';

const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: Direction.UP,
    score: 0,
    isGameOver: false,
    isPaused: false,
  });

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case Direction.UP: head.y -= 1; break;
        case Direction.DOWN: head.y += 1; break;
        case Direction.LEFT: head.x -= 1; break;
        case Direction.RIGHT: head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Self collision
      if (prev.snake.some(s => s.x === head.x && s.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      
      // Food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 1,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': 
          setGameState(prev => prev.direction !== Direction.DOWN ? { ...prev, direction: Direction.UP } : prev);
          break;
        case 'ArrowDown': 
          setGameState(prev => prev.direction !== Direction.UP ? { ...prev, direction: Direction.DOWN } : prev);
          break;
        case 'ArrowLeft': 
          setGameState(prev => prev.direction !== Direction.RIGHT ? { ...prev, direction: Direction.LEFT } : prev);
          break;
        case 'ArrowRight': 
          setGameState(prev => prev.direction !== Direction.LEFT ? { ...prev, direction: Direction.RIGHT } : prev);
          break;
        case ' ': // space to pause
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 80); // Faster, more intense
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deep black CRT background
    ctx.fillStyle = '#030005';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Stark Grid
    ctx.strokeStyle = '#00ffff';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
    ctx.setLineDash([]);

    // Magenta Brutalist Food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      gameState.food.x * CELL_SIZE + 1,
      gameState.food.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    );

    // Cyan Snake
    gameState.snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00ffff';
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

  }, [gameState]);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: { x: 5, y: 5 },
      direction: Direction.UP,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div id="snake-container" className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full font-mono border-b-2 border-magenta pb-2">
        <div className="flex items-center space-x-2 bg-magenta text-[var(--color-void)] px-2 py-1">
          <ServerCrash size={16} />
          <span className="text-xl">SECTOR_V:{gameState.score.toString(16).toUpperCase()}</span>
        </div>
        <div className="text-cyan text-sm uppercase tracking-widest bg-[var(--color-void)] border border-cyan px-2 py-1 animate-pulse">
          {gameState.isPaused ? 'HALTED' : 'EXECUTING'}
        </div>
      </div>

      <div className="relative group brutal-border">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
        />
        
        {gameState.isGameOver && (
          <div 
            className="absolute inset-0 bg-[var(--color-magenta)]/20 flex flex-col items-center justify-center z-30 filter contrast-150 backdrop-saturate-200"
          >
            <div className="bg-[var(--color-void)] border-4 border-cyan p-6 shadow-[8px_8px_0_#00ffff] text-center">
              <h3 className="text-5xl font-mono text-cyan mb-2 glitch" data-text="SEGFAULT">SEGFAULT</h3>
              <p className="text-magenta mb-8 font-mono tracking-widest text-lg uppercase bg-[var(--color-cyan)]/10 py-1">DUMP: {gameState.score}</p>
              <button 
                onClick={resetGame}
                className="flex items-center space-x-3 px-6 py-2 bg-cyan text-[var(--color-void)] font-bold uppercase tracking-wider hover:bg-magenta hover:text-cyan border-2 border-[var(--color-void)] transition-colors mx-auto"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
              >
                <Cpu size={20} className="animate-spin" />
                <span>[ INIT_REBOOT ]</span>
              </button>
            </div>
          </div>
        )}

        {gameState.isPaused && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-void)]/80 backdrop-grayscale">
            <span className="text-4xl font-mono text-cyan uppercase tracking-[1em] glitch" data-text="INTERRUPT">INTERRUPT</span>
          </div>
        )}
      </div>

      <div className="text-sm text-magenta font-mono flex items-center space-x-8 border-t-2 border-cyan pt-2 w-full justify-between tracking-wider">
        <span className="bg-cyan text-[var(--color-void)] px-2 font-bold">[INPUT: ARROWS]</span>
        <span className="bg-cyan text-[var(--color-void)] px-2 font-bold">[OP: SPACE]</span>
      </div>
    </div>
  );
}
