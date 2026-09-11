import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Sparkles, Trophy, Shield, ArrowRight, Flame } from 'lucide-react';
import { CharacterRenderer } from '../components/CharacterRenderer';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black overflow-hidden">
      {/* Top Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="text-xl font-black tracking-wider text-amber-400 font-serif">
            QUESTIFY
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
            >
              Resume Journey
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
              >
                Start Playing
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-12 pb-20 max-w-5xl mx-auto relative">
        {/* Glow ambient circle */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <Sparkles className="w-4 h-4" />
          The Gamified RPG Task Forge
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-slate-100 font-serif max-w-4xl"
        >
          Turn Boring Todos Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
            Legendary Missions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Never stare at a lifeless checkbox again. Defeat algorithms, gain XP, earn gold, unlock
          epic pixel-art armor, and build an unstoppable real-life streak.
        </motion.p>

        {/* Character Showcase in Hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-10 flex items-center justify-center gap-8"
        >
          {/* Male Champion Preview */}
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <CharacterRenderer
                character="male"
                equipped={{
                  hair: 'hair_spiky',
                  clothes: 'jerkin_rogue',
                  armor: 'iron_plate',
                  weapon: 'iron_sword',
                  head: 'bandana_red',
                  shoes: 'greaves_steel',
                }}
                size={140}
                animate={true}
                showPedestal={true}
              />
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2">Paladin Hero</span>
          </div>

          {/* Female Sorceress Preview */}
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <CharacterRenderer
                character="female"
                equipped={{
                  hair: 'hair_long',
                  clothes: 'robe_apprentice',
                  weapon: 'mage_staff',
                  head: 'golden_crown',
                  shoes: 'boots_winged',
                }}
                size={140}
                animate={true}
                showPedestal={true}
              />
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2">Arcane Queen</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider text-sm rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sword className="w-5 h-5" />
            CHOOSE YOUR HERO
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold uppercase tracking-wider text-sm rounded-xl transition-all"
          >
            Existing Hero Sign In
          </Link>
        </motion.div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
          Game Mechanics
        </h2>
        <h3 className="text-center text-2xl sm:text-3xl font-black text-slate-100 font-serif mb-12">
          How Questify Powers Your Life
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
              <Sword className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-2">RPG-Style Missions</h4>
            <p className="text-sm text-slate-400">
              Categorize tasks as Tech, Knowledge, Training, or Work. Set difficulty from Easy to
              Legendary and watch real XP flow.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-2">Layered Gear Customization</h4>
            <p className="text-sm text-slate-400">
              Collect and equip swords, staves, helmets, robes, and dragon armor. Customize your
              pixel-art champion in real-time.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-2">Streaks & Achievements</h4>
            <p className="text-sm text-slate-400">
              Protect your streak flame daily, finish daily quests, and unlock prestigious badges and
              rare weapons.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Questify RPG &copy; {new Date().getFullYear()} — Slay tasks, level up reality.
      </footer>
    </div>
  );
};
