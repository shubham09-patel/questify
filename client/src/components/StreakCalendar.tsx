import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCalendarProps {
  streak: number;
  lastActiveDate?: string;
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streak = 1,
  className = '',
}) => {
  // Generate past 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentDayIndex = today.getDay();

  // Create an array of 7 day slots ending at today
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    // Active if within the streak window
    const isActive = i >= 7 - Math.min(streak, 7);
    const isToday = i === 6;

    return {
      dayName,
      dateNum: d.getDate(),
      isActive,
      isToday,
    };
  });

  return (
    <div
      className={`bg-slate-900/80 border border-orange-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(249,115,22,0.15)] ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)] animate-pulse">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Quest Streak
            </h3>
            <p className="text-xs text-slate-400">
              {streak > 0 ? `${streak} Day Streak Active!` : 'Start your streak today!'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-orange-400 font-mono flex items-center gap-1 justify-end">
            🔥 {streak}
          </span>
          <span className="text-[10px] uppercase font-semibold text-orange-300/70">
            {streak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* 7-day visual pills */}
      <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-slate-800">
        {last7Days.map((d, index) => (
          <div
            key={index}
            className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all ${
              d.isActive
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            } ${d.isToday ? 'ring-1 ring-amber-400' : ''}`}
          >
            <span className="text-[10px] font-semibold">{d.dayName}</span>
            <div className="my-1">
              {d.isActive ? (
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-700 mx-auto" />
              )}
            </div>
            <span className="text-[10px] font-mono">{d.dateNum}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
