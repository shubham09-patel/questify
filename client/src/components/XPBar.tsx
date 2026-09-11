import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  nextLevelXp,
  level,
  showDetails = true,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (currentXp / (nextLevelXp || 1)) * 100));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
              LVL {level}
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <span className="text-blue-400 font-mono text-[11px]">{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Progress Track */}
      <div
        className={`w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/80 p-0.5 shadow-inner ${heightClasses[size]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-300 shadow-[0_0_12px_rgba(59,130,246,0.6)] relative overflow-hidden"
        >
          {/* Shimmer line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
