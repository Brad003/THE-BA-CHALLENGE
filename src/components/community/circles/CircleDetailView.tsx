import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Shield,
  Trophy,
  Swords,
  Users,
  MessageSquare,
  Copy,
  Check,
  Plus,
  Flame,
  Crown,
  Medal,
  Calendar,
  Lock,
  Share2,
  Sparkles,
  Send,
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  BrotherhoodCircle,
  CircleChallenge,
  CircleMember
} from '../../../types';
import { CrestIconRenderer } from './CrestIconRenderer';
import { CreateChallengeModal } from './CreateChallengeModal';
import { LogChallengeProgressModal } from './LogChallengeProgressModal';

interface CircleDetailViewProps {
  circle: BrotherhoodCircle;
  onBack: () => void;
}

export const CircleDetailView: React.FC<CircleDetailViewProps> = ({
  circle,
  onBack
}) => {
  const {
    user,
    createCircleChallenge,
    logCircleChallengeProgress,
    sendCircleCheerOrMessage,
    leaveBrotherhoodCircle,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'feed' | 'roster'>('leaderboard');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    circle.challenges[0]?.id || 'overall'
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [loggingChallenge, setLoggingChallenge] = useState<CircleChallenge | null>(null);
  const [banterMessage, setBanterMessage] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Active challenge selected for leaderboard
  const selectedChallenge = useMemo(() => {
    if (selectedChallengeId === 'overall') return null;
    return circle.challenges.find((ch) => ch.id === selectedChallengeId) || null;
  }, [circle.challenges, selectedChallengeId]);

  // Compute specific leaderboard rankings
  const rankedMembers = useMemo(() => {
    if (selectedChallenge) {
      // Rank by participant progress on this challenge
      const participantMap = new Map(
        selectedChallenge.participants.map((p) => [p.memberId, p])
      );

      return [...circle.members]
        .map((member) => {
          const participant = participantMap.get(member.id);
          const val = participant ? participant.currentValue : 0;
          const completed = participant ? participant.completed : false;
          const pct = Math.min(100, Math.round((val / selectedChallenge.targetValue) * 100));
          return {
            member,
            participant,
            score: val,
            percentage: pct,
            completed,
            unit: selectedChallenge.metricUnit
          };
        })
        .sort((a, b) => {
          if (a.completed && !b.completed) return -1;
          if (!a.completed && b.completed) return 1;
          return b.score - a.score;
        });
    } else {
      // Overall circle ranking by totalPoints
      return [...circle.members]
        .map((member) => ({
          member,
          participant: undefined,
          score: member.stats.totalPoints,
          percentage: 100,
          completed: false,
          unit: 'XP'
        }))
        .sort((a, b) => b.score - a.score);
    }
  }, [circle.members, selectedChallenge]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(circle.inviteCode);
    setCopiedCode(true);
    showToast(`Invite code ${circle.inviteCode} copied!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePostBanter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banterMessage.trim()) return;
    sendCircleCheerOrMessage(circle.id, banterMessage.trim(), 'chat');
    setBanterMessage('');
  };

  const handleSendCheer = (memberName: string) => {
    sendCircleCheerOrMessage(
      circle.id,
      `👊 Fist bump to brother ${memberName}! Keep pushing the standard!`,
      'cheer'
    );
  };

  const isCurrentUserMember = circle.members.some(
    (m) => m.isCurrentUser || m.id === (user.id || 'current-user')
  );

  return (
    <div className="space-y-6 pb-20 text-[#f4f1ea]">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-[#86efac] hover:text-[#4ade80] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Brotherhood Circles</span>
        </button>

        {isCurrentUserMember && (
          <div className="relative">
            <button
              onClick={() => setShowLeaveConfirm(!showLeaveConfirm)}
              className="text-[11px] text-[#718d7c] hover:text-red-400 transition-colors"
            >
              Circle Settings
            </button>
            {showLeaveConfirm && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0a150e] border border-red-900/60 rounded-xl shadow-xl p-3 z-30 space-y-2">
                <span className="text-[11px] text-[#a1b8ab] block">
                  Leave this circle?
                </span>
                <button
                  onClick={() => {
                    leaveBrotherhoodCircle(circle.id);
                    onBack();
                  }}
                  className="w-full py-1.5 px-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-bold rounded-lg transition-colors text-center"
                >
                  Confirm Leave
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Circle Header Heraldry Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8"
        style={{
          backgroundColor: '#0a1610',
          borderColor: `${circle.themeColor}40`,
          boxShadow: `0 10px 30px -10px ${circle.themeColor}25`
        }}
      >
        {/* Background ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: circle.themeColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shrink-0 shadow-lg"
              style={{
                backgroundColor: `${circle.themeColor}15`,
                borderColor: `${circle.themeColor}60`
              }}
            >
              <CrestIconRenderer
                icon={circle.crestIcon}
                themeColor={circle.themeColor}
                size="xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#143221] text-[#86efac] border border-[#275c3b]">
                  {circle.focusCategory}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/40 text-[#a3b8aa] border border-[#1b3b27] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Private Circle
                </span>
                <span className="text-xs text-[#718d7c]">
                  Founded by <strong className="text-[#c8ded0]">{circle.founderName}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-[#f5ebd7] tracking-wide">
                {circle.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#9ab3a3] italic">
                &ldquo;{circle.tagline}&rdquo;
              </p>

              <p className="text-xs text-[#769181] max-w-2xl pt-1">
                {circle.description}
              </p>
            </div>
          </div>

          {/* Right Action / Invite Code Card */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <div className="p-3 bg-[#07110b] border border-[#1a3825] rounded-2xl flex items-center space-x-3 shadow-inner">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#718d7c] block font-bold">
                  Circle Invite Code
                </span>
                <span className="text-sm font-mono font-extrabold text-[#4ade80] tracking-wider">
                  {circle.inviteCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                title="Copy invite code"
                className="p-2 bg-[#122b1c] hover:bg-[#1a3d28] border border-[#255737] rounded-xl text-[#86efac] transition-all"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              onClick={() => setShowCreateChallenge(true)}
              className="px-4 py-2.5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-xs rounded-xl shadow-lg shadow-green-950/40 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Forge Custom Challenge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Circle Sub-Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#183122] pb-3 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-950/90 to-[#142e1d] text-yellow-300 border border-yellow-500/70 shadow-sm'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-yellow-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Circle Leaderboard ({circle.members.length} Brothers)</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'challenges'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <Swords className="w-4 h-4 text-[#86efac]" />
          <span>Custom Challenges ({circle.challenges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feed'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Circle Wall & Banter ({circle.activityFeed.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roster'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Brothers Roster ({circle.members.length})</span>
        </button>
      </div>

      {/* TAB 1: CIRCLE LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Challenge Selector / Mode Filter */}
          <div className="p-4 bg-[#0a150e] border border-[#1b3b27] rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#86efac]" />
              <span className="text-xs font-bold text-[#c9decb]">
                Standings Filter:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedChallengeId('overall')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedChallengeId === 'overall'
                    ? 'bg-[#1e4c32] text-[#86efac] border border-[#3b8a57]'
                    : 'bg-[#060e09] text-[#718d7c] hover:text-[#a7c2b0]'
                }`}
              >
                Overall Circle Power (XP)
              </button>

              {circle.challenges.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChallengeId(ch.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    selectedChallengeId === ch.id
                      ? 'bg-amber-950/80 text-yellow-300 border border-yellow-500/70'
                      : 'bg-[#060e09] text-[#718d7c] hover:text-[#a7c2b0]'
                  }`}
                >
                  <span>{ch.title}</span>
                  <span className="text-[10px] opacity-70">
                    ({ch.targetValue} {ch.metricUnit})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Challenge Goal Banner (if a challenge is selected) */}
          {selectedChallenge && (
            <div className="p-4 bg-gradient-to-r from-[#0c2317] to-[#07130c] border border-[#235336] rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#86efac] uppercase tracking-wider">
                  Active Challenge Benchmark
                </span>
                <h3 className="text-base font-bold text-[#f5ebd7]">
                  {selectedChallenge.title}
                </h3>
                <p className="text-xs text-[#8ca595]">
                  Target: <strong>{selectedChallenge.targetValue} {selectedChallenge.metricUnit}</strong> • Ends {selectedChallenge.endDate}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setLoggingChallenge(selectedChallenge)}
                  className="px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log My Progress</span>
                </button>
              </div>
            </div>
          )}

          {/* Top 3 Podium Highlights */}
          {rankedMembers.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* 2nd Place */}
              <div className="order-2 sm:order-1 p-4 bg-[#09150e] border border-[#1b3b27] rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-2 left-3 text-[10px] font-extrabold text-zinc-400 tracking-wider">
                  #2 SILVER
                </div>
                <div className="relative mt-2 mb-2">
                  <img
                    src={rankedMembers[1].member.avatar}
                    alt={rankedMembers[1].member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-zinc-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center border border-zinc-500">
                    2
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#f5ebd7] line-clamp-1">
                  {rankedMembers[1].member.name}
                </h4>
                <span className="text-[11px] text-[#86efac] font-mono font-bold mt-1">
                  {rankedMembers[1].score} {rankedMembers[1].unit}
                </span>
                <span className="text-[10px] text-[#718d7c] mt-0.5">
                  {rankedMembers[1].member.role}
                </span>
              </div>

              {/* 1st Place Champion */}
              <div className="order-1 sm:order-2 p-5 bg-gradient-to-b from-amber-950/40 via-[#0e2115] to-[#09150e] border border-yellow-500/70 rounded-2xl flex flex-col items-center text-center relative overflow-hidden shadow-xl shadow-yellow-950/20">
                <div className="absolute top-2 text-[10px] font-extrabold text-yellow-300 tracking-widest flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>CIRCLE LEADER</span>
                </div>
                <div className="relative mt-3 mb-2">
                  <img
                    src={rankedMembers[0].member.avatar}
                    alt={rankedMembers[0].member.name}
                    className="w-18 h-18 rounded-full object-cover border-3 border-yellow-400 shadow-lg shadow-yellow-900/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 text-black text-sm font-extrabold flex items-center justify-center border-2 border-[#0e2115]">
                    1
                  </div>
                </div>
                <h4 className="font-bold text-base text-[#f5ebd7] line-clamp-1">
                  {rankedMembers[0].member.name}
                </h4>
                <span className="text-sm text-yellow-300 font-mono font-extrabold mt-1">
                  {rankedMembers[0].score} {rankedMembers[0].unit}
                </span>
                <span className="text-[11px] text-[#a4c7b2] mt-0.5">
                  {rankedMembers[0].member.level}
                </span>
                {rankedMembers[0].completed && (
                  <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                    CONQUERED 🏆
                  </span>
                )}
              </div>

              {/* 3rd Place */}
              <div className="order-3 sm:order-3 p-4 bg-[#09150e] border border-[#1b3b27] rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-2 left-3 text-[10px] font-extrabold text-amber-600 tracking-wider">
                  #3 BRONZE
                </div>
                <div className="relative mt-2 mb-2">
                  <img
                    src={rankedMembers[2].member.avatar}
                    alt={rankedMembers[2].member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-600"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-800 text-amber-200 text-xs font-bold flex items-center justify-center border border-amber-600">
                    3
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#f5ebd7] line-clamp-1">
                  {rankedMembers[2].member.name}
                </h4>
                <span className="text-[11px] text-[#86efac] font-mono font-bold mt-1">
                  {rankedMembers[2].score} {rankedMembers[2].unit}
                </span>
                <span className="text-[10px] text-[#718d7c] mt-0.5">
                  {rankedMembers[2].member.role}
                </span>
              </div>
            </div>
          )}

          {/* Full Ranked Leaderboard Table / Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-[#718d7c]">
              <span>Rank & Brother</span>
              <span>Progress & Respect</span>
            </div>

            {rankedMembers.map((item, idx) => {
              const rank = idx + 1;
              const isCurrentUser =
                item.member.isCurrentUser ||
                item.member.id === (user.id || 'current-user') ||
                item.member.name === user.fullName;

              return (
                <div
                  key={item.member.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-[#11311f] to-[#0c1f14] border-emerald-500/70 shadow-md'
                      : 'bg-[#09150e] border-[#183723] hover:border-[#285838]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                        rank === 1
                          ? 'bg-yellow-400 text-black shadow-md shadow-yellow-500/20'
                          : rank === 2
                          ? 'bg-zinc-300 text-black'
                          : rank === 3
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-[#12281b] text-[#738f7d]'
                      }`}
                    >
                      {rank}
                    </div>

                    <img
                      src={item.member.avatar}
                      alt={item.member.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#275c3b] shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#f5ebd7]">
                          {item.member.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#143d25] text-[#86efac] border border-[#2a6841]">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] text-[#738f7d] px-1.5 py-0.5 bg-black/40 rounded border border-[#1b3b27]">
                          {item.member.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7ea08b]">
                        {item.member.level}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Score bar & cheer button */}
                  <div className="flex items-center space-x-4 pl-10 sm:pl-0">
                    <div className="text-right min-w-[110px]">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-sm font-mono font-extrabold text-[#4ade80]">
                          {item.score}
                        </span>
                        <span className="text-xs text-[#718d7c] font-medium">
                          {selectedChallenge ? `/ ${selectedChallenge.targetValue} ${item.unit}` : item.unit}
                        </span>
                      </div>

                      {selectedChallenge && (
                        <div className="w-28 bg-[#14261c] rounded-full h-1.5 mt-1 overflow-hidden ml-auto">
                          <div
                            className={`h-full ${
                              item.completed ? 'bg-yellow-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Fist Bump / Cheer Button */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleSendCheer(item.member.name)}
                        title="Send fist bump encouragement"
                        className="px-2.5 py-1.5 rounded-xl bg-[#143221] hover:bg-[#1f4a31] border border-[#285c3b] text-xs font-bold text-[#86efac] flex items-center space-x-1 transition-all"
                      >
                        <span>👊</span>
                        <span className="hidden sm:inline">Bump</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#f5ebd7]">
                Circle Fitness Challenges
              </h3>
              <p className="text-xs text-[#8ca595]">
                Custom missions designed strictly for brothers of {circle.name}
              </p>
            </div>

            <button
              onClick={() => setShowCreateChallenge(true)}
              className="px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Forge Challenge</span>
            </button>
          </div>

          {circle.challenges.length === 0 ? (
            <div className="p-8 text-center bg-[#09150e] border border-[#1b3b27] rounded-2xl space-y-3">
              <Swords className="w-10 h-10 text-[#4ade80] mx-auto opacity-60" />
              <h4 className="text-sm font-bold text-[#f5ebd7]">
                No challenges active yet
              </h4>
              <p className="text-xs text-[#718d7c] max-w-sm mx-auto">
                Step up and forge the first fitness challenge for your circle brothers!
              </p>
              <button
                onClick={() => setShowCreateChallenge(true)}
                className="px-4 py-2 bg-[#173e27] hover:bg-[#235838] border border-[#306f47] text-[#86efac] text-xs font-bold rounded-xl transition-all"
              >
                Forge First Challenge
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circle.challenges.map((ch) => {
                const userParticipant = ch.participants.find(
                  (p) =>
                    p.memberId === (user.id || 'current-user') ||
                    p.memberName.includes('You')
                );
                const userVal = userParticipant ? userParticipant.currentValue : 0;
                const userPct = Math.min(100, Math.round((userVal / ch.targetValue) * 100));
                const completedCount = ch.participants.filter((p) => p.completed).length;

                return (
                  <div
                    key={ch.id}
                    className="p-5 bg-[#09150e] border border-[#1b3b27] rounded-2xl space-y-4 hover:border-[#2b5e3d] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#143221] text-[#86efac] border border-[#275c3b]">
                          {ch.category}
                        </span>
                        <span className="text-[11px] text-yellow-400 font-bold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          +{ch.xpReward} XP
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#f5ebd7]">
                        {ch.title}
                      </h4>

                      <p className="text-xs text-[#8ca595]">
                        {ch.description}
                      </p>
                    </div>

                    {/* Progress details */}
                    <div className="space-y-2 pt-2 border-t border-[#162f1f]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8ba293]">Your Progress:</span>
                        <span className="font-mono font-bold text-[#4ade80]">
                          {userVal} / {ch.targetValue} {ch.metricUnit} ({userPct}%)
                        </span>
                      </div>

                      <div className="w-full bg-[#14261c] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            userParticipant?.completed ? 'bg-yellow-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${userPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#698574]">
                        <span>{completedCount} of {ch.participants.length} finished</span>
                        <span>Ends {ch.endDate}</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 flex items-center space-x-2">
                      <button
                        onClick={() => setLoggingChallenge(ch)}
                        className="flex-1 py-2 bg-[#163b25] hover:bg-[#205133] border border-[#2c6943] text-[#86efac] font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Progress</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedChallengeId(ch.id);
                          setActiveTab('leaderboard');
                        }}
                        className="px-3 py-2 bg-[#0c1a11] hover:bg-[#14291c] border border-[#1e3e29] text-[#a5c0b0] text-xs font-bold rounded-xl transition-all"
                      >
                        View Standings
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CIRCLE FEED & BANTER WALL */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Post Banter Box */}
          <form
            onSubmit={handlePostBanter}
            className="p-4 bg-[#09150e] border border-[#1b3b27] rounded-2xl space-y-3"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1]">
              Circle Banter & Encouragement Wall
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={banterMessage}
                onChange={(e) => setBanterMessage(e.target.value)}
                placeholder="Call out a brother, post a motivational challenge check-in, or celebrate a grind..."
                className="flex-1 px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-xs text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
              />
              <button
                type="submit"
                disabled={!banterMessage.trim()}
                className="px-4 py-2.5 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-black font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Activity Stream */}
          <div className="space-y-3">
            {circle.activityFeed.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#09150e] border border-[#183723] rounded-2xl flex items-start space-x-3.5"
              >
                <img
                  src={item.authorAvatar}
                  alt={item.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#275c3b] shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f5ebd7]">
                      {item.authorName}
                    </span>
                    <span className="text-[10px] text-[#698574]">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#9ab3a3] leading-relaxed">
                    {item.text}
                  </p>

                  <div className="pt-1 flex items-center space-x-3 text-[11px] text-[#718d7c]">
                    {item.type === 'challenge_completed' && (
                      <span className="text-yellow-400 font-bold flex items-center gap-1">
                        🏆 Challenge Conquered
                      </span>
                    )}
                    {item.type === 'cheer' && (
                      <span className="text-[#86efac] font-bold flex items-center gap-1">
                        👊 Brotherhood Fist Bump
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BROTHERS ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#f5ebd7]">
                Circle Brotherhood Roster ({circle.members.length})
              </h3>
              <p className="text-xs text-[#8ca595]">
                Brothers bound by the creed of {circle.name}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-[#143221] hover:bg-[#1e4c32] border border-[#275c3b] text-[#86efac] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {circle.members.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-[#09150e] border border-[#183723] rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#275c3b]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#f5ebd7]">
                        {member.name}
                      </h4>
                      {member.isCurrentUser && (
                        <span className="text-[10px] bg-[#143d25] text-[#86efac] px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#718d7c] block">
                      {member.role} • Joined {member.joinedAt}
                    </span>
                    <span className="text-[10px] text-[#86efac] font-medium">
                      {member.level}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-xs font-mono font-bold text-yellow-300">
                    {member.stats.totalPoints} XP
                  </div>
                  <div className="text-[10px] text-[#718d7c]">
                    {member.stats.challengesCompleted} won • {member.stats.currentStreak}d streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateChallengeModal
        isOpen={showCreateChallenge}
        circleId={circle.id}
        circleName={circle.name}
        onClose={() => setShowCreateChallenge(false)}
        onSubmit={(challengeData) => {
          createCircleChallenge(circle.id, challengeData);
          setActiveTab('challenges');
        }}
      />

      <LogChallengeProgressModal
        isOpen={!!loggingChallenge}
        challenge={loggingChallenge}
        circleId={circle.id}
        onClose={() => setLoggingChallenge(null)}
        onSubmit={(addedValue, note) => {
          if (loggingChallenge) {
            logCircleChallengeProgress(circle.id, loggingChallenge.id, addedValue, note);
          }
        }}
      />
    </div>
  );
};
