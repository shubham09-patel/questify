import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="absolute top-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-3">
            <Sparkles className="w-7 h-7 fill-slate-950" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-amber-400 font-serif">
            ENTER THE REALM
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, brave adventurer.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-600/60 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Email Address
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? 'OPENING PORTAL...' : 'RESUME QUEST'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to Questify?{' '}
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Choose Your Hero & Register
          </Link>
        </div>
      </div>
    </div>
  );
};
