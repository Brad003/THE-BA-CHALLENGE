import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Key,
  Users,
  Swords,
  Trophy,
  ArrowRight,
  Flame,
  Lock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { BrotherhoodCircle, CircleFocusCategory } from '../../../types';
import { CrestIconRenderer } from './CrestIconRenderer';
import { CreateCircleModal } from './CreateCircleModal';
import { JoinCircleModal } from './JoinCircleModal';
import { CircleDetailView } from './CircleDetailView';

export const BrotherhoodCirclesTab: React.FC = () => {
  const {
    user,
    brotherhoodCircles,
    activeCircleId,
    setActiveCircleId,
    createBrotherhoodCircle
  } = useApp();

  const [filterMode, setFilterMode] = useState<'my' | 'all'>('my');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // If a circle is active, display its dedicated Circle Hub
  const activeCircle = brotherhoodCircles.find((c) => c.id === activeCircleId);
  if (activeCircle) {
    return (
      <CircleDetailView
        circle={activeCircle}
        onBack={() => setActiveCircleId(null)}
      />
    );
  }

  // Filter circles
  const currentUserId = user.id || 'current-user';
  const displayedCircles = brotherhoodCircles.filter((circle) => {
    const isMember = circle.members.some(
      (m) =>
        m.isCurrentUser ||
        m.id === currentUserId ||
        m.name === user.fullName
    );

    if (filterMode === 'my' && !isMember) return false;
    if (selectedCategory !== 'all' && circle.focusCategory !== selectedCategory) return false;

    return true;
  });

  const myCirclesCount = brotherhoodCircles.filter((c) =>
    c.members.some(
      (m) =>
        m.isCurrentUser ||
        m.id === currentUserId ||
        m.name === user.fullName
    )
  ).length;

  return (
    <div className="space-y-6 text-[#f4f1ea]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#234e32] bg-gradient-to-r from-[#0a1810] via-[#0e2417] to-[#0a1810] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#163a24] text-[#86efac] border border-[#2c6e43] flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Private & Invite-Only
              </span>
              <span className="text-xs text-[#718d7c]">
                Panther Brotherhood Protocol
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-[#f5ebd7]">
              Brotherhood Circles
            </h2>

            <p className="text-xs sm:text-sm text-[#8ca595] leading-relaxed">
              Form private groups with trusted brothers. Set custom fitness challenges, hold each other accountable to daily discipline, and battle on dedicated member leaderboards.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2.5 bg-[#122b1c] hover:bg-[#1a3d28] border border-[#285d38] text-[#86efac] font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all"
            >
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Enter Invite Code</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-xs rounded-xl shadow-lg shadow-green-950/40 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Forge New Circle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#183122] pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterMode('my')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterMode === 'my'
                ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
                : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>My Circles ({myCirclesCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterMode === 'all'
                ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
                : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Explore All Circles ({brotherhoodCircles.length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {['all', 'Trail & Altitude', 'Strength & Calisthenics', 'Dawn Discipline'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1b432b] text-[#86efac] font-bold border border-[#30784d]'
                  : 'text-[#6f8b7b] hover:text-[#a7c4b1]'
              }`}
            >
              {cat === 'all' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Circles Grid */}
      {displayedCircles.length === 0 ? (
        <div className="p-10 text-center bg-[#09150e] border border-[#1b3b27] rounded-3xl space-y-4">
          <Shield className="w-12 h-12 text-[#4ade80] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#f5ebd7]">
            {filterMode === 'my' ? 'No Circles Joined Yet' : 'No Circles Found'}
          </h3>
          <p className="text-xs text-[#718d7c] max-w-md mx-auto">
            {filterMode === 'my'
              ? 'You have not joined any private circles yet. Forge your own circle or enter a code from an athlete brother.'
              : 'Try changing the discipline filter or create a new circle.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-[#143221] hover:bg-[#1e4a31] border border-[#29603c] text-[#86efac] text-xs font-bold rounded-xl transition-all"
            >
              Enter Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-bold rounded-xl transition-all"
            >
              Forge Circle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCircles.map((circle) => {
            const isMember = circle.members.some(
              (m) =>
                m.isCurrentUser ||
                m.id === currentUserId ||
                m.name === user.fullName
            );
            const activeChallengesCount = circle.challenges.filter(
              (ch) => ch.status === 'active'
            ).length;

            return (
              <div
                key={circle.id}
                onClick={() => setActiveCircleId(circle.id)}
                className="group relative bg-[#09150e] hover:bg-[#0c1c13] border border-[#1b3b27] hover:border-[#2d6842] rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between"
              >
                {/* Top Row: Crest & Tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${circle.themeColor}15`,
                        borderColor: `${circle.themeColor}50`
                      }}
                    >
                      <CrestIconRenderer
                        icon={circle.crestIcon}
                        themeColor={circle.themeColor}
                        size="md"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isMember && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#143d25] text-[#86efac] border border-[#2a6841]">
                          Member
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-[#718d7c] border border-[#1b3b27] flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        Private
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#86efac] uppercase tracking-wider block">
                      {circle.focusCategory}
                    </span>
                    <h3 className="text-lg font-bold font-['Cinzel'] text-[#f5ebd7] group-hover:text-white transition-colors line-clamp-1 mt-0.5">
                      {circle.name}
                    </h3>
                    <p className="text-xs text-[#8ca595] italic line-clamp-1 mt-1">
                      &ldquo;{circle.tagline}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs text-[#718d7c] line-clamp-2 leading-relaxed">
                    {circle.description}
                  </p>
                </div>

                {/* Bottom Stats & Enter Hub */}
                <div className="pt-4 mt-4 border-t border-[#162f1f] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-[#86efac]">
                      <Swords className="w-3.5 h-3.5" />
                      <span className="font-bold">
                        {activeChallengesCount} Active {activeChallengesCount === 1 ? 'Challenge' : 'Challenges'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-[#718d7c]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{circle.members.length} Brothers</span>
                    </div>
                  </div>

                  {/* Avatars stack */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                      {circle.members.slice(0, 4).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="inline-block w-7 h-7 rounded-full ring-2 ring-[#09150e] object-cover"
                        />
                      ))}
                      {circle.members.length > 4 && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#132d1e] text-[10px] font-bold text-[#86efac] ring-2 ring-[#09150e]">
                          +{circle.members.length - 4}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-bold text-[#86efac] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Enter Hub</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateCircleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(circleData) => {
          createBrotherhoodCircle(circleData);
        }}
      />

      <JoinCircleModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinedSuccess={(circleId) => {
          setActiveCircleId(circleId);
        }}
      />
    </div>
  );
};
