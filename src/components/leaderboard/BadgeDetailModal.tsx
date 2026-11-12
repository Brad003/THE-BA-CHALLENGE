import React from 'react';
import { LeaderboardBadge, LeaderboardMember, UserProfile } from '../../types';
import {
  X,
  ShieldCheck,
  Target,
  Award,
  Flame,
  Zap,
  Footprints,
  Crown,
  Trophy,
  Swords,
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface BadgeDetailModalProps {
  badge: LeaderboardBadge | null;
  onClose: () => void;
  members: LeaderboardMember[];
  user: UserProfile;
  onSendCheer?: (memberId: string, memberName: string) => void;
  onSendChallenge?: (member: LeaderboardMember) => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  onClose,
  members,
  user,
  onSendCheer,
  onSendChallenge
}) => {
  if (!badge) return null;

  const currentHolders = members.filter(m => m.badges?.some(b => b.id === badge.id));
  const userMember = members.find(m => m.isCurrentUser);
  const userHasBadge = userMember?.badges?.some(b => b.id === badge.id);

  const getIcon = () => {
    switch (badge.iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-10 h-10 text-yellow-400" />;
      case 'Target':
        return <Target className="w-10 h-10 text-slate-300" />;
      case 'Award':
        return <Award className="w-10 h-10 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-10 h-10 text-orange-400 fill-orange-500/30 animate-pulse" />;
      case 'Zap':
        return <Zap className="w-10 h-10 text-amber-300 fill-amber-400/20" />;
      case 'Footprints':
        return <Footprints className="w-10 h-10 text-teal-300" />;
      default:
        return <Crown className="w-10 h-10 text-yellow-400" />;
    }
  };

  const isConsistency = badge.category === 'Consistency';
  const isChampion = badge.tier === 'champion';

  // Calculate user progress towards this specific badge
  let userProgressVal = 0;
  let targetVal = 1;
  let metricLabel = '';

  if (badge.id === 'iron-discipline') {
    const leader = members.find(m => m.disciplineRank === 1);
    targetVal = leader?.workouts || 90;
    userProgressVal = userMember?.workouts || 0;
    metricLabel = `${userProgressVal} / ${targetVal} Workouts (Rank #${userMember?.disciplineRank || '?'})`;
  } else if (badge.id === 'discipline-stalwart') {
    targetVal = 15;
    userProgressVal = userMember?.workouts || 0;
    metricLabel = `${userProgressVal} / 15 Monthly Workouts`;
  } else if (badge.id === 'iron-will') {
    targetVal = 10;
    userProgressVal = userMember?.workouts || 0;
    metricLabel = `${userProgressVal} / 10 Workouts (${userMember?.disciplineAdherencePercent || 0}% Adherence)`;
  } else if (badge.id === 'unbroken-flame') {
    const leader = members.find(m => m.consistencyRank === 1);
    targetVal = leader?.streak || 30;
    userProgressVal = userMember?.streak || 0;
    metricLabel = `${userProgressVal} / ${targetVal} Days Streak (Rank #${userMember?.consistencyRank || '?'})`;
  } else if (badge.id === 'streak-sentinel') {
    targetVal = 14;
    userProgressVal = userMember?.streak || 0;
    metricLabel = `${userProgressVal} / 14 Unbroken Days`;
  } else if (badge.id === 'daily-devotee') {
    targetVal = 7;
    userProgressVal = userMember?.streak || 0;
    metricLabel = `${userProgressVal} / 7 Unbroken Days`;
  }

  const progressPercent = Math.min(100, Math.round((userProgressVal / targetVal) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a140e] border border-[#1b3e27] rounded-3xl p-6 shadow-2xl text-[#f4f1ea] space-y-5 overflow-hidden">
        {/* Glow ambient background */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: badge.glowColor }}
        />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3.5">
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-center shadow-lg ${
                isChampion
                  ? isConsistency
                    ? 'bg-orange-950/80 border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    : 'bg-yellow-950/80 border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'bg-[#122218] border-[#254b34]'
              }`}
            >
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    isConsistency
                      ? 'bg-orange-950/60 border-orange-500/60 text-orange-300'
                      : 'bg-yellow-950/60 border-yellow-500/60 text-yellow-300'
                  }`}
                >
                  {badge.category} Honors
                </span>
                <span className="text-[10px] uppercase font-bold text-[#7d9987]">
                  • {badge.tier.toUpperCase()} TIER
                </span>
              </div>
              <h3 className="text-xl font-bold font-['Cinzel'] text-[#f5ebd7] mt-0.5 flex items-center space-x-1.5">
                <span>{badge.title}</span>
                {isChampion && <Crown className="w-4 h-4 text-yellow-400" />}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#102016] text-[#7d9987] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description & Lore */}
        <div className="p-4 rounded-2xl bg-[#070f0a] border border-[#16301f] text-xs text-[#cad6cf] leading-relaxed relative z-10">
          <p className="font-medium">{badge.description}</p>
          <div className="mt-3 pt-2.5 border-t border-[#13271a] flex items-center space-x-2 text-[11px] text-[var(--accent-main)] font-bold">
            <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Criteria: {badge.shortCriteria}</span>
          </div>
        </div>

        {/* User Progress Toward this Badge */}
        <div className="p-4 rounded-2xl bg-[#0e1d14] border border-[#1e4029] space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#f5ebd7] flex items-center space-x-1.5">
              <span>Your Standing</span>
              {userHasBadge && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>EARNED</span>
                </span>
              )}
            </span>
            <span className="font-mono text-xs font-bold text-[#86efac]">
              {metricLabel}
            </span>
          </div>

          <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                userHasBadge
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  : 'bg-gradient-to-r from-[var(--accent-main)] to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#7d9987] mt-1">
            {userHasBadge
              ? 'You currently hold this badge! Continue your discipline to defend it from other pride members.'
              : `${progressPercent}% achieved toward this honor. Keep pushing your training.`}
          </p>
        </div>

        {/* Current Pride Holders */}
        <div className="space-y-2 relative z-10">
          <h4 className="text-[11px] font-bold text-[#7d9987] uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3 text-[var(--accent-main)]" />
            <span>Current Pride Holders ({currentHolders.length})</span>
          </h4>

          {currentHolders.length === 0 ? (
            <div className="p-3 rounded-xl bg-[#070f0a] border border-[#14261b] text-center text-xs text-[#7d9987]">
              No members currently meet this standard. Be the first to claim it!
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {currentHolders.map(holder => (
                <div
                  key={holder.id}
                  className="p-3 rounded-xl bg-[#09150e] border border-[#162f1e] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={holder.avatar}
                      alt={holder.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#264b32]"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-[#f5ebd7]">{holder.name}</span>
                        {holder.isCurrentUser && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7d9987]">
                        {isConsistency
                          ? `${holder.streak} Day Active Streak`
                          : `${holder.workouts} Workouts • ${holder.disciplineAdherencePercent}% Adherence`}
                      </span>
                    </div>
                  </div>

                  {!holder.isCurrentUser && (
                    <div className="flex items-center space-x-1.5">
                      {onSendCheer && (
                        <button
                          type="button"
                          onClick={() => onSendCheer(holder.id, holder.name)}
                          title="Cheer brother"
                          className="p-1.5 rounded-lg bg-[#112419] hover:bg-[#1a3826] text-[var(--accent-main)] transition-colors"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onSendChallenge && (
                        <button
                          type="button"
                          onClick={() => onSendChallenge(holder)}
                          className="px-2.5 py-1 rounded-lg bg-[#1a140d] border border-amber-500/40 text-[10px] font-bold text-amber-300 hover:bg-amber-950/60 transition-colors flex items-center space-x-1"
                        >
                          <Swords className="w-3 h-3" />
                          <span>Challenge</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-[#5c7365] pt-1 border-t border-[#13261a]">
          Honoring character, consistency, and brotherhood accountability.
        </p>
      </div>
    </div>
  );
};
