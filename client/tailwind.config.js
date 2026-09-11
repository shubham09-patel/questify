/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#0b0f19',
          card: '#121826',
          border: '#243048',
          hover: '#1b2438',
          gold: '#f59e0b',
          xp: '#3b82f6',
          danger: '#ef4444',
          streak: '#f97316',
        },
        rarity: {
          common: '#94a3b8',
          uncommon: '#10b981',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#f59e0b',
          mythic: '#f43f5e',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace', 'sans-serif'],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-gold': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-xp': '0 0 15px rgba(59, 130, 246, 0.4)',
        'glow-epic': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-legendary': '0 0 25px rgba(245, 158, 11, 0.6)',
      },
      animation: {
        'bounce-subtle': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
