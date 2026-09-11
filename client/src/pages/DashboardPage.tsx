import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Flame,
  Coins,
  Trophy,
  Sparkles,
  Sword,
  Target,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CharacterRenderer } from '../components/CharacterRenderer';
import { XPBar } from '../components/XPBar';
import { StreakCalendar } from '../components/StreakCalendar';
import { MissionCard } from '../components/MissionCard';
import { DailyQuestCard } from '../components/DailyQuestCard';
import { MissionCreateModal } from '../components/MissionCreateModal';
import { RarityBadge } from '../components/RarityBadge';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { achievementsApi, dailyQuestsApi, missionsApi } from '../services/api';
import { Achievement, DailyQuest, Mission } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { player, nextLevelXp, equipped, inventory, handleMissionReward } = useGame();

  const [todayMissions, setTodayMissions] = useState<Mission[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingMissions, setLoadingMissions] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoadingMissions(true);
      const [missionsRes, questsRes, achRes] = await Promise.all([
        missionsApi.getMissions({ completed: 'false' }),
        dailyQuestsApi.getDailyQuests(),
        achievementsApi.getAchievements(),
      ]);

      if (missionsRes.success) {
        setTodayMissions(missionsRes.missions.slice(0, 5));
      }
      if (questsRes.success) {
        setDailyQuests(questsRes.quests);
      }
      if (achRes.success) {
        // Find completed achievements or high-progress ones
        const sorted = achRes.achievements
          .sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0))
          .slice(0, 3);
        setRecentAchievements(sorted);
      }
    } catch (err) {
      // Handled
    } finally {
      setLoadingMissions(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCompleteMission = async (id: string) => {
    const res = await missionsApi.completeMission(id);
    if (res.success) {
      handleMissionReward(res);
      // Remove from active list
      setTodayMissions((prev) => prev.filter((m) => m._id !== id));
      // Refresh daily quests
      const questsRes = await dailyQuestsApi.getDailyQuests();
      if (questsRes.success) setDailyQuests(questsRes.quests);
    }
  };

  const handleCreateMission = async (data: any) => {
    const res = await missionsApi.createMission(data);
    if (res.success) {
      setTodayMissions((prev) => [res.mission, ...prev]);
    }
  };

  const handleClaimDailyQuest = async (id: string) => {
    const res = await dailyQuestsApi.claimReward(id);
    if (res.success) {
      setDailyQuests((prev) =>
        prev.map((q) => (q._id === id ? { ...q, claimed: true } : q))
      );
      // Update player coins & XP
      if (res.progression) {
        handleMissionReward({
          success: true,
          message: 'Daily Quest Claimed!',
          rewards: res.reward,
          progression: res.progression,
          newlyUnlockedAchievements: [],
          updatedDailyQuests: [],
          mission: {} as any,
        });
      }
    }
  };

  // Recent items unlocked: last 3 in inventory
  const recentItems = inventory.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Top Hero Banner / Hero Status Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border-2 border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Hero Avatar + Level Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative p-2 rounded-2xl bg-slate-950/80 border border-slate-700 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
              <CharacterRenderer
                character={player?.character || 'male'}
                equipped={equipped}
                size={110}
                animate={true}
                showPedestal={true}
              />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-serif">
                  {user?.name || 'Brave Adventurer'}
                </h2>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  LVL {player?.level || 1}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                {player?.character === 'female' ? 'Sorceress Champion' : 'Paladin Knight'} &bull;{' '}
                {player?.totalMissionsCompleted || 0} Quests Vanquished
              </p>

              {/* XP Bar */}
              <div className="w-64 sm:w-80">
                <XPBar
                  currentXp={player?.xp || 0}
                  nextLevelXp={nextLevelXp}
                  level={player?.level || 1}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Right Hero Quick Stats */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Treasury</span>
              <span className="text-xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Coins className="w-5 h-5" />
                {(player?.coins || 0).toLocaleString()}
              </span>
            </div>

            <div className="text-center px-3">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Streak</span>
              <span className="text-xl font-black text-orange-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400" />
                {player?.streak || 1} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Missions & Quests) | Right (Streak & Unlocks) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Missions & Daily Quests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Missions Header & Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sword className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-serif">
                    Today's Missions
                  </h3>
                  <p className="text-xs text-slate-400">Conquer these tasks to earn XP & coins.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.35)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Forge Mission
                </button>
                <Link
                  to="/missions"
                  className="text-xs font-semibold text-slate-400 hover:text-amber-400 p-1.5 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mission List */}
            {loadingMissions ? (
              <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                Consulting the quest log...
              </div>
            ) : todayMissions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <Sparkles className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-300">All Quests Vanquished!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  The realm is peaceful. Forge a new mission or check back tomorrow for fresh rewards!
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold transition-colors"
                >
                  + Create Next Mission
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayMissions.map((mission) => (
                  <MissionCard
                    key={mission._id}
                    mission={mission}
                    onComplete={handleCompleteMission}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Daily Quests Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-serif">
                  Daily Quests
                </h3>
                <p className="text-xs text-slate-400">Bonus trials reset every 24 hours.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dailyQuests.map((quest) => (
                <DailyQuestCard key={quest._id} quest={quest} onClaim={handleClaimDailyQuest} />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Streak Calendar & Unlocks */}
        <div className="space-y-6">
          {/* Visual Streak Calendar */}
          <StreakCalendar
            streak={player?.streak || 1}
            lastActiveDate={player?.lastActiveDate}
          />

          {/* Recently Unlocked Gear */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Recent Gear Unlocked
                </h4>
              </div>
              <Link to="/inventory" className="text-[11px] text-amber-400 font-bold hover:underline">
                Armory &rarr;
              </Link>
            </div>

            {recentItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Visit the Shop to acquire new gear!
              </p>
            ) : (
              <div className="space-y-2">
                {recentItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.asset}
                        alt={item.name}
                        className="w-9 h-9 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block truncate max-w-[140px]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">{item.type}</span>
                      </div>
                    </div>
                    <RarityBadge rarity={item.rarity} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Achievements
                </h4>
              </div>
              <Link
                to="/achievements"
                className="text-[11px] text-purple-400 font-bold hover:underline"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentAchievements.map((ach) => (
                <div
                  key={ach.achievementId}
                  className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xl">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {ach.name}
                        </span>
                        {ach.completed && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{ach.description}</p>
                    </div>
                  </div>

                  {/* Progress track */}
                  {!ach.completed && (
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((ach.progress || 0) / ach.requirement.target) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forge Mission Modal */}
      <MissionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMission}
      />
    </div>
  );
};
