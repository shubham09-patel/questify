import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar, NAV_ITEMS } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { LevelUpModal } from '../components/LevelUpModal';
import { MissionCompleteModal } from '../components/MissionCompleteModal';
import { useGame } from '../context/GameContext';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { levelUpData, dismissLevelUp, missionRewardToast, dismissRewardToast } = useGame();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-[#0d1322] border-r border-slate-800 p-4 flex flex-col z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-amber-400 font-serif tracking-wider">
                QUESTIFY
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1220]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`
            }
          >
            <span className="text-base">{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Modals & Celebrations */}
      <LevelUpModal data={levelUpData} onClose={dismissLevelUp} />
      <MissionCompleteModal data={missionRewardToast} onClose={dismissRewardToast} />
    </div>
  );
};
