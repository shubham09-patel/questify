import React, { useEffect, useState } from 'react';
import { Plus, Filter, Sword, CheckCircle2, CircleDashed } from 'lucide-react';
import { MissionCard } from '../components/MissionCard';
import { MissionCreateModal } from '../components/MissionCreateModal';
import { useGame } from '../context/GameContext';
import { missionsApi } from '../services/api';
import { Mission, MissionCategory, MissionDifficulty } from '../types';

export const MissionsPage: React.FC = () => {
  const { handleMissionReward } = useGame();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      if (statusFilter === 'active') params.completed = 'false';
      if (statusFilter === 'completed') params.completed = 'true';

      const res = await missionsApi.getMissions(params);
      if (res.success) {
        setMissions(res.missions);
      }
    } catch (err) {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [statusFilter, categoryFilter, difficultyFilter]);

  const handleComplete = async (id: string) => {
    const res = await missionsApi.completeMission(id);
    if (res.success) {
      handleMissionReward(res);
      // Update local item
      setMissions((prev) =>
        prev.map((m) => (m._id === id ? { ...m, completed: true, completedAt: new Date().toISOString() } : m))
      );
    }
  };

  const handleUncomplete = async (id: string) => {
    const res = await missionsApi.uncompleteMission(id);
    if (res.success) {
      setMissions((prev) =>
        prev.map((m) => (m._id === id ? { ...m, completed: false, completedAt: null } : m))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Abandon this quest and delete from your log?')) return;
    const res = await missionsApi.deleteMission(id);
    if (res.success) {
      setMissions((prev) => prev.filter((m) => m._id !== id));
    }
  };

  const handleEdit = (mission: Mission) => {
    setEditingMission(mission);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (editingMission) {
      const res = await missionsApi.updateMission(editingMission._id, data);
      if (res.success) {
        setMissions((prev) =>
          prev.map((m) => (m._id === editingMission._id ? res.mission : m))
        );
      }
    } else {
      const res = await missionsApi.createMission(data);
      if (res.success) {
        setMissions((prev) => [res.mission, ...prev]);
      }
    }
    setEditingMission(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
            <Sword className="w-6 h-6 text-amber-400" />
            Quest Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn real-world responsibilities into glorious RPG conquest.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMission(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Forge New Mission
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'active'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CircleDashed className="w-3.5 h-3.5" />
            Active
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Conquered
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Quests
          </button>
        </div>

        {/* Category & Difficulty Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="all">All Realms</option>
              <option value="tech">⚔️ Tech</option>
              <option value="knowledge">📚 Knowledge</option>
              <option value="training">💪 Training</option>
              <option value="daily">🏠 Daily</option>
              <option value="work">💼 Work</option>
              <option value="special">⭐ Special</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mission List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500 animate-pulse">
          Opening the archives...
        </div>
      ) : missions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Sword className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Missions Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {statusFilter === 'completed'
              ? 'No completed quests matching this criteria yet.'
              : 'Your quest board is clear! Forge a new mission to begin.'}
          </p>
          <button
            onClick={() => {
              setEditingMission(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold transition-colors"
          >
            + Forge Mission
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              onComplete={handleComplete}
              onUncomplete={handleUncomplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <MissionCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMission(null);
        }}
        onSubmit={handleModalSubmit}
        editMission={editingMission}
      />
    </div>
  );
};
