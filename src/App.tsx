import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Undo2 } from 'lucide-react';
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
    gameOverReason,
    timeLeft,
    canUndo,
    toggleSelect,
    undo,
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
    <div className="min-h-screen flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[280px] flex flex-col items-center">
        <GameHeader 
          target={target} 
          score={score} 
          timeLeft={timeLeft} 
          mode={mode} 
        />

        <div className="mb-3 flex items-center justify-end w-full gap-3 px-1">
          <button
            onClick={undo}
            disabled={!canUndo || isGameOver}
            className={`
              flex items-center gap-1 transition-all
              ${canUndo && !isGameOver ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 cursor-not-allowed opacity-50'}
            `}
          >
            <Undo2 className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">撤销</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">重置</span>
          </button>
        </div>

        <div 
          className="grid gap-1 w-full p-2 glass-panel bg-white/[0.02]"
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

        <div className="mt-6 text-slate-300 text-[9px] uppercase tracking-[0.4em] font-bold">
          选择方块进行求和，匹配目标数字
        </div>
      </div>

      <AnimatePresence>
        {isGameOver && (
          <GameOver 
            score={score} 
            reason={gameOverReason}
            onRestart={handleRestart} 
            onHome={handleHome} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
