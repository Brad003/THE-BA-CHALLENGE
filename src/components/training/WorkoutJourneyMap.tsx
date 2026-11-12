import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Lock, MapPin, Target, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { RealisticEmblem } from '../common/RealisticEmblem';

const JOURNEY_STOPS = [
  { level: 1, name: 'The Den (Cub)', minXp: 0, icon: 'claw', description: 'Entering the trail. Awakening discipline.', bg: 'bg-[#0f1d15]' },
  { level: 2, name: 'The Foothills (Tracker)', minXp: 501, icon: 'compass', description: 'Reading the ground. Building consistency.', bg: 'bg-[#122418]' },
  { level: 3, name: 'The Canopy (Hunter)', minXp: 1201, icon: 'zap', description: 'Sharpening strength and physical endurance.', bg: 'bg-[#152a1b]' },
  { level: 4, name: "Panther's Peak", minXp: 2501, icon: 'panther', description: 'Total embodiment of strength & grace.', bg: 'bg-[#18301e]' },
  { level: 5, name: "Alpha's Ridge", minXp: 4501, icon: 'crown', description: 'Leading the charge on the trails.', bg: 'bg-[#1b3722]' },
  { level: 6, name: 'The Sanctuary', minXp: 7501, icon: 'shield', description: 'Anchor of the brotherhood. Wisdom in action.', bg: 'bg-[#1e3e26]' },
  { level: 7, name: 'Legacy Forest', minXp: 12001, icon: 'tree', description: 'Leaving an indelible mark on the earth.', bg: 'bg-[#21452a]' },
];

export const WorkoutJourneyMap: React.FC = () => {
  const { user } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const currentLevel = user.pantherLevel;

  // Scroll to active level on mount
  useEffect(() => {
    if (scrollRef.current) {
      const activeNode = scrollRef.current.querySelector('[data-active="true"]');
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentLevel]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1a3625] space-y-4 shadow-xl overflow-hidden relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-base font-bold text-[#f5ebd7] tracking-wider uppercase">
            Your Panther Journey
          </h2>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg bg-[#112417] text-[#8ea496] hover:text-[var(--accent-main)] transition-colors hidden sm:block">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg bg-[#112417] text-[#8ea496] hover:text-[var(--accent-main)] transition-colors hidden sm:block">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-xs text-[#8da696]">
        Forge your path. Every completed session drives you deeper into the wild.
      </p>

      <div className="relative mt-8 mb-4">
        {/* Background Line */}
        <div className="absolute top-[4.5rem] left-0 right-0 h-1 bg-[#16291e] rounded-full z-0 pointer-events-none" />

        {/* Scrollable container */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-6 pt-4 px-4 sm:px-8 snap-x snap-mandatory scrollbar-none z-10 relative"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {JOURNEY_STOPS.map((stop, index) => {
            const isUnlocked = currentLevel >= stop.level;
            const isCurrent = currentLevel === stop.level;
            const isNext = currentLevel === stop.level - 1;

            return (
              <div 
                key={stop.level} 
                data-active={isCurrent}
                className="flex-shrink-0 w-48 flex flex-col items-center snap-center relative"
              >
                {/* Connector Line Fill (Active) */}
                {index < JOURNEY_STOPS.length - 1 && (
                   <div 
                     className={`absolute top-[3.5rem] left-1/2 w-full h-1 z-[-1] transition-all duration-1000 ${
                       currentLevel > stop.level ? 'bg-[var(--accent-main)]' : 'bg-transparent'
                     }`}
                     style={{ width: 'calc(100% + 1rem)' }}
                   />
                )}

                {/* Node Icon */}
                <div className="relative z-10">
                  {isCurrent && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--accent-main)] rounded-full flex items-center justify-center animate-bounce shadow-md z-20">
                      <Target className="w-3 h-3 text-[#0a150e]" />
                    </span>
                  )}
                  {isUnlocked && !isCurrent && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#34d399] rounded-full flex items-center justify-center shadow-md z-20">
                      <Check className="w-3 h-3 text-[#0a150e]" />
                    </span>
                  )}
                  <RealisticEmblem
                    icon={stop.icon}
                    size="lg"
                    variant={isCurrent ? 'gold' : isUnlocked ? 'emerald' : 'obsidian'}
                    showHalo={isCurrent}
                    className={`transition-all duration-500 ${isCurrent ? 'scale-110' : !isUnlocked ? 'opacity-50 grayscale' : ''}`}
                  />
                </div>

                {/* Node Info */}
                <div className="mt-6 text-center space-y-1.5 flex flex-col items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase ${
                    isCurrent ? 'bg-[var(--accent-main)]/20 text-[var(--accent-main)]' : 
                    isUnlocked ? 'bg-[#34d399]/20 text-[#34d399]' : 
                    'bg-[#1a3625] text-[#5c7566]'
                  }`}>
                    Level {stop.level}
                  </span>
                  <h4 className={`text-sm font-bold font-['Cinzel'] ${
                    isCurrent ? 'text-[#f5ebd7]' :
                    isUnlocked ? 'text-[#d4e4da]' :
                    'text-[#5c7566]'
                  }`}>
                    {stop.name}
                  </h4>
                  <p className="text-[10px] text-[#8da696] max-w-[150px] leading-relaxed">
                    {isUnlocked ? stop.description : isNext ? `Requires ${stop.minXp} XP` : 'Locked'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
