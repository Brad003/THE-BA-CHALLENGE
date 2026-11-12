import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PANTHER_LEVELS } from '../../data/initialData';
import { CheckCircle2, Lock, Sparkles, Target, Trophy, Map } from 'lucide-react';
import { RealisticEmblem } from '../common/RealisticEmblem';

const LEVEL_ARTIFACTS: Record<number, { name: string, description: string, icon: string, color: string }> = {
  1: { name: "The Cub's Claws", description: 'Your first set of tools. Raw and unpolished.', icon: 'claw', color: 'text-stone-400' },
  2: { name: "The Tracker's Compass", description: 'Finding the path in the noise.', icon: 'compass', color: 'text-emerald-400' },
  3: { name: "Hunter's Fang", description: 'Sharp, relentless, and decisive.', icon: 'zap', color: 'text-amber-400' },
  4: { name: "Panther's Eye", description: 'Vision beyond the immediate struggle.', icon: 'panther', color: 'text-[var(--accent-main)]' },
  5: { name: "Alpha's Crown", description: 'Leadership forged in discipline.', icon: 'crown', color: 'text-yellow-500' },
  6: { name: "Pride's Shield", description: 'Protecting the culture of the brotherhood.', icon: 'shield', color: 'text-indigo-400' },
  7: { name: 'Legacy Totem', description: 'An eternal mark left on the world.', icon: 'tree', color: 'text-purple-400' },
};

export const ProfileProgressionMap: React.FC = () => {
  const { user } = useApp();
  const [selectedArtifact, setSelectedArtifact] = useState<number | null>(null);
  
  if (!user) return null;

  return (
    <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-6 overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
            Artifact Progression Map
          </h2>
        </div>
      </div>
      
      <p className="text-xs text-[#8ea496]">
        As you advance through the Panther ranks, unique digital artifacts are unearthed. Click on an unlocked tier to inspect your artifact.
      </p>

      <div className="relative pt-4 pb-8 pl-4 sm:pl-12">
        {/* Vertical Timeline Line */}
        <div className="absolute left-9 sm:left-[4.25rem] top-8 bottom-12 w-1 bg-[#14261b] rounded-full z-0" />
        
        <div className="space-y-10 relative z-10">
          {PANTHER_LEVELS.map((lvl, index) => {
            const isReached = user.pantherLevel >= lvl.id;
            const isCurrent = user.pantherLevel === lvl.id;
            const artifact = LEVEL_ARTIFACTS[lvl.id];
            
            return (
              <div key={lvl.id} className="flex items-start gap-4 sm:gap-6 relative group">
                
                {/* Active Line Overlay */}
                {isReached && index < PANTHER_LEVELS.length - 1 && (
                  <div className="absolute left-5 sm:left-[3.25rem] top-12 w-1 h-14 bg-[var(--accent-main)] z-0 rounded-full" />
                )}

                {/* Node Symbol */}
                <div 
                  className="relative z-10 cursor-pointer"
                  onClick={() => isReached && setSelectedArtifact(selectedArtifact === lvl.id ? null : lvl.id)}
                >
                  <RealisticEmblem
                    icon={lvl.badgeIcon}
                    size="md"
                    variant={isCurrent ? 'gold' : isReached ? 'emerald' : 'obsidian'}
                    showHalo={isCurrent}
                    className={`transition-all duration-500 ${isCurrent ? 'scale-110' : !isReached ? 'opacity-50 grayscale' : ''}`}
                  />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-main)] rounded-full animate-bounce shadow-md flex items-center justify-center z-20">
                      <Target className="w-2.5 h-2.5 text-[#0a140e]" />
                    </span>
                  )}
                  {isReached && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#34d399] rounded-full shadow-md flex items-center justify-center z-20">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#0a140e]" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pt-1 sm:pt-2 transition-all duration-300 ${isReached ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase ${
                        isCurrent ? 'bg-[var(--accent-main)]/20 text-[var(--accent-main)]' : 
                        isReached ? 'bg-[#34d399]/20 text-[#34d399]' : 
                        'bg-[#1a3625] text-[#5c7566]'
                      }`}>
                        Level {lvl.id}
                      </span>
                      <h4 className={`text-sm sm:text-base font-bold font-['Cinzel'] mt-1 ${isCurrent ? 'text-[#f5ebd7]' : isReached ? 'text-[#d4e4da]' : 'text-[#5c7566]'}`}>
                        {lvl.name}
                      </h4>
                    </div>
                    {isReached && (
                      <button 
                        onClick={() => setSelectedArtifact(selectedArtifact === lvl.id ? null : lvl.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          selectedArtifact === lvl.id ? 'bg-[#1a3825] border-[var(--accent-main)]' : 'bg-[#0c1811] border-[#1f422b] hover:border-[#2f6341]'
                        }`}
                      >
                        <Trophy className={`w-4 h-4 ${selectedArtifact === lvl.id ? 'text-[var(--accent-main)]' : 'text-[#8ea496]'}`} />
                      </button>
                    )}
                    {!isReached && (
                      <div className="p-2 rounded-xl bg-[#0a110d] border border-[#142318]">
                        <Lock className="w-4 h-4 text-[#3f5f4b]" />
                      </div>
                    )}
                  </div>
                  
                  {/* Artifact Expansion Area */}
                  {isReached && selectedArtifact === lvl.id && (
                    <div className="mt-4 p-4 bg-[#0a140e] border border-[var(--accent-main)]/30 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                      <RealisticEmblem
                        icon={artifact.icon}
                        size="lg"
                        variant="gold"
                        showHalo
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                          <h5 className="font-bold text-[#f5ebd7] text-xs uppercase tracking-wide">Artifact Unlocked</h5>
                        </div>
                        <p className="text-[13px] font-['Cinzel'] font-bold text-[var(--accent-main)] mt-1">{artifact.name}</p>
                        <p className="text-[11px] text-[#8ea496] leading-relaxed mt-0.5">{artifact.description}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-[11px] text-[#8da696] mt-2 line-clamp-2">
                    {lvl.tagline}
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
