export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PrimaryGoal =
  | 'Strength'
  | 'Muscle building'
  | 'Fat loss'
  | 'Endurance'
  | 'Mobility'
  | 'General fitness'
  | 'Mental wellness'
  | 'Discipline';

export type TrainingEnvironment = 'Home' | 'Gym' | 'Outdoors' | 'Mixed';

export type BAMembershipStatus =
  | 'Active BA Challenger'
  | 'BA Alum'
  | 'Prospective Brother'
  | 'Guest';

export type PantherLevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PantherLevel {
  id: PantherLevelId;
  name: string;
  minXp: number;
  maxXp: number;
  tagline: string;
  badgeIcon: string;
}

export interface DailyHabit {
  id: string;
  label: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  bio?: string;
  email?: string;
  avatarUrl: string;
  ageBracket: string;
  fitnessLevel: FitnessLevel;
  primaryGoal: PrimaryGoal;
  trainingFrequency: number;
  availableDays: string[];
  preferredEnvironment: TrainingEnvironment;
  injuries: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  baMembershipStatus: BAMembershipStatus;
  joinedDate: string;
  themePreference?: 'standard' | 'amber';
  lastWeeklySummaryDate?: string;
  pantherLevel: PantherLevelId;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
    workoutsThisMonth: number;
    daysActiveTotal: number;
    challengesCompletedTotal: number;
  };
  treesPlanted: number;
  hikesCompleted: number;
  weightKg?: number;
  heightCm?: number;
  isPublicRanking: boolean;
  role: 'member' | 'coach' | 'admin';
  membershipTier: 'FREE PANTHER' | 'BA PANTHER' | 'PANTHER PRO' | 'PANTHER ELITE';
  isPremium?: boolean;
  premiumTier?: 'free' | 'apex';
  premiumExpiresAt?: string;
  subscriptionPlan?: 'monthly' | 'annual';
  paymentMethod?: string;
  dailyHabits?: DailyHabit[];
  lastHabitResetDate?: string;
  habitReminderTime?: string;
  hydration?: {
    current: number; // e.g. in ml
    goal: number;
    date: string;
  };
}

export type ExerciseCategory = 'Strength' | 'Cardio' | 'Mobility' | 'Bodyweight';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  subcategory: string; // e.g. 'Full body', 'Upper body', 'Push', 'Pull', 'Legs', 'Morning mobility'
  description: string;
  targetMuscles: string[];
  equipmentNeeded: string; // e.g. 'None (Bodyweight)', 'Dumbbells', 'Pull-up Bar', 'Trail/Track'
  defaultSets: number;
  defaultReps: string; // e.g. '12 reps' or '45 seconds'
  defaultRestSec: number;
  videoUrl?: string;
  cueTips: string[];
  substitutes: string[]; // IDs of alternate exercises
}

export interface Workout {
  id: string;
  title: string;
  category: ExerciseCategory;
  subcategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  estimatedCalories: number;
  xpReward: number;
  description: string;
  coverImage?: string;
  equipmentRequired: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    restSec: number;
  }[];
}

export interface DailyDisciplineTask {
  id: string;
  title: string;
  category: 'Physical' | 'Mind' | 'Habit' | 'Brotherhood' | 'Nature' | 'Discipline';
  target: string;
  xp: number;
  completed: boolean;
  iconName: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Discipline' | 'Trail' | 'Consistency' | 'Brotherhood' | 'Green Legacy' | 'Mental';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type LeaderboardBadgeCategory = 'Discipline' | 'Consistency';
export type LeaderboardBadgeTier = 'champion' | 'gold' | 'silver' | 'bronze';

export interface LeaderboardBadge {
  id: string;
  title: string;
  category: LeaderboardBadgeCategory;
  tier: LeaderboardBadgeTier;
  rankRequirement?: number;
  description: string;
  shortCriteria: string;
  iconName: string;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  currentHolderName?: string;
}

export interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  level: string;
  streak: number; // For Consistency
  longestStreak?: number;
  workouts: number; // For Discipline
  disciplineAdherencePercent: number; // % of target tasks completed
  xp: number;
  trees: number;
  isCurrentUser?: boolean;
  cheersReceived?: number;
  badges?: LeaderboardBadge[];
  quote?: string;
  disciplineRank?: number;
  consistencyRank?: number;
  overallRank?: number;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: string;
  createdAt: string;
  content: string;
  imageUrl?: string;
  workoutHighlight?: string;
  reactions: {
    panther: number;
    strong: number;
    respect: number;
    greenLegacy: number;
    wellDone: number;
  };
  userReactions: string[]; // e.g. ['respect', 'strong']
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface BAEvent {
  id: string;
  title: string;
  type: 'Hike' | 'Bootcamp' | 'Wellness Walk' | 'Fitness Challenge' | 'Camping' | 'Tree Planting' | 'Social';
  date: string;
  time: string;
  location: string;
  coordinates?: string;
  description: string;
  capacity: number;
  registeredCount: number;
  isRegistered: boolean;
  leadCoach: string;
  xpReward: number;
  gearRequired: string[];
  environmentalPillar?: boolean;
}

export interface TrainingPlan {
  id: string;
  title: string;
  tagline: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  fitnessLevel: FitnessLevel;
  goal: PrimaryGoal;
  description: string;
  currentWeek: number;
  isEnrolled: boolean;
}

export interface WellnessResource {
  id: string;
  title: string;
  type: 'Breathing' | 'Meditation' | 'Reflection' | 'Directory';
  duration?: string;
  description: string;
  content: string;
  audioGuide?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'morning' | 'missed' | 'milestone' | 'community' | 'event' | 'green' | 'challenge';
  read: boolean;
}

export interface EnvironmentalChallenge {
  id: string;
  title: string;
  targetTrees: number;
  currentTrees: number;
  location: string;
  deadline: string;
  participants: number;
}

export interface AtmosphericConditions {
  temperatureC: number;
  temperatureF: number;
  apparentTemperatureC: number;
  apparentTemperatureF: number;
  relativeHumidity: number; // percentage, e.g. 58%
  dewPointC: number;
  windSpeedKmh: number; // in km/h
  windSpeedMps: number; // in m/s
  windDirectionDeg: number; // 0-360 degrees
  windDirectionCompass: string; // 'N', 'NE', etc.
  windGustsKmh: number;
  weatherCode: number;
  weatherDescription: string;
  surfacePressureHpa: number;
  uvIndex: number;
  airDensityKgM3: number; // e.g. 1.05 kg/m3 at altitude
  trailConditionNote: string;
  headwindKmh?: number; // relative to athlete's bearing
  crosswindKmh?: number;
  windEffect?: 'headwind' | 'tailwind' | 'crosswind' | 'calm';
  timestamp: string;
  source: 'live' | 'cached' | 'fallback';
}

export interface ActivityLog {
  id: string;
  title: string;
  category: ExerciseCategory;
  durationMinutes: number;
  caloriesBurned: number;
  stepsRecorded?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10 scale)
  totalVolumeKg?: number; // Volume load (weight * reps * sets) in kg
  totalSets?: number;
  totalReps?: number;
  distanceKm?: number; // Distance in kilometers for walk/hike/run
  elevationGainMeters?: number; // Cumulative elevation ascent in meters
  avgPace?: string; // Formatted pace e.g. "5:32 /km"
  activityType?: 'walk' | 'hike' | 'run' | 'cycle' | 'workout';
  routePoints?: { lat: number; lng: number; ele?: number }[];
  weatherConditions?: AtmosphericConditions;
  notes?: string;
  date: string;
  isoDate?: string;
  timestamp?: number;
  xpEarned: number;
}

export interface DeepWorkoutAnalysis {
  recoveryScore: number; // 0-100
  acwrRatio: number; // Acute-to-Chronic Workload Ratio (0.8 - 1.5+)
  acwrStatus: 'Optimal' | 'Caution: High Strain' | 'Recovery Deficit' | 'Deconditioned';
  fatigueIndex: number; // 0-100
  biomechanicalLoadMap: {
    group: string;
    loadPercentage: number;
    intensity: 'High' | 'Moderate' | 'Low';
    totalVolumeKg: number;
  }[];
  metabolicSplits: {
    aerobicBasePercent: number;
    glycolyticThresholdPercent: number;
    atpPhosphagenPercent: number;
  };
  gradeAdjustedPace?: string;
  elevationStrainIndex?: number;
  progressiveVelocityForecast: {
    week: string;
    projectedVolumeKg: number;
    confidencePercent: number;
  }[];
  aiCoachTacticalNotes: string[];
}

export type ReadinessState = 'optimal' | 'moderate' | 'low';

export interface HRVDayData {
  day: string; // 'Mon', 'Tue', etc.
  dateStr: string; // 'YYYY-MM-DD'
  hrv: number; // rMSSD in ms (e.g. 72)
  baselineHrv: number; // e.g. 64
  recoveryScore: number; // 0-100% (e.g. 88)
  restingHeartRate: number; // bpm (e.g. 52)
  sleepScore: number; // 0-100% (e.g. 91)
  sleepHours: number; // e.g. 8.1
  readinessState: ReadinessState;
}

export interface IntradayHRVPoint {
  time: string; // '01:00', '02:00', etc.
  hrv: number; // ms
  heartRate: number; // bpm
  stage: 'Deep Sleep' | 'REM Sleep' | 'Light Sleep' | 'Awake / Morning Baseline';
}

export interface UserReadinessData {
  score: number; // 0-100 (e.g. 88)
  state: ReadinessState;
  stateLabel: string; // 'Prime to Train' | 'Balanced / Steady Load' | 'Recovery Recommended'
  hrvCurrent: number; // ms rMSSD
  hrvBaseline: number; // ms rMSSD
  hrvTrendPercent: number; // e.g. +12.5%
  restingHeartRate: number; // bpm
  rhrBaseline: number; // bpm
  sleepHours: number; // 8.2
  sleepQualityPercent: number; // 92
  recoveryPercent: number; // 88
  nervousSystemStatus: string; // 'Parasympathetic Tone (High Adaptability)'
  trainingRecommendation: string;
  recommendedIntensity: 'High' | 'Moderate' | 'Active Recovery';
  history: HRVDayData[];
  intraday: IntradayHRVPoint[];
}

export interface ThirtyDayRecoveryPoint {
  dayNumber: number; // 1 to 30
  dateStr: string; // 'YYYY-MM-DD'
  displayDate: string; // e.g. 'Aug 16'
  dayOfWeek: string; // 'Mon'
  hrv: number; // rMSSD in ms
  restingHeartRate: number; // bpm
  recoveryScore: number; // 0-100%
  baselineHrv: number; // ms
  baselineRhr: number; // bpm
  rollingAvgHrv: number; // 7-day rolling avg ms
  rollingAvgRhr: number; // 7-day rolling avg bpm
  sleepHours: number;
  sleepScore: number;
  readinessState: ReadinessState;
  strainDescription?: string;
}

export interface ThirtyDayRecoverySummary {
  points: ThirtyDayRecoveryPoint[];
  avgHrv: number;
  avgRhr: number;
  minHrv: number;
  maxHrv: number;
  minRhr: number;
  maxRhr: number;
  hrvTrendDeltaPercent: number; // positive = improving
  rhrTrendDeltaBpm: number; // negative = improving
  optimalDays: number;
  balancedDays: number;
  fatiguedDays: number;
  recoveryConsistencyPercent: number;
}

export interface BiomechanicsDimension {
  score: number; // 0-100
  status: 'optimal' | 'warning' | 'alert';
  observation: string;
}


export interface FormBiomechanicsAnalysis {
  id: string;
  exerciseName: string;
  timestamp: string;
  formScore: number; // 0-100
  verdict: string;
  biomechanicsBreakdown: {
    jointAlignment: BiomechanicsDimension;
    spinePelvisStability: BiomechanicsDimension;
    rangeOfMotion: BiomechanicsDimension;
    tempoControl: BiomechanicsDimension;
  };
  strengths: string[];
  corrections: string[];
  injuryRiskAssessment: {
    riskLevel: 'low' | 'moderate' | 'high';
    potentialStrainArea: string;
    preventionTip: string;
  };
  pantherCoachingCue: string;
  videoDurationSec?: number;
  previewThumbnail?: string;
}

export * from './types/circles';

