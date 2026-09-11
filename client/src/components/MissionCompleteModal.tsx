import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award, Flame, X } from 'lucide-react';

interface MissionCompleteModalProps {
  data: {
    xpEarned: number;
    coinsEarned: number;
    streakIncreased?: boolean;
    achievements?: any[];
  } | null;
  onClose: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  data,
  onClose,
}) => {
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [data, onClose]);

  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-r from-slate-900 via-[#10192e] to-slate-900 border-2 border-emerald-500/70 rounded-2xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.35)] overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                Mission Conquered!
              </h4>
              <p className="text-xs text-slate-300">Rewards forged and added to your hero.</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-around bg-slate-950/70 border border-slate-800 rounded-xl py-2 px-3">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400 font-bold font-mono text-sm">
                +{data.xpEarned} XP
              </span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold font-mono text-sm">
                +{data.coinsEarned} Coins
              </span>
            </div>
            {data.streakIncreased && (
              <>
                <div className="h-4 w-px bg-slate-700" />
                <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  Streak +1
                </div>
              </>
            )}
          </div>

          {/* If an achievement unlocked during this mission */}
          {data.achievements && data.achievements.length > 0 && (
            <div className="mt-2.5 p-2 bg-purple-950/60 border border-purple-500/40 rounded-lg flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div className="text-[11px] text-purple-200">
                <span className="font-bold">Achievement Unlocked: </span>
                {data.achievements[0].achievement.name}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
