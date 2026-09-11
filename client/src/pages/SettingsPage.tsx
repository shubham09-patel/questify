import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, User, Database, LogOut, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { playerApi } from '../services/api';
import { sound } from '../utils/soundService';

export const SettingsPage: React.FC = () => {
  const { user, logout, refreshAuth } = useAuth();
  const { isMuted, toggleSound } = useGame();

  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingName(true);
    try {
      await playerApi.updateProfile(name.trim());
      await refreshAuth();
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-amber-400" />
          Settings & Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tune your audio preferences, hero identity, and database status.
        </p>
      </div>

      {/* Hero Profile Form */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          Hero Profile
        </h3>

        <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Display Hero Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors"
                placeholder="Your Hero Name"
              />
              <button
                type="submit"
                disabled={savingName}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                {savingName ? 'Saving...' : 'Update'}
              </button>
            </div>
            {nameSuccess && (
              <span className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Hero identity updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Retro 8-bit Audio Controls */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          Retro 8-Bit Audio Synthesizer
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div>
            <span className="text-sm font-bold text-slate-200 block">Game Sound Effects</span>
            <span className="text-xs text-slate-400">
              Chiptune chimes synthesized procedurally via browser Web Audio API.
            </span>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4" /> Sound Muted
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Sound Active
              </>
            )}
          </button>
        </div>

        {/* Audio Audition Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => sound.playLevelUp()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            🎺 Play Level Up Fanfare
          </button>
          <button
            type="button"
            onClick={() => sound.playMissionComplete()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            ⚔️ Play Quest Complete
          </button>
          <button
            type="button"
            onClick={() => sound.playCoin()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            💰 Play Coin Blip
          </button>
          <button
            type="button"
            onClick={() => sound.playBuy()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            🛍 Play Shop Chime
          </button>
        </div>
      </div>

      {/* Database Connection Instructions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          MongoDB Database Setup
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Questify reads the database URI dynamically from <code className="text-amber-400 font-mono">MONGODB_URI</code> in your environment file.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
          <p className="text-slate-400"># 1. Create your local .env in the server directory:</p>
          <p className="text-amber-300">cp .env.example .env</p>
          <p className="text-slate-400 mt-2"># 2. Add your MongoDB connection string in .env:</p>
          <p className="text-emerald-400">MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster.mongodb.net/questify</p>
          <p className="text-slate-400 mt-2"># 3. Seed starter items and achievements:</p>
          <p className="text-blue-400">npm run seed</p>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-600/60 text-rose-300 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Leave Questify & Sign Out
        </button>
      </div>
    </div>
  );
};
