import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sword,
  User,
  Backpack,
  ShoppingBag,
  Trophy,
  Settings,
  Sparkles,
} from 'lucide-react';
import { CharacterRenderer } from './CharacterRenderer';
import { useGame } from '../context/GameContext';

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
  { path: '/missions', label: 'Missions', icon: Sword, emoji: '⚔️' },
  { path: '/character', label: 'Character', icon: User, emoji: '🧙' },
  { path: '/inventory', label: 'Inventory', icon: Backpack, emoji: '🎒' },
  { path: '/shop', label: 'Shop', icon: ShoppingBag, emoji: '🛍' },
  { path: '/achievements', label: 'Achievements', icon: Trophy, emoji: '🏆' },
  { path: '/settings', label: 'Settings', icon: Settings, emoji: '⚙' },
];

export const Sidebar: React.FC = () => {
  const { player, equipped } = useGame();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0d1322] border-r border-slate-800/80 min-h-screen p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <Sparkles className="w-6 h-6 fill-slate-950" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 font-serif">
            QUESTIFY
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80">
            RPG Task Forge
          </p>
        </div>
      </div>

      {/* Mini Character Card Preview */}
      {player && (
        <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            <CharacterRenderer
              character={player.character}
              equipped={equipped}
              size={48}
              animate={false}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200 truncate">
                Level {player.level}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 rounded font-mono">
                Hero
              </span>
            </div>
            <div className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1 mt-0.5">
              <span>💰 {player.coins.toLocaleString()}</span>
              <span className="text-slate-500">|</span>
              <span className="text-orange-400">🔥 {player.streak}d</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border-l-4 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Flavor Widget */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500 italic">
          "Every task completed is a monster slain."
        </p>
      </div>
    </aside>
  );
};
