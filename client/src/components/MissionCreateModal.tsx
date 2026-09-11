import React, { useState } from 'react';
import { X, Sparkles, Sword } from 'lucide-react';
import { Mission, MissionCategory, MissionDifficulty } from '../types';

interface MissionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    category: MissionCategory;
    difficulty: MissionDifficulty;
    dueDate?: string | null;
  }) => Promise<void>;
  editMission?: Mission | null;
}

const CATEGORIES: Array<{ id: MissionCategory; label: string; icon: string }> = [
  { id: 'tech', label: 'Tech', icon: '⚔️' },
  { id: 'knowledge', label: 'Knowledge', icon: '📚' },
  { id: 'training', label: 'Training', icon: '💪' },
  { id: 'daily', label: 'Daily', icon: '🏠' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'special', label: 'Special', icon: '⭐' },
];

const DIFFICULTIES: Array<{
  id: MissionDifficulty;
  label: string;
  xpEstimate: number;
  coinEstimate: number;
  color: string;
}> = [
  { id: 'easy', label: 'Easy', xpEstimate: 20, coinEstimate: 10, color: 'text-slate-300' },
  { id: 'normal', label: 'Normal', xpEstimate: 45, coinEstimate: 25, color: 'text-emerald-400' },
  { id: 'hard', label: 'Hard', xpEstimate: 85, coinEstimate: 45, color: 'text-amber-400' },
  { id: 'epic', label: 'Epic', xpEstimate: 180, coinEstimate: 90, color: 'text-purple-400' },
  { id: 'legendary', label: 'Legendary', xpEstimate: 400, coinEstimate: 200, color: 'text-rose-400' },
];

export const MissionCreateModal: React.FC<MissionCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editMission,
}) => {
  const [title, setTitle] = useState(editMission?.title || '');
  const [description, setDescription] = useState(editMission?.description || '');
  const [category, setCategory] = useState<MissionCategory>(editMission?.category || 'daily');
  const [difficulty, setDifficulty] = useState<MissionDifficulty>(
    editMission?.difficulty || 'normal'
  );
  const [dueDate, setDueDate] = useState(
    editMission?.dueDate ? new Date(editMission.dueDate).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if editing
  React.useEffect(() => {
    if (editMission) {
      setTitle(editMission.title);
      setDescription(editMission.description || '');
      setCategory(editMission.category);
      setDifficulty(editMission.difficulty);
      setDueDate(
        editMission.dueDate ? new Date(editMission.dueDate).toISOString().split('T')[0] : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setCategory('daily');
      setDifficulty('normal');
      setDueDate('');
    }
  }, [editMission, isOpen]);

  if (!isOpen) return null;

  const currentDiff = DIFFICULTIES.find((d) => d.id === difficulty) || DIFFICULTIES[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a mission title');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to forge mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-serif">
                {editMission ? 'Edit Quest Details' : 'Forge New Mission'}
              </h3>
              <p className="text-xs text-slate-400">Transform your real-life task into an RPG quest.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 bg-rose-950/60 border border-rose-600/50 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Mission Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., "⚔️ Defeat The Algorithm", "Read chapter 4 of SwiftUI"'
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What specific victory conditions must be met?"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                    category === c.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Difficulty & Rewards
              </label>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-blue-400">+{currentDiff.xpEstimate} XP</span>
                <span className="text-amber-400">+{currentDiff.coinEstimate} Coins</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`py-2 px-1 rounded-lg border text-center text-xs font-bold transition-all ${
                    difficulty === d.id
                      ? 'bg-slate-800 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] truncate">{d.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {editMission ? 'Save Mission' : 'Accept Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
