export type CircleRole = 'Founder' | 'Officer' | 'Brother';

export type CircleCrestIcon = 'Mountain' | 'Shield' | 'Flame' | 'Crown' | 'Swords' | 'TreePine' | 'Zap' | 'Footprints';

export type CircleFocusCategory =
  | 'Trail & Altitude'
  | 'Strength & Calisthenics'
  | 'Dawn Discipline'
  | 'Hybrid Endurance'
  | 'General Brotherhood';

export type CircleChallengeCategory =
  | 'Strength'
  | 'Endurance'
  | 'Trail & Elevation'
  | 'Daily Discipline'
  | 'Metabolic Burn';

export type ChallengeMetricType =
  | 'reps'        // e.g. Push-ups, Squats, Pull-ups
  | 'distance'    // km (Running, Hiking, Cycling)
  | 'workouts'    // Completed workout sessions
  | 'elevation'   // Meters of elevation gain
  | 'calories'    // Active calories burned
  | 'streak';     // Days active / streak

export type CircleChallengeMetric = ChallengeMetricType;

export interface CircleChallengeParticipant {
  memberId: string;
  memberName: string;
  avatar: string;
  currentValue: number;
  completed: boolean;
  lastLogDate: string;
}

export interface CircleChallenge {
  id: string;
  circleId: string;
  title: string;
  description: string;
  category: 'Strength' | 'Endurance' | 'Trail & Elevation' | 'Daily Discipline' | 'Metabolic Burn';
  metric: ChallengeMetricType;
  metricUnit: string; // 'reps', 'km', 'workouts', 'meters', 'kcal', 'days'
  targetValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  xpReward: number;
  badgeRewardName?: string;
  createdBy: {
    id: string;
    name: string;
  };
  participants: CircleChallengeParticipant[];
}

export interface CircleMember {
  id: string;
  name: string;
  avatar: string;
  level: string;
  role: CircleRole;
  joinedAt: string;
  stats: {
    totalPoints: number;
    challengesCompleted: number;
    currentStreak: number;
    weeklyContribution: number;
  };
  isCurrentUser?: boolean;
}

export interface CircleActivityItem {
  id: string;
  circleId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  type: 'challenge_created' | 'challenge_completed' | 'progress_logged' | 'member_joined' | 'cheer' | 'chat';
}

export interface BrotherhoodCircle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  crestIcon: 'Mountain' | 'Shield' | 'Flame' | 'Crown' | 'Swords' | 'TreePine' | 'Zap' | 'Footprints';
  themeColor: string;
  isPrivate: boolean;
  inviteCode: string;
  founderId: string;
  founderName: string;
  createdAt: string;
  focusCategory: 'Trail & Altitude' | 'Strength & Calisthenics' | 'Dawn Discipline' | 'Hybrid Endurance' | 'General Brotherhood';
  members: CircleMember[];
  challenges: CircleChallenge[];
  activityFeed: CircleActivityItem[];
}
