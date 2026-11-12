import React from 'react';
import { LeaderboardBadge } from '../../types';
import {
  ShieldCheck,
  Target,
  Award,
  Flame,
  Zap,
  Footprints,
  Crown
} from 'lucide-react';

interface LeaderboardBadgeBadgeProps {
  badge: LeaderboardBadge;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const LeaderboardBadgeBadge: React.FC<LeaderboardBadgeBadgeProps> = ({
  badge,
  size = 'sm',
  showCategory = false,
  onClick,
  interactive = true
}) => {
  const getIcon = () => {
    const iconClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
    switch (badge.iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={`${iconClass} text-yellow-400`} />;
      case 'Target':
        return <Target className={`${iconClass} text-slate-300`} />;
      case 'Award':
        return <Award className={`${iconClass} text-emerald-400`} />;
      case 'Flame':
        return <Flame className={`${iconClass} text-orange-400 fill-orange-500/30 animate-pulse`} />;
      case 'Zap':
        return <Zap className={`${iconClass} text-amber-300 fill-amber-400/20`} />;
      case 'Footprints':
        return <Footprints className={`${iconClass} text-teal-300`} />;
      default:
        return <Crown className={`${iconClass} text-yellow-400`} />;
    }
  };

  const isChampion = badge.tier === 'champion';
  const isConsistency = badge.category === 'Consistency';

  if (size === 'lg') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!interactive}
        className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-bold transition-all ${
          isChampion
            ? isConsistency
              ? 'bg-gradient-to-r from-orange-950/80 to-amber-950/60 border-orange-500/80 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.35)]'
              : 'bg-gradient-to-r from-yellow-950/80 to-amber-950/60 border-yellow-500/80 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.35)]'
            : badge.tier === 'silver'
            ? 'bg-slate-900/80 border-slate-400/60 text-slate-200'
            : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
        } ${interactive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
      >
        <div className="p-1 rounded-lg bg-black/50 border border-white/10">
          {getIcon()}
        </div>
        <div className="text-left">
          <div className="flex items-center space-x-1">
            <span className="font-bold tracking-tight">{badge.title}</span>
            {isChampion && <span className="text-[10px]">👑</span>}
          </div>
          {showCategory && (
            <span className="text-[9px] uppercase tracking-wider block opacity-75">
              {badge.category} • {badge.tier}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      title={`${badge.title} (${badge.category}): ${badge.shortCriteria}`}
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-wide transition-all ${
        isChampion
          ? isConsistency
            ? 'bg-orange-950/80 border-orange-500/70 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.25)]'
            : 'bg-yellow-950/80 border-yellow-500/70 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.25)]'
          : badge.tier === 'silver'
          ? 'bg-[#11161d] border-slate-400/50 text-slate-300'
          : 'bg-[#0a1811] border-emerald-500/40 text-emerald-300'
      } ${interactive ? 'hover:brightness-125 cursor-pointer' : ''}`}
    >
      {getIcon()}
      <span className="truncate max-w-[110px]">{badge.title}</span>
      {isChampion && <span className="text-[9px]">👑</span>}
    </button>
  );
};
