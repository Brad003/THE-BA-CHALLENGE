import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BAEvent } from '../../types';
import {
  Users,
  Calendar,
  MessageSquare,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
  Clock,
  UserCheck,
  Shield,
  TreePine,
  Sparkles,
  HeartHandshake,
  Flame,
  Dumbbell,
  ThumbsUp,
  Trophy,
  ShieldCheck,
  Crown
} from 'lucide-react';

import { GlobalActivityFeed } from './GlobalActivityFeed';
import { CommunityLeaderboard } from '../leaderboard/CommunityLeaderboard';
import { computeLeaderboardMembers } from '../../utils/leaderboardBadges';
import { LeaderboardBadgeBadge } from '../leaderboard/LeaderboardBadgeBadge';
import { BrotherhoodCirclesTab } from './circles/BrotherhoodCirclesTab';

export const CommunityView: React.FC = () => {
  const {
    user,
    communityPosts,
    events,
    brotherhoodCircles,
    addCommunityPost,
    reactToPost,
    addCommentToPost,
    toggleEventRegistration
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'circles' | 'leaderboard' | 'events' | 'activity'>('feed');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [challengingMember, setChallengingMember] = useState<{ name: string } | null>(null);
  const [challengeText, setChallengeText] = useState('');
  const { addNotification } = useApp();

  // Compute members to show their badges on feed posts
  const leaderboardMembers = useMemo(() => {
    return computeLeaderboardMembers(user);
  }, [user]);

  const handleMentions = (text: string) => {
    const mentions = text.match(/@([a-zA-Z0-9_]+)/g);
    if (mentions) {
      const uniqueMentions = Array.from(new Set(mentions));
      uniqueMentions.forEach((mention) => {
        const username = mention.substring(1);
        addNotification(
          'User Tagged',
          `You mentioned ${username} in your message.`,
          'community'
        );
      });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    addCommunityPost(postContent, postImage.trim() || undefined);
    handleMentions(postContent);
    setPostContent('');
    setPostImage('');
  };

  const handleAddComment = (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment || !comment.trim()) return;
    addCommentToPost(postId, comment);
    handleMentions(comment);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const renderWithMentions = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} className="text-[#86efac] font-bold cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const sendChallenge = () => {
    if (!challengingMember || !challengeText.trim()) return;
    addNotification(
      'Challenge Sent',
      `You challenged ${challengingMember.name} to: ${challengeText}`,
      'challenge'
    );
    setChallengingMember(null);
    setChallengeText('');
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4 text-[#f4f1ea]">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest">
          THE BA BROTHERHOOD
        </span>
        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-[#f5ebd7] tracking-wide mt-1">
          Brotherhood & Expeditions
        </h1>
        <p className="text-xs text-[#8da696] mt-1">
          “We don't leave any man behind.” Accountability, respect, and trail camaraderie.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 sm:space-x-3 border-b border-[#183122] pb-3 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feed'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Brotherhood Feed ({communityPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('circles')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'circles'
              ? 'bg-gradient-to-r from-emerald-950/90 via-[#103b22] to-amber-950/50 text-[#86efac] border border-emerald-500/70 shadow-sm'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#86efac]'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Brotherhood Circles ({brotherhoodCircles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-950/90 to-[#142e1d] text-yellow-300 border border-yellow-500/70 shadow-sm'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-yellow-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Pride Standings & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming BA Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'activity'
              ? 'bg-[#153a25] text-[#86efac] border border-[#27643f]'
              : 'bg-[#0a140e] text-[#738f7d] hover:text-[#b4c4b9]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Live Activity</span>
        </button>
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-5">
          {/* Post Creation Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--accent-main)]"
              />
              <div>
                <h3 className="text-xs font-bold text-[#f5ebd7]">{user.fullName}</h3>
                <span className="text-[10px] text-[var(--accent-main)] uppercase font-semibold">
                  {user.membershipTier} • LEVEL {user.pantherLevel}
                </span>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share a training milestone, encourage a brother, or reflect on today's trail..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-[#0e1c14] border border-[#1e3d29] text-xs text-[#f4f1ea] placeholder-[#516b5b] focus:outline-none focus:border-[var(--accent-main)] resize-none"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <input
                  type="text"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  placeholder="Optional image URL (trail photos, workouts)"
                  className="px-3 py-1.5 rounded-xl bg-[#0c1810] border border-[#1a3323] text-xs text-[#b8cbbf] placeholder-[#4f6758] flex-1 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] font-black text-xs flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-40 transition-all self-end sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SHARE TO PRIDE</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {/* Quick Pride Champions Spotlight Strip */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0a1810] to-[#0a1810] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-950/80 border border-yellow-500/50 text-yellow-300">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">
                      Current Pride Champions
                    </span>
                  </div>
                  <p className="text-xs text-[#cad6cf]">
                    <strong className="text-yellow-300">Coach Kwame</strong> holds <span className="text-yellow-300 font-semibold">Iron Discipline</span> & <span className="text-orange-300 font-semibold">Unbroken Flame</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className="px-3 py-1.5 rounded-xl bg-yellow-950/50 hover:bg-yellow-950/80 border border-yellow-500/50 text-xs font-bold text-yellow-300 flex items-center justify-center space-x-1.5 transition-all self-start sm:self-auto"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>View Full Standings</span>
              </button>
            </div>

            {communityPosts.map((post) => {
              const authorMember = leaderboardMembers.find(
                m => m.name.toLowerCase() === post.authorName.toLowerCase() ||
                     (m.isCurrentUser && post.authorName === user.fullName)
              );

              return (
                <div
                  key={post.id}
                  className="p-5 rounded-3xl bg-[#09130d] border border-[#183122] space-y-3.5"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--accent-main)]/50"
                      />
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 className="text-xs font-bold text-[#f5ebd7]">{post.authorName}</h4>
                          {authorMember?.badges && authorMember.badges.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {authorMember.badges.map(b => (
                                <LeaderboardBadgeBadge key={b.id} badge={b} size="sm" />
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-[var(--accent-main)] uppercase font-semibold">
                          {post.authorLevel} • {post.createdAt}
                        </span>
                      </div>
                    </div>
                    {post.authorName !== user.fullName && (
                      <button 
                        onClick={() => setChallengingMember({ name: post.authorName })}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-[#0c1610] text-[var(--accent-main)] border border-[#2e2614] hover:bg-[#1a170d] transition-colors flex items-center space-x-1"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Challenge</span>
                      </button>
                    )}
                  </div>

                  {/* Workout Highlight Tag if present */}
                  {post.workoutHighlight && (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#132c1c] border border-[#235335] text-[11px] font-bold text-[#86efac]">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                      <span>{post.workoutHighlight}</span>
                    </div>
                  )}

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-[#d4ded7] leading-relaxed whitespace-pre-line">
                    {renderWithMentions(post.content)}
                  </p>

                  {/* Image Attachment */}
                  {post.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-[#1a3323] max-h-80">
                      <img
                        src={post.imageUrl}
                        alt="Community post attachment"
                        className="w-full h-full object-cover hover:scale-101 transition-transform"
                      />
                    </div>
                  )}

                  {/* Brotherhood Reactions */}
                  <div className="pt-2 border-t border-[#14261a] space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => reactToPost(post.id, 'panther')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
                          post.userReactions.includes('panther')
                            ? 'bg-[#183d28] border-[var(--accent-main)] text-[#f5ebd7]'
                            : 'bg-[#0d1811] border-[#1b3424] text-[#8ea496] hover:border-[#2f5a3e]'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold">{post.reactions.panther}</span>
                      </button>

                      <button
                        onClick={() => reactToPost(post.id, 'strong')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
                          post.userReactions.includes('strong')
                            ? 'bg-[#183d28] border-[var(--accent-main)] text-[#f5ebd7]'
                            : 'bg-[#0d1811] border-[#1b3424] text-[#8ea496] hover:border-[#2f5a3e]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[11px] font-bold">{post.reactions.strong}</span>
                      </button>

                      <button
                        onClick={() => reactToPost(post.id, 'respect')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
                          post.userReactions.includes('respect')
                            ? 'bg-[#183d28] border-[var(--accent-main)] text-[#f5ebd7]'
                            : 'bg-[#0d1811] border-[#1b3424] text-[#8ea496] hover:border-[#2f5a3e]'
                        }`}
                      >
                        <Dumbbell className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[11px] font-bold">{post.reactions.respect}</span>
                      </button>

                      <button
                        onClick={() => reactToPost(post.id, 'greenLegacy')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
                          post.userReactions.includes('greenLegacy')
                            ? 'bg-[#183d28] border-[var(--accent-main)] text-[#f5ebd7]'
                            : 'bg-[#0d1811] border-[#1b3424] text-[#8ea496] hover:border-[#2f5a3e]'
                        }`}
                      >
                        <TreePine className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-bold">{post.reactions.greenLegacy}</span>
                      </button>

                      <button
                        onClick={() => reactToPost(post.id, 'wellDone')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
                          post.userReactions.includes('wellDone')
                            ? 'bg-[#183d28] border-[var(--accent-main)] text-[#f5ebd7]'
                            : 'bg-[#0d1811] border-[#1b3424] text-[#8ea496] hover:border-[#2f5a3e]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-bold">{post.reactions.wellDone}</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-2.5 rounded-xl bg-[#0c1610] border border-[#16291d] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#e6f0ea]">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-[#6d8a77]">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className="text-[#93ab9c] leading-relaxed">{renderWithMentions(comment.content)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Encourage your brother..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#0c1610] border border-[#1a3323] text-xs text-[#f4f1ea] placeholder-[#516b5b] focus:outline-none focus:border-[var(--accent-main)]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#143220] hover:bg-[#1a422b] text-xs font-bold text-[#86efac] border border-[#214f33] transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-5 rounded-3xl bg-[#09130d] border border-[#1a3625] flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#132c1c] text-[#86efac] border border-[#214d31] uppercase">
                      {event.type}
                    </span>
                    <span className="text-xs font-bold text-[var(--accent-main)]">{event.date}</span>
                  </div>

                  <h3 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd7] group-hover:text-[var(--accent-bright)] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#8ea496] leading-relaxed">{event.description}</p>

                  {/* Meta details */}
                  <div className="space-y-1.5 text-xs text-[#a0b5a8] pt-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Lead: {event.leadCoach}</span>
                    </div>
                  </div>

                  {/* Gear List */}
                  {event.gearRequired && event.gearRequired.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#0c1710] border border-[#16291c] text-[11px] text-[#7d9987]">
                      <span className="text-[var(--accent-main)] font-bold block mb-1">Required Gear:</span>
                      <span>{event.gearRequired.join(' • ')}</span>
                    </div>
                  )}
                </div>

                {/* RSVP / Registration button and Capacity bar */}
                <div className="space-y-2 pt-2 border-t border-[#14261a]">
                  <div className="flex justify-between text-xs text-[#738f7d]">
                    <span>
                      {event.registeredCount} / {event.capacity} Registered
                    </span>
                    <span className="text-[#86efac] font-bold">+{event.xpReward} XP</span>
                  </div>

                  <div className="w-full bg-[#111f16] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--accent-main)] h-full"
                      style={{
                        width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%`
                      }}
                    />
                  </div>

                  <button
                    onClick={() => toggleEventRegistration(event.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      event.isRegistered
                        ? 'bg-[#18462a] border border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#12281a] hover:bg-[#193a26] text-[#86efac] border border-[#245435]'
                    }`}
                  >
                    {event.isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-main)]" />
                        <span>CONFIRMED REGISTERED</span>
                      </>
                    ) : (
                      <span>RESERVE EXPEDITION SPOT</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CIRCLES TAB */}
      {activeTab === 'circles' && (
        <div className="space-y-4">
          <BrotherhoodCirclesTab />
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <CommunityLeaderboard />
        </div>
      )}

      {/* ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <GlobalActivityFeed />
        </div>
      )}

      {/* Challenge Modal */}
      {challengingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c1610] border border-[var(--accent-main)] rounded-3xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center space-x-3 text-[var(--accent-main)]">
              <Shield className="w-6 h-6" />
              <h2 className="font-['Cinzel'] font-bold text-xl">Issue Challenge</h2>
            </div>
            
            <p className="text-xs text-[#8ea496]">
              Call out <span className="font-bold text-[#f5ebd7]">{challengingMember.name}</span> to complete a specific task. They will receive a notification.
            </p>

            <textarea
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="e.g., I challenge you to 100 pushups today! Stay disciplined."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-[#070c09] border border-[#1e3d29] text-sm text-[#f5ebd7] placeholder-[#516b5b] focus:outline-none focus:border-[var(--accent-main)] resize-none"
            />

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setChallengingMember(null)}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-[#14261a] hover:bg-[#1b3424] text-[#8ea496] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendChallenge}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[#0a150e] transition-colors"
              >
                Send Callout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
