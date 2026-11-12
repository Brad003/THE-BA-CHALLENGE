import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, TreePine, Leaf, Award, Globe, Users, PlusCircle } from 'lucide-react';

export const GreenLegacyModal: React.FC = () => {
  const {
    showGreenLegacyModal,
    setShowGreenLegacyModal,
    user,
    plantTrees,
    environmentalChallenges
  } = useApp();

  const [treeInput, setTreeInput] = useState<number>(5);

  if (!showGreenLegacyModal) return null;

  const handlePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (treeInput <= 0) return;
    plantTrees(treeInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#06110a] border border-[#1b3e2a] rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14291c] pb-3 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#0f2d1c] text-[#86efac] border border-[#225838]">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#86efac] uppercase tracking-widest">
                THE BA CHALLENGE ENVIRONMENTAL PILLAR
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
                Panthers For The Planet
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowGreenLegacyModal(false)}
            className="p-1.5 rounded-full bg-[#0d1c13] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personal Counter Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0d2618] via-[#153c26] to-[#0d2618] border border-[#27643e] shadow-xl text-center space-y-2 relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#86efac]">
            MY GREEN LEGACY
          </span>
          <div className="flex items-center justify-center space-x-3">
            <TreePine className="w-8 h-8 sm:w-10 sm:h-10 text-[#86efac]" />
            <span className="text-4xl sm:text-5xl font-black text-[#86efac]">
              {user.treesPlanted}
            </span>
            <span className="text-lg font-bold text-[#f5ebd7]">Trees Planted</span>
          </div>
          <p className="text-xs text-[#a0c2ad] max-w-md mx-auto">
            Directly absorbing atmospheric CO2, replenishing water catchments, and restoring indigenous African forest canopies.
          </p>
        </div>

        {/* Tree Planting Logger */}
        <form
          onSubmit={handlePlant}
          className="mt-5 p-4 rounded-2xl bg-[#0b1b11] border border-[#1d3d29] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h4 className="text-xs font-bold text-[#e6f0ea]">Plant or Adopt Seedlings</h4>
            <p className="text-[11px] text-[#7d9987]">
              Each tree grants +50 XP and fortifies your Green Legacy badge
            </p>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <input
              type="number"
              min="1"
              max="100"
              value={treeInput}
              onChange={(e) => setTreeInput(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-1.5 rounded-xl bg-[#08130c] border border-[#21432e] text-xs font-bold text-center text-[#f4f1ea] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1b5336] hover:bg-[#236a45] text-xs font-bold text-[#86efac] border border-[#2d7e53] flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>LOG TREES</span>
            </button>
          </div>
        </form>

        {/* Active Group Environmental Challenges */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#86efac]" />
            <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
              BA Pride Environmental Expeditions
            </h3>
          </div>

          <div className="space-y-2.5">
            {environmentalChallenges.map((challenge) => {
              const pct = Math.round((challenge.currentTrees / challenge.targetTrees) * 100);
              return (
                <div
                  key={challenge.id}
                  className="p-4 rounded-2xl bg-[#09150d] border border-[#193623] space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#f5ebd7]">{challenge.title}</h4>
                      <p className="text-[10px] text-[#738f7d]">
                        {challenge.location} • Target: {challenge.deadline}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#86efac] font-mono">{pct}%</span>
                  </div>

                  <div className="w-full bg-[#0d1f14] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1b5336] to-[#4ade80] h-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#7d9987]">
                    <span>
                      {challenge.currentTrees.toLocaleString()} /{' '}
                      {challenge.targetTrees.toLocaleString()} Seedlings
                    </span>
                    <span>{challenge.participants} Panthers participating</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
