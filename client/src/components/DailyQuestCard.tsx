import React, { useState } from 'react';
import { Target, Gift, Check } from 'lucide-react';
import { DailyQuest } from '../types';

interface DailyQuestCardProps {
  quest: DailyQuest;
  onClaim: (id: string) => Promise<void>;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({ quest, onClaim }) => {
  const [claiming, setClaiming] = useState(false);
  const percentage = Math.min(100, (quest.currentCount / (quest.targetCount || 1)) * 100);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await onClaim(quest._id);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-blue-500/40 transition-all shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-100">{quest.title}</h5>
            <p className="text-[11px] text-slate-400">{quest.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-blue-400 font-bold">+{quest.xpReward} XP</span>
          <span className="text-amber-400 font-bold">+{quest.coinReward} 💰</span>
        </div>
      </div>

      {/* Progress Bar & Claim Button */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Progress</span>
            <span>
              {quest.currentCount} / {quest.targetCount}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quest.completed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {quest.completed && !quest.claimed && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-[11px] font-black uppercase tracking-wider rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-bounce-subtle"
          >
            <Gift className="w-3.5 h-3.5" />
            Claim
          </button>
        )}

        {quest.claimed && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <Check className="w-3.5 h-3.5" />
            Claimed
          </span>
        )}
      </div>
    </div>
  );
};
