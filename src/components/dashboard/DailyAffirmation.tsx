import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';

const AFFIRMATIONS = [
  "Discipline equals freedom. Stand firm today, brother.",
  "We don't leave any man behind. Check on your pride.",
  "Pain is weakness leaving the body. Push through the resistance.",
  "A river cuts through rock not because of its power, but its persistence.",
  "Do not pray for an easy life, pray for the strength to endure a difficult one.",
  "The only bad workout is the one that didn't happen.",
  "Your mind will quit a thousand times before your body does. Keep pushing.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Success is neither magical nor mysterious. It is the natural consequence of consistently applying basic fundamentals.",
  "Endurance is one of the most difficult disciplines, but it is to the one who endures that the final victory comes.",
  "Silent consistency beats reckless intensity.",
  "You cannot build a reputation on what you are going to do. Act now.",
  "The iron never lies to you. Respect the weight, respect the process.",
  "Be stronger than your strongest excuse.",
  "Outwork your yesterday. The Panther never settles.",
  "Adversity is the first path to truth. Embrace the struggle."
];

export const DailyAffirmation: React.FC = () => {
  const dailyQuote = useMemo(() => {
    const today = new Date();
    // Use the year, month, and day to create a consistent index for the day
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % AFFIRMATIONS.length;
    return AFFIRMATIONS[index];
  }, []);

  return (
    <div className="rounded-3xl border border-[var(--accent-main)]/20 bg-gradient-to-r from-[#0c1d13] to-[#0a180f] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-[0.03] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
        <Quote className="w-32 h-32 text-[var(--accent-main)]" />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#183a27] border border-[#2a593e] flex items-center justify-center">
          <Quote className="w-4 h-4 text-[var(--accent-main)] ml-0.5" />
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-[0.2em] mb-1">
            Brotherhood Code
          </h3>
          <p className="text-sm font-medium text-[#f5ebd7] leading-relaxed italic pr-6 sm:pr-12">
            "{dailyQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};
