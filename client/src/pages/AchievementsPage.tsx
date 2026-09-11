import React, { useEffect, useState } from 'react';
import { Trophy, Award, CheckCircle2, Lock } from 'lucide-react';
import { achievementsApi } from '../services/api';
import { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await achievementsApi.getAchievements();
      if (res.success) {
        setAchievements(res.achievements);
      }
    } catch (err) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const completedCount = achievements.filter((a) => a.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-purple-400" />
            Hall of Achievements
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historic milestones earned through iron discipline and heroic consistency.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-500/40 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.25)]">
          <Award className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-bold text-purple-200">Unlocked:</span>
          <span className="text-lg font-black text-purple-400 font-mono">
            {completedCount} / {achievements.length}
          </span>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500 animate-pulse">
          Opening the chronicles of glory...
        </div>
      ) : achievements.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">Chronicles Awaiting Seed</h4>
          <p className="text-xs text-slate-500 mt-1">
            Run the seed script with your MongoDB connection to initialize achievements!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const progress = ach.progress || 0;
            const target = ach.requirement.target || 1;
            const percentage = Math.min(100, Math.round((progress / target) * 100));

            return (
              <div
                key={ach.achievementId}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  ach.completed
                    ? 'bg-slate-900/90 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                        ach.completed
                          ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                        {ach.name}
                        {ach.completed && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>

                  {/* Rewards Pill */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {ach.reward.xp && (
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
                        +{ach.reward.xp} XP
                      </span>
                    )}
                    {ach.reward.coins && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                        +{ach.reward.coins} Coins
                      </span>
                    )}
                    {ach.reward.itemId && (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 border border-purple-600 px-2 py-0.5 rounded">
                        🎁 Rare Gear
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span className="font-semibold">
                      {ach.completed ? (
                        <span className="text-emerald-400 font-bold uppercase">Achieved</span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Lock className="w-3 h-3" /> Progress
                        </span>
                      )}
                    </span>
                    <span>
                      {progress} / {target} ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.completed
                          ? 'bg-gradient-to-r from-purple-600 to-emerald-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                          : 'bg-purple-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
