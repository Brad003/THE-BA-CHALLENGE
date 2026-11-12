import React from 'react';
import { useApp } from '../../context/AppContext';
import { PantherLogoIcon } from './PantherSilhouette';
import { Bell, Shield, TreePine, HeartPulse, UserCheck, Flame, Trophy, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    unreadNotificationCount,
    setShowNotificationsModal,
    setShowWellnessModal,
    setShowGreenLegacyModal,
    setShowLeaderboardModal,
    setShowAdminModal,
    setShowPremiumModal,
    isPremium,
    setActiveTab
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#080d0a]/90 backdrop-blur-md border-b border-[#18281f]">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand identity */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
          id="btn-header-home"
        >
          <div className="relative">
            <PantherLogoIcon size={34} className="transition-transform group-hover:scale-105" />
            <div className="absolute -inset-1 bg-[var(--accent-main)]/10 rounded-full blur-sm -z-10 group-hover:bg-[var(--accent-main)]/20 transition-all" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-['Cinzel'] tracking-widest font-bold text-lg text-[#f4f1ea] leading-tight">
                PANTHER
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#132d20] text-[var(--accent-main)] border border-[#234d35]">
                BA
              </span>
            </div>
            <p className="text-[10px] text-[#8ea496] tracking-wider uppercase font-medium">
              The BA Challenge
            </p>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak pill */}
          <div
            onClick={() => setActiveTab('challenges')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#111c14] border border-[#23422e] cursor-pointer hover:border-[var(--accent-main)]/60 transition-colors"
            title="Current Panther Streak"
            id="header-streak-pill"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 animate-pulse" />
            <span className="text-xs font-bold text-[#f5ebd7]">{user.streak.current}d</span>
          </div>

          {/* Green Legacy Quick Shortcut */}
          <button
            onClick={() => setShowGreenLegacyModal(true)}
            className="hidden xs:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0a1e13] border border-[#1b432a] text-[#86efac] hover:bg-[#112d1b] transition-colors"
            title="My Green Legacy"
            id="btn-header-green-legacy"
          >
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold">{user.treesPlanted} Trees</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="p-2 rounded-xl bg-[#111913] hover:bg-[#19271e] text-[#d4af37] border border-[#233829] transition-colors"
            title="Brothers Leaderboard"
            id="btn-header-leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Panther Apex Membership Button */}
          <button
            onClick={() => setShowPremiumModal(true)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border transition-all ${
              isPremium
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                : 'bg-[#122417] border-[#224730] text-[#8ea496] hover:text-amber-300 hover:border-amber-400/50'
            }`}
            title="Panther Apex Membership (3D Maps & Deep Analytics)"
            id="btn-header-apex"
          >
            <Crown className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-400 fill-amber-400' : 'text-amber-400/80'}`} />
            <span className="text-xs font-bold font-mono">
              {isPremium ? 'APEX' : 'PRO'}
            </span>
          </button>

          {/* Wellness Sanctuary ("Strong Men Speak") */}
          <button
            onClick={() => setShowWellnessModal(true)}
            className="p-2 rounded-xl bg-[#111913] hover:bg-[#19271e] text-[#93c5fd] border border-[#233829] transition-colors"
            title="Men's Wellness: Strong Men Speak"
            id="btn-header-wellness"
          >
            <HeartPulse className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="relative p-2 rounded-xl bg-[#111913] hover:bg-[#19271e] text-[#c5ceca] border border-[#233829] transition-colors"
            title="Notifications"
            id="btn-header-notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-main)] text-[#07120a] font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Coach / Admin Dashboard Toggle */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#182a1e] hover:bg-[#203928] text-[#d8c187] border border-[var(--accent-main)]/40 transition-colors"
            title="Coach & BA Admin Portal"
            id="btn-header-admin"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--accent-main)]" />
            <span className="text-xs font-semibold hidden sm:inline">Coach Portal</span>
          </button>
        </div>
      </div>

      {/* Core Brotherhood Philosophy Tagline */}
      <div className="bg-[#050906] border-t border-[#132218] px-4 py-1 flex items-center justify-center">
        <span className="text-[11px] text-[var(--accent-main)] tracking-widest uppercase font-semibold text-center flex items-center space-x-2">
          <span>“We don't leave any man behind.”</span>
          <span className="text-[#597463] text-[9px] hidden md:inline">|</span>
          <span className="text-[#88a594] text-[10px] font-normal hidden md:inline tracking-wider">
            Train. Track. Connect. Conquer.
          </span>
        </span>
      </div>
    </header>
  );
};
