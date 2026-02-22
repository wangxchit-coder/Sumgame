import React from 'react';
import { motion } from 'motion/react';
import { Target, Trophy, Clock } from 'lucide-react';
import { GameMode } from '../types';

interface GameHeaderProps {
  target: number;
  score: number;
  timeLeft?: number;
  mode: GameMode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ target, score, timeLeft, mode }) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="font-mono text-lg font-bold text-slate-700">{score.toLocaleString()}</span>
        </div>
        
        {mode === GameMode.TIME && (
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft && timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft && timeLeft <= 3 ? 'text-red-500' : 'text-slate-700'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      <div className="glass-panel p-3 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          {mode === GameMode.TIME && timeLeft !== undefined && (
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 10) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-0.5">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">目标和</span>
        </div>
        <motion.div 
          key={target}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold font-mono tracking-tighter text-slate-900"
        >
          {target}
        </motion.div>
      </div>
    </div>
  );
};
