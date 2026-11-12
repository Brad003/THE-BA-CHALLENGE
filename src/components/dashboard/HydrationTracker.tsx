import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Droplet, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { CompletionSpark } from '../common/CompletionSpark';

export const HydrationTracker: React.FC = () => {
  const { user, logWaterIntake } = useApp();
  const hydration = user.hydration || { current: 0, goal: 3000, date: new Date().toISOString().split('T')[0] };
  
  const progressPercent = Math.min(100, Math.round((hydration.current / hydration.goal) * 100));
  const isGoalReached = hydration.current >= hydration.goal;
  
  const [justReached, setJustReached] = useState(false);
  const prevCurrent = useRef(hydration.current);

  useEffect(() => {
    if (hydration.current >= hydration.goal && prevCurrent.current < hydration.goal) {
      setJustReached(true);
      const timer = setTimeout(() => setJustReached(false), 2000);
      return () => clearTimeout(timer);
    }
    prevCurrent.current = hydration.current;
  }, [hydration.current, hydration.goal]);

  const logWater = (amount: number) => {
    logWaterIntake(amount);
  };

  return (
    <div className={`relative p-5 rounded-3xl border transition-all duration-500 ${isGoalReached ? 'bg-[#0a1e16] border-[#1e4a36]' : 'bg-[#0a150e] border-[#1b3826]'} flex flex-col space-y-4`}>
      <CompletionSpark trigger={justReached} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Droplet className={`w-4 h-4 ${isGoalReached ? 'text-[#38bdf8]' : 'text-[#60a5fa]'}`} />
          <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
            DAILY HYDRATION
          </h3>
        </div>
        <span className={`text-xs font-bold ${isGoalReached ? 'text-[#38bdf8]' : 'text-[#7d9987]'}`}>
          {hydration.current} / {hydration.goal} ml
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="w-full h-4 bg-[#050b07] rounded-full overflow-hidden mb-4 border border-[#14261a]">
          <motion.div 
            className={`h-full rounded-full ${isGoalReached ? 'bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]' : 'bg-[#1e3a8a]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => logWater(-250)}
            className="col-span-1 py-2 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#ef4444] flex items-center justify-center transition-colors"
            title="Remove 250ml"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => logWater(250)}
            className="col-span-1 py-2 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#60a5fa] flex flex-col items-center justify-center transition-colors"
          >
            <span className="font-bold">+250</span>
          </button>
          <button
            onClick={() => logWater(500)}
            className="col-span-1 py-2 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#60a5fa] flex flex-col items-center justify-center transition-colors"
          >
            <span className="font-bold">+500</span>
          </button>
          <button
            onClick={() => logWater(1000)}
            className="col-span-1 py-2 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#38bdf8] flex flex-col items-center justify-center transition-colors"
          >
            <span className="font-bold">+1L</span>
          </button>
        </div>
      </div>
      
      {isGoalReached && (
        <div className="text-center mt-2">
           <span className="text-[10px] text-[#38bdf8] font-bold uppercase tracking-widest animate-pulse">
             Hydration Optimal
           </span>
        </div>
      )}
    </div>
  );
};
