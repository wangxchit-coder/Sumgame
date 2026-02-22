import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Timer, Trophy } from 'lucide-react';
import { GameMode } from '../types';

interface ModeSelectionProps {
  onSelect: (mode: GameMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4 tracking-tighter bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent">
          SUMSTACK
        </h1>
        <p className="text-slate-400 uppercase tracking-[0.3em] text-sm font-semibold">
          数字生存益智游戏
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <ModeCard 
          title="经典模式" 
          description="通过消除方块来生存。每次成功消除都会新增一行。不要让方块触顶。"
          icon={<Play className="w-6 h-6" />}
          onClick={() => onSelect(GameMode.CLASSIC)}
          color="emerald"
        />
        <ModeCard 
          title="计时模式" 
          description="与时间赛跑。如果在规定时间内未完成消除，将自动新增一行。"
          icon={<Timer className="w-6 h-6" />}
          onClick={() => onSelect(GameMode.TIME)}
          color="blue"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 max-w-md text-center"
      >
        <h4 className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-4">游戏玩法</h4>
        <div className="flex flex-col gap-3 text-slate-400 text-sm">
          <p>1. 点击方块选择数字进行求和。</p>
          <p>2. 凑齐屏幕上方的 <span className="text-slate-600">目标和</span> 即可消除。</p>
          <p>3. 如果方块堆积到屏幕顶部，游戏结束。</p>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 text-slate-300 text-xs uppercase tracking-widest">
        <Trophy className="w-3 h-3" />
        <span>最高分: 0</span>
      </div>
    </div>
  );
};

interface ModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'emerald' | 'blue';
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, icon, onClick, color }) => {
  const colorClasses = {
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
    blue: 'hover:border-blue-500/50 hover:bg-blue-500/5'
  };

  const iconClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    blue: 'bg-blue-500/10 text-blue-500'
  };

  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-panel p-8 text-left transition-all duration-300 border border-slate-200/50 ${colorClasses[color]}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${iconClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        {description}
      </p>
    </motion.button>
  );
};
