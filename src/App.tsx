import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import { GameHeader } from './components/GameHeader';
import { NumberBlock } from './components/NumberBlock';
import { ModeSelection } from './components/ModeSelection';
import { GameOver } from './components/GameOver';
import { GRID_COLS } from './constants';

export default function App() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const {
    grid,
    target,
    score,
    selectedIds,
    isGameOver,
    timeLeft,
    toggleSelect,
    initGame
  } = useGameLogic(mode);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
  };

  const handleRestart = () => {
    initGame();
  };

  const handleHome = () => {
    setMode(null);
  };

  if (!mode) {
    return <ModeSelection onSelect={handleModeSelect} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameHeader 
        target={target} 
        score={score} 
        timeLeft={timeLeft} 
        mode={mode} 
      />

      <div 
        className="grid gap-2 w-full max-w-md p-4 glass-panel bg-white/[0.02]"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          aspectRatio: '6/10'
        }}
      >
        {grid.map((row, rIndex) => (
          row.map((block, cIndex) => (
            <NumberBlock 
              key={block?.id || `empty-${rIndex}-${cIndex}`}
              block={block}
              isSelected={block ? selectedIds.includes(block.id) : false}
              onToggle={toggleSelect}
            />
          ))
        ))}
      </div>

      <div className="mt-8 text-slate-300 text-[10px] uppercase tracking-[0.4em] font-bold">
        选择方块进行求和，匹配目标数字
      </div>

      <AnimatePresence>
        {isGameOver && (
          <GameOver 
            score={score} 
            onRestart={handleRestart} 
            onHome={handleHome} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
