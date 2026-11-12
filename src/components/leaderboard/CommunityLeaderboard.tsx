import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaderboardBadge, LeaderboardMember } from '../../types';
import {
  computeLeaderboardMembers,
  getDisciplineChampion,
  getConsistencyChampion,
  getUserRivalryInsights,
  LEADERBOARD_BADGES
} from '../../utils/leaderboardBadges';
import { LeaderboardBadgeBadge } from './LeaderboardBadgeBadge';
import { BadgeDetailModal } from './BadgeDetailModal';
import {
  Trophy,
  Flame,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  Swords,
  HeartHandshake,
  Sparkles,
  Award,
  Crown,
  Target,
  Zap,
  Footprints,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';

interface CommunityLeaderboardProps {
  onClose?: () => void;
  isModalView?: boolean;
}

export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  onClose,
  isModalView = false
}) => {
  const { user, updateUserProfile, addNotification } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'consistency' | 'discipline' | 'hallOfFame'>('all');
  const [selectedBadge, setSelectedBadge] = useState<LeaderboardBadge | null>(null);
  const [cheerOverrides, setCheerOverrides] = useState<Record<string, number>>({});
  const [activeChallengeMember, setActiveChallengeMember] = useState<LeaderboardMember | null>(null);
  const [challengeMessage, setChallengeMessage] = useState<string>('Who can log the most trail miles this week? Game on!');
  const [challengeCategory, setChallengeCategory] = useState<'Discipline' | 'Consistency'>('Discipline');

  // Compute dynamic members and badges
  const members = useMemo(() => {
    return computeLeaderboardMembers(user, cheerOverrides);
  }, [user, cheerOverrides]);

  const userMember = useMemo(() => {
    return members.find(m => m.isCurrentUser) || members[0];
  }, [members]);

  const disciplineChampion = useMemo(() => getDisciplineChampion(members), [members]);
  const consistencyChampion = useMemo(() => getConsistencyChampion(members), [members]);
  const rivalryInsights = useMemo(() => getUserRivalryInsights(userMember, members), [userMember, members]);

  // Sort members based on active tab
  const sortedMembers = useMemo(() => {
    const list = [...members];
    if (filterType === 'consistency') {
      return list.sort((a, b) => (a.consistencyRank || 99) - (b.consistencyRank || 99));
    }
    if (filterType === 'discipline') {
      return list.sort((a, b) => (a.disciplineRank || 99) - (b.disciplineRank || 99));
    }
    // 'all' sorts by XP
    return list.sort((a, b) => (a.overallRank || 99) - (b.overallRank || 99));
  }, [members, filterType]);

  // Handle cheer / fist bump
  const handleSendCheer = (memberId: string, memberName: string) => {
    setCheerOverrides(prev => ({
      ...prev,
      [memberId]: (prev[memberId] || 0) + 1
    }));
    addNotification(
      'Cheered Brother! 👊',
      `You sent fist bumps and encouragement to ${memberName}. Iron sharpens iron!`,
      'community'
    );
  };

  // Handle send friendly challenge
  const handleConfirmChallenge = () => {
    if (!activeChallengeMember) return;
    addNotification(
      'Friendly Challenge Issued! ⚔️',
      `You challenged ${activeChallengeMember.name} in ${challengeCategory}: "${challengeMessage}"`,
      'challenge'
    );
    setActiveChallengeMember(null);
  };

  return (
    <div className="space-y-5 text-[#f4f1ea] select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#163121] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-950/80 to-[#102919] border border-amber-500/40 text-[var(--accent-main)] shadow-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest bg-amber-950/50 px-2 py-0.5 rounded border border-yellow-500/40">
                PRIDE HONORS & STANDINGS
              </span>
              <span className="text-[10px] text-[#7d9987] font-medium hidden sm:inline">
                • Friendly Brotherhood Competition
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-[#f5ebd7] mt-0.5">
              Discipline & Consistency Champions
            </h2>
          </div>
        </div>

        {/* Close Button if inside Modal */}
        {isModalView && onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-full bg-[#0d1c13] text-[#7d9987] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* TOP PERFORMERS SPOTLIGHT PODIUM (DISCIPLINE & CONSISTENCY CHAMPIONS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Discipline Champion Spotlight */}
        {disciplineChampion && (
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#121d14] via-[#09150d] to-[#040905] border-2 border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.15)] space-y-3">
            <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
              <ShieldCheck className="w-24 h-24 text-yellow-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-yellow-950/60 border border-yellow-500/50 text-yellow-300 text-[10px] font-black uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span>#1 Discipline Champion</span>
              </div>
              <span className="text-[10px] text-[#8ea496] font-mono">
                {disciplineChampion.cheersReceived || 0} Fist Bumps 👊
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={disciplineChampion.avatar}
                  alt={disciplineChampion.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-yellow-400/80 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#f5ebd7] truncate">
                  {disciplineChampion.name}
                </h3>
                <span className="text-[10px] text-yellow-400/90 font-semibold block">
                  {disciplineChampion.level}
                </span>
                <p className="text-[10px] text-[#8ea496] italic truncate mt-0.5">
                  {disciplineChampion.quote}
                </p>
              </div>
            </div>

            {/* Key Stats & Badge Pill */}
            <div className="p-3 rounded-2xl bg-black/50 border border-yellow-500/30 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#7d9987] block">Training Volume</span>
                <span className="font-mono text-sm font-bold text-yellow-300">
                  {disciplineChampion.workouts} Sessions • {disciplineChampion.disciplineAdherencePercent}% Adherence
                </span>
              </div>
              {disciplineChampion.badges?.find(b => b.category === 'Discipline') && (
                <LeaderboardBadgeBadge
                  badge={disciplineChampion.badges.find(b => b.category === 'Discipline')!}
                  size="md"
                  onClick={() => setSelectedBadge(disciplineChampion.badges!.find(b => b.category === 'Discipline')!)}
                />
              )}
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => handleSendCheer(disciplineChampion.id, disciplineChampion.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#162f1e] hover:bg-[#20442c] border border-[#2d613e] text-xs font-bold text-[#86efac] transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Cheer Brother</span>
              </button>
              {!disciplineChampion.isCurrentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeMember(disciplineChampion);
                    setChallengeCategory('Discipline');
                  }}
                  className="py-2 px-3 rounded-xl bg-yellow-950/40 hover:bg-yellow-950/70 border border-yellow-500/40 text-xs font-bold text-yellow-300 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Swords className="w-4 h-4" />
                  <span>Challenge</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Consistency Champion Spotlight */}
        {consistencyChampion && (
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#1c140d] via-[#140d07] to-[#080402] border-2 border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.15)] space-y-3">
            <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
              <Flame className="w-24 h-24 text-orange-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-orange-950/60 border border-orange-500/50 text-orange-300 text-[10px] font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>#1 Consistency Champion</span>
              </div>
              <span className="text-[10px] text-[#8ea496] font-mono">
                {consistencyChampion.cheersReceived || 0} Fist Bumps 👊
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={consistencyChampion.avatar}
                  alt={consistencyChampion.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-400/80 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-orange-500 border-2 border-black flex items-center justify-center shadow-lg">
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#f5ebd7] truncate">
                  {consistencyChampion.name}
                </h3>
                <span className="text-[10px] text-orange-400/90 font-semibold block">
                  {consistencyChampion.level}
                </span>
                <p className="text-[10px] text-[#8ea496] italic truncate mt-0.5">
                  {consistencyChampion.quote}
                </p>
              </div>
            </div>

            {/* Key Stats & Badge Pill */}
            <div className="p-3 rounded-2xl bg-black/50 border border-orange-500/30 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#7d9987] block">Unbroken Streak</span>
                <span className="font-mono text-sm font-bold text-orange-300 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{consistencyChampion.streak} Days Active</span>
                </span>
              </div>
              {consistencyChampion.badges?.find(b => b.category === 'Consistency') && (
                <LeaderboardBadgeBadge
                  badge={consistencyChampion.badges.find(b => b.category === 'Consistency')!}
                  size="md"
                  onClick={() => setSelectedBadge(consistencyChampion.badges!.find(b => b.category === 'Consistency')!)}
                />
              )}
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => handleSendCheer(consistencyChampion.id, consistencyChampion.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#2b1b11] hover:bg-[#3d2719] border border-[#52331f] text-xs font-bold text-amber-300 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Cheer Brother</span>
              </button>
              {!consistencyChampion.isCurrentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeMember(consistencyChampion);
                    setChallengeCategory('Consistency');
                  }}
                  className="py-2 px-3 rounded-xl bg-orange-950/40 hover:bg-orange-950/70 border border-orange-500/40 text-xs font-bold text-orange-300 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Swords className="w-4 h-4" />
                  <span>Challenge</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* USER'S PERSONAL BADGES & RIVALRY BENCHMARK */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1c14] to-[#09150e] border border-[#1e442c] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#142e1d] border border-[#245936] flex items-center justify-center text-[#86efac]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider block">
                YOUR STANDING & BADGES
              </span>
              <span className="text-xs font-bold text-[#f5ebd7]">
                Rank #{userMember.disciplineRank} in Discipline • Rank #{userMember.consistencyRank} in Consistency
              </span>
            </div>
          </div>

          {/* User's Badges Chips */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            {userMember.badges && userMember.badges.length > 0 ? (
              userMember.badges.map(b => (
                <LeaderboardBadgeBadge
                  key={b.id}
                  badge={b}
                  size="sm"
                  onClick={() => setSelectedBadge(b)}
                />
              ))
            ) : (
              <span className="text-[11px] text-[#7d9987] italic">
                No active leaderboard badges yet. Build your streak or workouts!
              </span>
            )}
          </div>
        </div>

        {/* Motivational Rivalry Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#163321] text-xs">
          <div className="flex items-start space-x-2 text-[#cad8cf]">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <span className="text-[11px]">{rivalryInsights.disciplineTip}</span>
          </div>
          <div className="flex items-start space-x-2 text-[#cad8cf]">
            <Flame className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
            <span className="text-[11px]">{rivalryInsights.consistencyTip}</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142a1b] pb-3 overflow-x-auto whitespace-nowrap text-xs">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441] shadow-sm'
                : 'text-[#7d9987] hover:text-white'
            }`}
          >
            All Standings
          </button>
          <button
            type="button"
            onClick={() => setFilterType('discipline')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              filterType === 'discipline'
                ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/70 shadow-sm'
                : 'text-[#7d9987] hover:text-yellow-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span>Discipline Leaders</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('consistency')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              filterType === 'consistency'
                ? 'bg-orange-950/80 text-orange-300 border border-orange-500/70 shadow-sm'
                : 'text-[#7d9987] hover:text-orange-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Consistency Leaders</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('hallOfFame')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              filterType === 'hallOfFame'
                ? 'bg-[#183d28] text-[var(--accent-main)] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badge Showcase (Hall of Fame)</span>
          </button>
        </div>

        {/* Privacy Setting Toggle */}
        <div className="flex items-center space-x-2 pl-2">
          <button
            type="button"
            onClick={() => updateUserProfile({ isPublicRanking: !user.isPublicRanking })}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#0c1811] hover:bg-[#13261b] text-[11px] font-bold text-[#86efac] border border-[#1b3d28] transition-colors"
          >
            {user.isPublicRanking ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Public Active</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Private Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VIEW: HALL OF FAME BADGE SHOWCASE */}
      {filterType === 'hallOfFame' ? (
        <div className="space-y-6">
          {/* Discipline Badges Category */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
                Discipline Honors (Character, Volume & Adherence)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(LEADERBOARD_BADGES)
                .filter(b => b.category === 'Discipline')
                .map(badge => {
                  const currentHolder = members.find(m => m.badges?.some(mb => mb.id === badge.id));
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className="p-4 rounded-2xl bg-[#09150e] border border-[#173321] hover:border-yellow-500/60 transition-all cursor-pointer space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <LeaderboardBadgeBadge badge={badge} size="md" interactive={false} />
                        <ChevronRight className="w-4 h-4 text-[#5c7766] group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-[#cad8cf] line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                      <div className="pt-2 border-t border-[#13271a] flex items-center justify-between text-[10px]">
                        <span className="text-[#7d9987]">Current Holder:</span>
                        <span className="font-bold text-[#f5ebd7]">
                          {currentHolder ? currentHolder.name : 'Unclaimed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Consistency Badges Category */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
                Consistency Honors (Daily Streaks & Unbroken Habit)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(LEADERBOARD_BADGES)
                .filter(b => b.category === 'Consistency')
                .map(badge => {
                  const currentHolder = members.find(m => m.badges?.some(mb => mb.id === badge.id));
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className="p-4 rounded-2xl bg-[#09150e] border border-[#173321] hover:border-orange-500/60 transition-all cursor-pointer space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <LeaderboardBadgeBadge badge={badge} size="md" interactive={false} />
                        <ChevronRight className="w-4 h-4 text-[#5c7766] group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-[#cad8cf] line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                      <div className="pt-2 border-t border-[#13271a] flex items-center justify-between text-[10px]">
                        <span className="text-[#7d9987]">Current Holder:</span>
                        <span className="font-bold text-[#f5ebd7]">
                          {currentHolder ? currentHolder.name : 'Unclaimed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW: STANDINGS TABLE */
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {sortedMembers.map((member, idx) => {
            const displayRank =
              filterType === 'discipline'
                ? member.disciplineRank || idx + 1
                : filterType === 'consistency'
                ? member.consistencyRank || idx + 1
                : idx + 1;

            const isTop3 = displayRank <= 3;

            return (
              <div
                key={member.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  member.isCurrentUser
                    ? 'bg-[#122a1b] border-yellow-500/70 shadow-[0_0_15px_rgba(201,151,56,0.2)]'
                    : 'bg-[#09140e] border-[#183122] hover:border-[#285038]'
                }`}
              >
                {/* Member Info */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                      displayRank === 1
                        ? 'bg-yellow-400 text-black shadow-md'
                        : displayRank === 2
                        ? 'bg-slate-300 text-black shadow-md'
                        : displayRank === 3
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-[#102016] text-[#7d9987]'
                    }`}
                  >
                    #{displayRank}
                  </div>

                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#264e34]"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#f5ebd7] truncate">
                        {member.name}
                      </h4>
                      {member.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#7d9987] block">
                      {member.level}
                    </span>
                  </div>
                </div>

                {/* Badges & Metrics Row */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 pl-10 sm:pl-0">
                  {/* Member Badges */}
                  <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                    {member.badges?.map(b => (
                      <LeaderboardBadgeBadge
                        key={b.id}
                        badge={b}
                        size="sm"
                        onClick={() => setSelectedBadge(b)}
                      />
                    ))}
                  </div>

                  {/* Primary Competitive Metric based on active filter */}
                  <div className="text-right flex-shrink-0">
                    {filterType === 'consistency' ? (
                      <div>
                        <div className="flex items-center space-x-1 justify-end text-xs font-bold text-orange-300 font-mono">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>{member.streak} Days</span>
                        </div>
                        <span className="text-[9px] text-[#6b8575] block">
                          Best: {member.longestStreak || member.streak}d
                        </span>
                      </div>
                    ) : filterType === 'discipline' ? (
                      <div>
                        <div className="flex items-center space-x-1 justify-end text-xs font-bold text-yellow-300 font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                          <span>{member.workouts} Sessions</span>
                        </div>
                        <span className="text-[9px] text-[#6b8575] block">
                          {member.disciplineAdherencePercent}% Adherence
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-bold text-[var(--accent-main)] font-mono block">
                          {member.xp.toLocaleString()} XP
                        </span>
                        <span className="text-[9px] text-[#6b8575] block">
                          {member.workouts} Wk • {member.streak}d Streak
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Cheer / Challenge Action */}
                  {!member.isCurrentUser && (
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleSendCheer(member.id, member.name)}
                        title={`Cheer ${member.name} (${member.cheersReceived || 0} cheers)`}
                        className="p-1.5 rounded-lg bg-[#0e1d14] hover:bg-[#1a3826] text-[var(--accent-main)] transition-colors"
                      >
                        <HeartHandshake className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveChallengeMember(member);
                          setChallengeCategory(filterType === 'consistency' ? 'Consistency' : 'Discipline');
                        }}
                        title={`Challenge ${member.name}`}
                        className="p-1.5 rounded-lg bg-[#1a1208] hover:bg-[#2b1f0d] text-amber-300 border border-amber-500/30 transition-colors"
                      >
                        <Swords className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FRIENDLY COMPETITION CHALLENGE MODAL */}
      {activeChallengeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a150e] border border-[#1b3e27] rounded-3xl p-6 shadow-2xl space-y-4 text-[#f4f1ea]">
            <div className="flex items-center justify-between border-b border-[#163120] pb-3">
              <div className="flex items-center space-x-2">
                <Swords className="w-5 h-5 text-amber-400" />
                <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd7]">
                  Friendly Pride Challenge
                </h3>
              </div>
              <button
                onClick={() => setActiveChallengeMember(null)}
                className="p-1 rounded-full text-[#7d9987] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#cad8cf]">
              Issue a friendly rivalry challenge to <strong className="text-white">{activeChallengeMember.name}</strong> to sharpen each other's consistency.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-[#7d9987] block">
                Challenge Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChallengeCategory('Discipline')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    challengeCategory === 'Discipline'
                      ? 'bg-yellow-950/70 border-yellow-500/70 text-yellow-300'
                      : 'bg-[#0e1d14] border-[#183522] text-[#7d9987]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Discipline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeCategory('Consistency')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    challengeCategory === 'Consistency'
                      ? 'bg-orange-950/70 border-orange-500/70 text-orange-300'
                      : 'bg-[#0e1d14] border-[#183522] text-[#7d9987]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Consistency</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-[#7d9987] block">
                Challenge Terms / Goal
              </label>
              <textarea
                value={challengeMessage}
                onChange={e => setChallengeMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-[#08110b] border border-[#1b3d28] text-xs text-[#f4f1ea] focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveChallengeMember(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#102016] text-xs font-bold text-[#7d9987] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmChallenge}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Issue Challenge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BADGE DETAILS MODAL */}
      <BadgeDetailModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
        members={members}
        user={user}
        onSendCheer={handleSendCheer}
        onSendChallenge={member => {
          setSelectedBadge(null);
          setActiveChallengeMember(member);
        }}
      />
    </div>
  );
};
