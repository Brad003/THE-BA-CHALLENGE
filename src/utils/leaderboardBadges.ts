import { UserProfile, LeaderboardBadge, LeaderboardMember } from '../types';

/**
 * Canonical Leaderboard Badges specifically identifying top performers
 * in 'Discipline' and 'Consistency' to foster friendly competition.
 */
export const LEADERBOARD_BADGES: Record<string, LeaderboardBadge> = {
  // ==========================================
  // DISCIPLINE BADGES
  // ==========================================
  'iron-discipline': {
    id: 'iron-discipline',
    title: 'Iron Discipline',
    category: 'Discipline',
    tier: 'champion',
    rankRequirement: 1,
    description: 'Supreme Pride Champion in Discipline. Awarded to the #1 athlete with the highest monthly training volume and adherence to daily character commitments.',
    shortCriteria: '#1 Rank in Discipline (Workouts & 98%+ Adherence)',
    iconName: 'ShieldCheck',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    bgGradient: 'from-amber-950/80 via-yellow-900/40 to-black',
    borderColor: 'border-yellow-500/80',
    textColor: 'text-yellow-300'
  },
  'discipline-stalwart': {
    id: 'discipline-stalwart',
    title: 'Discipline Stalwart',
    category: 'Discipline',
    tier: 'silver',
    rankRequirement: 2,
    description: 'Top 3 Pride Discipline Leader. Relentlessly executes heavy weekly workout blocks and character training without making excuses.',
    shortCriteria: 'Top 3 in Workouts & >90% Task Adherence',
    iconName: 'Target',
    glowColor: 'rgba(226, 232, 240, 0.35)',
    bgGradient: 'from-slate-900/80 via-zinc-800/40 to-black',
    borderColor: 'border-slate-300/70',
    textColor: 'text-slate-200'
  },
  'iron-will': {
    id: 'iron-will',
    title: 'Iron Will',
    category: 'Discipline',
    tier: 'bronze',
    description: 'Demonstrated uncompromising devotion to scheduled training routines and non-negotiable physical discipline habits.',
    shortCriteria: '10+ Workouts Completed & >80% Adherence',
    iconName: 'Award',
    glowColor: 'rgba(34, 197, 94, 0.35)',
    bgGradient: 'from-emerald-950/80 via-green-900/40 to-black',
    borderColor: 'border-emerald-500/70',
    textColor: 'text-emerald-300'
  },

  // ==========================================
  // CONSISTENCY BADGES
  // ==========================================
  'unbroken-flame': {
    id: 'unbroken-flame',
    title: 'Unbroken Flame',
    category: 'Consistency',
    tier: 'champion',
    rankRequirement: 1,
    description: 'Supreme Pride Champion in Consistency. Guarding the longest unbroken daily streak in the brotherhood. Never skips, never surrenders.',
    shortCriteria: '#1 Longest Active Daily Streak (30+ Days)',
    iconName: 'Flame',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    bgGradient: 'from-orange-950/80 via-amber-900/40 to-black',
    borderColor: 'border-orange-500/80',
    textColor: 'text-orange-300'
  },
  'streak-sentinel': {
    id: 'streak-sentinel',
    title: 'Streak Sentinel',
    category: 'Consistency',
    tier: 'silver',
    rankRequirement: 2,
    description: 'Top 3 Pride Consistency Defender. Maintained double-digit unbroken days of showing up on the trail and the training floor.',
    shortCriteria: 'Top 3 Streak Holder (14+ Unbroken Days)',
    iconName: 'Zap',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bgGradient: 'from-amber-950/80 via-yellow-900/30 to-black',
    borderColor: 'border-amber-400/70',
    textColor: 'text-amber-200'
  },
  'daily-devotee': {
    id: 'daily-devotee',
    title: 'Daily Devotee',
    category: 'Consistency',
    tier: 'bronze',
    description: 'Forged a resilient weekly rhythm. Proving that greatness is not an act, but a daily standard of accountability.',
    shortCriteria: '7+ Unbroken Active Streak Days',
    iconName: 'Footprints',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgGradient: 'from-teal-950/80 via-emerald-900/40 to-black',
    borderColor: 'border-teal-400/70',
    textColor: 'text-teal-300'
  }
};

/**
 * Base pride members for the community leaderboard.
 */
export const BASE_PRIDE_MEMBERS: Omit<LeaderboardMember, 'badges' | 'disciplineRank' | 'consistencyRank' | 'overallRank'>[] = [
  {
    id: 'coach-kwame',
    name: 'Coach Kwame Osei',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    level: 'LEVEL 6 — PRIDE LEADER',
    streak: 48,
    longestStreak: 65,
    workouts: 92,
    disciplineAdherencePercent: 99,
    xp: 11450,
    trees: 85,
    cheersReceived: 142,
    quote: '“Discipline is character in motion. Show up when nobody is watching.”'
  },
  {
    id: 'm-2',
    name: 'Marcus Adebayo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    level: 'LEVEL 4 — PANTHER',
    streak: 18,
    longestStreak: 24,
    workouts: 28,
    disciplineAdherencePercent: 93,
    xp: 4120,
    trees: 26,
    cheersReceived: 68,
    quote: '“One step at a time. The mountain will bend before the brotherhood breaks.”'
  },
  {
    id: 'm-3',
    name: 'Jabari Mensah',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    level: 'LEVEL 3 — HUNTER',
    streak: 14,
    longestStreak: 19,
    workouts: 22,
    disciplineAdherencePercent: 88,
    xp: 3190,
    trees: 35,
    cheersReceived: 53,
    quote: '“Accountability is love in action.”'
  },
  {
    id: 'm-4',
    name: 'Tendai Mutasa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    level: 'LEVEL 4 — PANTHER',
    streak: 11,
    longestStreak: 16,
    workouts: 19,
    disciplineAdherencePercent: 84,
    xp: 2890,
    trees: 18,
    cheersReceived: 39,
    quote: '“Dawn runs cure the restless mind.”'
  },
  {
    id: 'm-5',
    name: 'Kofi Boateng',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    level: 'LEVEL 2 — SCOUT',
    streak: 6,
    longestStreak: 12,
    workouts: 11,
    disciplineAdherencePercent: 78,
    xp: 1680,
    trees: 9,
    cheersReceived: 21,
    quote: '“Learning from every brother here.”'
  }
];

/**
 * Computes all leaderboard members dynamically including the current user,
 * calculates rankings in 'Discipline' and 'Consistency', and assigns badges.
 */
export function computeLeaderboardMembers(
  currentUser: UserProfile,
  cheerOverrides: Record<string, number> = {}
): LeaderboardMember[] {
  // Estimate user discipline adherence based on streak vs workouts
  const userWorkouts = currentUser.streak.workoutsThisMonth || 0;
  const userStreak = currentUser.streak.current || 0;
  const userAdherence = Math.min(100, Math.max(70, Math.round(80 + (userWorkouts * 1.5))));

  const userMember: Omit<LeaderboardMember, 'badges' | 'disciplineRank' | 'consistencyRank' | 'overallRank'> = {
    id: 'user-current',
    name: `${currentUser.fullName} (You)`,
    avatar: currentUser.avatarUrl,
    level: `LEVEL ${currentUser.pantherLevel}`,
    streak: userStreak,
    longestStreak: Math.max(currentUser.streak.longest || userStreak, userStreak),
    workouts: userWorkouts,
    disciplineAdherencePercent: userAdherence,
    xp: currentUser.xp,
    trees: currentUser.treesPlanted,
    isCurrentUser: true,
    cheersReceived: cheerOverrides['user-current'] ?? 46,
    quote: currentUser.bio || '“Striving every day with the brotherhood.”'
  };

  const rawMembers: Omit<LeaderboardMember, 'badges' | 'disciplineRank' | 'consistencyRank' | 'overallRank'>[] = [
    ...BASE_PRIDE_MEMBERS.map(m => ({
      ...m,
      cheersReceived: (m.cheersReceived || 0) + (cheerOverrides[m.id] || 0)
    })),
    userMember
  ];

  // 1. Sort by Discipline score (workouts * 10 + adherence * 2)
  const sortedByDiscipline = [...rawMembers].sort((a, b) => {
    const scoreA = a.workouts * 10 + a.disciplineAdherencePercent * 2;
    const scoreB = b.workouts * 10 + b.disciplineAdherencePercent * 2;
    return scoreB - scoreA;
  });

  // 2. Sort by Consistency score (streak * 10 + (longestStreak || streak) * 2)
  const sortedByConsistency = [...rawMembers].sort((a, b) => {
    const scoreA = a.streak * 10 + (a.longestStreak || a.streak) * 2;
    const scoreB = b.streak * 10 + (b.longestStreak || b.streak) * 2;
    return scoreB - scoreA;
  });

  // 3. Sort by Overall XP
  const sortedByXP = [...rawMembers].sort((a, b) => b.xp - a.xp);

  // Map ranks
  const disciplineRanks = new Map<string, number>();
  sortedByDiscipline.forEach((m, idx) => disciplineRanks.set(m.id, idx + 1));

  const consistencyRanks = new Map<string, number>();
  sortedByConsistency.forEach((m, idx) => consistencyRanks.set(m.id, idx + 1));

  const overallRanks = new Map<string, number>();
  sortedByXP.forEach((m, idx) => overallRanks.set(m.id, idx + 1));

  // 4. Assign Badges dynamically based on true relative performance
  return rawMembers.map((member) => {
    const discRank = disciplineRanks.get(member.id) || 99;
    const consRank = consistencyRanks.get(member.id) || 99;
    const ovRank = overallRanks.get(member.id) || 99;

    const assignedBadges: LeaderboardBadge[] = [];

    // --- DISCIPLINE BADGES ---
    if (discRank === 1) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['iron-discipline'],
        currentHolderName: member.name
      });
    } else if (discRank <= 3 && member.workouts >= 15) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['discipline-stalwart'],
        currentHolderName: member.name
      });
    } else if (member.workouts >= 10 && member.disciplineAdherencePercent >= 80) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['iron-will'],
        currentHolderName: member.name
      });
    }

    // --- CONSISTENCY BADGES ---
    if (consRank === 1) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['unbroken-flame'],
        currentHolderName: member.name
      });
    } else if (consRank <= 3 && member.streak >= 14) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['streak-sentinel'],
        currentHolderName: member.name
      });
    } else if (member.streak >= 7) {
      assignedBadges.push({
        ...LEADERBOARD_BADGES['daily-devotee'],
        currentHolderName: member.name
      });
    }

    return {
      ...member,
      disciplineRank: discRank,
      consistencyRank: consRank,
      overallRank: ovRank,
      badges: assignedBadges
    };
  });
}

/**
 * Returns the #1 performer in Discipline.
 */
export function getDisciplineChampion(members: LeaderboardMember[]): LeaderboardMember | undefined {
  return members.find(m => m.disciplineRank === 1);
}

/**
 * Returns the #1 performer in Consistency.
 */
export function getConsistencyChampion(members: LeaderboardMember[]): LeaderboardMember | undefined {
  return members.find(m => m.consistencyRank === 1);
}

/**
 * Calculates friendly rivalry tips for the current user
 * regarding what is needed to advance in Discipline or Consistency.
 */
export function getUserRivalryInsights(
  userMember: LeaderboardMember,
  members: LeaderboardMember[]
): {
  disciplineTip: string;
  consistencyTip: string;
  nextDisciplineRival?: LeaderboardMember;
  nextConsistencyRival?: LeaderboardMember;
} {
  const disciplineSorted = [...members].sort((a, b) => (a.disciplineRank || 99) - (b.disciplineRank || 99));
  const consistencySorted = [...members].sort((a, b) => (a.consistencyRank || 99) - (b.consistencyRank || 99));

  const userDiscIndex = disciplineSorted.findIndex(m => m.isCurrentUser);
  const nextDiscRival = userDiscIndex > 0 ? disciplineSorted[userDiscIndex - 1] : undefined;

  const userConsIndex = consistencySorted.findIndex(m => m.isCurrentUser);
  const nextConsRival = userConsIndex > 0 ? consistencySorted[userConsIndex - 1] : undefined;

  let disciplineTip = 'You are the #1 Iron Discipline Champion! Maintain your high volume to defend the crown.';
  if (nextDiscRival) {
    const diff = Math.max(1, nextDiscRival.workouts - userMember.workouts + 1);
    disciplineTip = `Complete ${diff} more workout${diff > 1 ? 's' : ''} to surpass ${nextDiscRival.name} for Rank #${nextDiscRival.disciplineRank} in Discipline.`;
  }

  let consistencyTip = 'You guard the #1 Unbroken Flame! Keep your daily streak burning to stay undefeated.';
  if (nextConsRival) {
    const diff = Math.max(1, nextConsRival.streak - userMember.streak + 1);
    consistencyTip = `Maintain your streak for ${diff} more day${diff > 1 ? 's' : ''} to overtake ${nextConsRival.name} for Rank #${nextConsRival.consistencyRank} in Consistency.`;
  }

  return {
    disciplineTip,
    consistencyTip,
    nextDisciplineRival: nextDiscRival,
    nextConsistencyRival: nextConsRival
  };
}
