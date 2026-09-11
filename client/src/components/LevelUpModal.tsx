import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Award, X } from 'lucide-react';
import { Item } from '../types';
import { RarityBadge } from './RarityBadge';

interface LevelUpModalProps {
  data: {
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
    unlockedItems: Item[];
  } | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      // Trigger festive multi-burst confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    }
  }, [data]);

  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-[#131a2b] to-slate-950 border-2 border-amber-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Golden Sunburst Header Effect */}
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce-subtle">
            <Sparkles className="w-10 h-10 text-slate-950" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 font-serif">
            LEVEL UP!
          </h2>
          <p className="text-sm text-amber-200/80 mt-1 font-semibold">
            Your persistence has unlocked new heroic power!
          </p>

          {/* Level Transition Badge */}
          <div className="my-6 flex items-center justify-center gap-4 bg-slate-950/80 border border-amber-500/30 rounded-xl py-3 px-6 shadow-inner">
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">From</span>
              <span className="text-2xl font-black text-slate-300 font-mono">
                LVL {data.oldLevel}
              </span>
            </div>
            <ArrowRight className="w-6 h-6 text-amber-400 animate-pulse" />
            <div className="text-center">
              <span className="block text-[10px] text-amber-400 font-bold uppercase">To</span>
              <span className="text-3xl font-black text-amber-400 font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]">
                LVL {data.newLevel}
              </span>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <span className="text-sm font-semibold text-amber-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Level-Up Bounty:
              </span>
              <span className="text-base font-bold text-amber-400 font-mono">
                +{data.bonusCoins} Coins
              </span>
            </div>

            {/* Unlocked items if any */}
            {data.unlockedItems && data.unlockedItems.length > 0 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-2">
                  ✨ Newly Unlocked Gear:
                </span>
                <div className="space-y-2">
                  {data.unlockedItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between bg-slate-900/90 p-2 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.asset}
                          alt={item.name}
                          className="w-8 h-8 object-contain bg-slate-800 rounded p-1"
                          style={{ imageRendering: 'pixelated' }}
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{item.type}</span>
                        </div>
                      </div>
                      <RarityBadge rarity={item.rarity} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Claim & Continue Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            CLAIM GLORY & CONTINUE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
