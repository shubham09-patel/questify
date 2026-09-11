import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Sword, User } from 'lucide-react';
import { CharacterRenderer } from '../components/CharacterRenderer';
import { CharacterGender } from '../types';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [selectedGender, setSelectedGender] = useState<CharacterGender>('male');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        email,
        password,
        name: name || 'Adventurer',
        character: selectedGender,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err.message || 'Registration failed. Check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-3">
            <Sparkles className="w-7 h-7 fill-slate-950" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-amber-400 font-serif">
            FORGE YOUR HERO
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose your starting avatar and awaken your questline.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-600/60 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Hero Selector Component */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 text-center">
            CHOOSE YOUR HERO
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Male Hero Card */}
            <button
              type="button"
              onClick={() => setSelectedGender('male')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                selectedGender === 'male'
                  ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <CharacterRenderer
                character="male"
                equipped={{
                  hair: 'hair_short',
                  clothes: 'tunic_novice',
                  weapon: 'wooden_sword',
                  shoes: 'boots_traveler',
                }}
                size={84}
                animate={selectedGender === 'male'}
              />
              <span className="text-xs font-bold text-slate-200 mt-2 uppercase tracking-wide">
                Male Adventurer
              </span>
            </button>

            {/* Female Hero Card */}
            <button
              type="button"
              onClick={() => setSelectedGender('female')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                selectedGender === 'female'
                  ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <CharacterRenderer
                character="female"
                equipped={{
                  hair: 'hair_long',
                  clothes: 'tunic_novice',
                  weapon: 'wooden_sword',
                  shoes: 'boots_traveler',
                }}
                size={84}
                animate={selectedGender === 'female'}
              />
              <span className="text-xs font-bold text-slate-200 mt-2 uppercase tracking-wide">
                Female Adventurer
              </span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Hero Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sir Arthur, Lady Lyra"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@guild.com"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Sword className="w-4 h-4" />
            {loading ? 'FORGING ACCOUNT...' : 'AWAKEN HERO & PLAY'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
