import React from 'react';
import { Volume2, VolumeX, Flame, Coins, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { XPBar } from './XPBar';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { player, nextLevelXp, isMuted, toggleSound } = useGame();

  return (
    <header className="sticky top-0 z-30 bg-[#0c1220]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Mobile Menu Trigger / Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden font-black text-amber-400 font-serif tracking-wider">
            QUESTIFY
          </div>
        </div>

        {/* Center: Live XP Progress Bar */}
        {player && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <XPBar
              currentXp={player.xp}
              nextLevelXp={nextLevelXp}
              level={player.level}
              size="sm"
            />
          </div>
        )}

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-3">
          {player && (
            <>
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-950/60 border border-orange-500/40 rounded-xl text-orange-400 font-mono font-bold text-xs shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-400 animate-pulse" />
                <span>{player.streak}d</span>
              </div>

              {/* Coins Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-400 font-mono font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{player.coins.toLocaleString()}</span>
              </div>
            </>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-blue-950/60 border-blue-600/50 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
            }`}
            title={isMuted ? 'Unmute 8-bit Audio' : 'Mute 8-bit Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-600/50 text-slate-400 hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile XP Bar (Underneath on mobile) */}
      {player && (
        <div className="md:hidden pt-2">
          <XPBar
            currentXp={player.xp}
            nextLevelXp={nextLevelXp}
            level={player.level}
            size="sm"
          />
        </div>
      )}
    </header>
  );
};
