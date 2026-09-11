import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Trash2, Edit2, Undo2 } from 'lucide-react';
import { Mission, MissionCategory, MissionDifficulty } from '../types';

interface MissionCardProps {
  mission: Mission;
  onComplete: (id: string) => Promise<void>;
  onUncomplete?: (id: string) => Promise<void>;
  onEdit?: (mission: Mission) => void;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<MissionCategory, { label: string; icon: string; color: string }> = {
  tech: { label: 'Tech', icon: '⚔️', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50' },
  knowledge: { label: 'Knowledge', icon: '📚', color: 'text-blue-400 bg-blue-950/60 border-blue-700/50' },
  training: { label: 'Training', icon: '💪', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' },
  daily: { label: 'Daily', icon: '🏠', color: 'text-amber-400 bg-amber-950/60 border-amber-700/50' },
  work: { label: 'Work', icon: '💼', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-700/50' },
  special: { label: 'Special', icon: '⭐', color: 'text-purple-400 bg-purple-950/60 border-purple-700/50' },
};

const DIFFICULTY_CONFIG: Record<MissionDifficulty, { label: string; color: string; border: string }> = {
  easy: { label: 'Easy', color: 'text-slate-400 bg-slate-800/80', border: 'border-slate-700' },
  normal: { label: 'Normal', color: 'text-emerald-400 bg-emerald-950/70', border: 'border-emerald-700/70' },
  hard: { label: 'Hard', color: 'text-amber-400 bg-amber-950/70', border: 'border-amber-700/80' },
  epic: { label: 'Epic', color: 'text-purple-400 bg-purple-950/80', border: 'border-purple-600/80' },
  legendary: { label: 'Legendary', color: 'text-rose-400 bg-rose-950/80', border: 'border-rose-600' },
};

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);
  const cat = CATEGORY_LABELS[mission.category] || CATEGORY_LABELS.daily;
  const diff = DIFFICULTY_CONFIG[mission.difficulty] || DIFFICULTY_CONFIG.normal;

  const handleAction = async () => {
    setLoading(true);
    try {
      if (mission.completed && onUncomplete) {
        await onUncomplete(mission._id);
      } else {
        await onComplete(mission._id);
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = mission.dueDate
    ? new Date(mission.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.008 }}
      transition={{ duration: 0.2 }}
      className={`relative group bg-gradient-to-r from-slate-900/95 via-[#131a2a]/90 to-slate-900/95 border rounded-xl p-4 transition-all duration-200 ${
        mission.completed
          ? 'border-slate-800 opacity-60 bg-slate-950/40'
          : 'border-slate-800 hover:border-amber-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Info: Title, Description, Badges */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Quick Checkbox button */}
          <button
            onClick={handleAction}
            disabled={loading}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
              mission.completed
                ? 'bg-emerald-500 border-emerald-400 text-black'
                : 'border-slate-600 hover:border-amber-400 bg-slate-800/80 hover:bg-amber-500/20'
            }`}
            title={mission.completed ? 'Mark uncompleted' : 'Mark completed'}
          >
            {mission.completed ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <span className="w-2 h-2 rounded-sm bg-transparent group-hover:bg-amber-400 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${cat.color}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </span>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${diff.color} ${diff.border}`}
              >
                {diff.label}
              </span>

              {formattedDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
            </div>

            <h4
              className={`text-sm sm:text-base font-bold tracking-tight text-slate-100 truncate ${
                mission.completed ? 'line-through text-slate-400' : ''
              }`}
            >
              {mission.title}
            </h4>

            {mission.description && !compact && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mission.description}</p>
            )}
          </div>
        </div>

        {/* Right Info: Rewards & Action Complete Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {/* Rewards Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-blue-950/80 text-blue-400 border border-blue-700/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-[0_0_8px_rgba(59,130,246,0.25)]">
              +{mission.xpReward} XP
            </span>
            <span className="bg-amber-950/80 text-amber-400 border border-amber-700/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)]">
              +{mission.coinReward} Coins
            </span>
          </div>

          {/* Action Button */}
          {mission.completed ? (
            <button
              onClick={handleAction}
              disabled={loading}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              Reopen
            </button>
          ) : (
            <button
              onClick={handleAction}
              disabled={loading}
              className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Complete
            </button>
          )}

          {/* Menu Actions: Edit & Delete */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 pl-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(mission)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                  title="Edit Mission"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(mission._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-950/50 transition-colors"
                  title="Delete Mission"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
