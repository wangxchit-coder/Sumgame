import React from 'react';
import { motion } from 'motion/react';
import { Block } from '../types';

interface NumberBlockProps {
  block: Block | null;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const NumberBlock: React.FC<NumberBlockProps> = ({ block, isSelected, onToggle }) => {
  if (!block) return <div className="w-full aspect-square" />;

  return (
    <motion.button
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(block.id)}
      className={`
        w-full aspect-square rounded-lg flex items-center justify-center text-base font-bold transition-all duration-200
        ${isSelected 
          ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'}
      `}
    >
      {block.value}
    </motion.button>
  );
};
