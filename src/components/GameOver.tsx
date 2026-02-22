import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Skull } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onHome }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel p-10 max-w-sm w-full text-center border-red-100 shadow-2xl"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Skull className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-4xl font-bold mb-2 tracking-tight text-slate-900">游戏结束</h2>
        <p className="text-slate-400 uppercase tracking-widest text-xs mb-8">方块已堆积至顶部</p>
        
        <div className="mb-10">
          <span className="text-slate-400 text-sm block mb-1">最终得分</span>
          <span className="text-5xl font-mono font-bold text-slate-900">{score.toLocaleString()}</span>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onRestart}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            再试一次
          </button>
          <button 
            onClick={onHome}
            className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            返回主菜单
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
