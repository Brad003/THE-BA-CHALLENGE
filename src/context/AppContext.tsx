import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CelebrationOverlay } from '../components/common/CelebrationOverlay';
import {
  UserProfile,
  Workout,
  Exercise,
  DailyDisciplineTask,
  Badge,
  CommunityPost,
  BAEvent,
  TrainingPlan,
  WellnessResource,
  EnvironmentalChallenge,
  AppNotification,
  PantherLevel,
  ActivityLog,
  ExerciseCategory,
  AtmosphericConditions,
  FormBiomechanicsAnalysis,
  BrotherhoodCircle,
  CircleActivityItem
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_WORKOUTS,
  INITIAL_EXERCISES,
  INITIAL_DISCIPLINE_TASKS,
  INITIAL_BADGES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_EVENTS,
  INITIAL_TRAINING_PLANS,
  INITIAL_WELLNESS_RESOURCES,
  INITIAL_ENVIRONMENTAL_CHALLENGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  PANTHER_LEVELS
} from '../data/initialData';
import { INITIAL_BROTHERHOOD_CIRCLES } from '../data/circlesData';
import { UserService } from '../services/userService';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  FirebaseUser,
  handleFirestoreError,
  OperationType,
  testConnection,
  getAccessToken,
  setAccessToken
} from '../firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  workouts: Workout[];
  exercises: Exercise[];
  disciplineTasks: DailyDisciplineTask[];
  badges: Badge[];
  communityPosts: CommunityPost[];
  events: BAEvent[];
  trainingPlans: TrainingPlan[];
  wellnessResources: WellnessResource[];
  environmentalChallenges: EnvironmentalChallenge[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  unreadNotificationCount: number;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  activeTab: 'home' | 'train' | 'challenges' | 'community' | 'profile';
  setActiveTab: (tab: 'home' | 'train' | 'challenges' | 'community' | 'profile') => void;
  
  // Firebase Auth & Cloud Sync
  firebaseUser: FirebaseUser | null;
  isAuthReady: boolean;
  isSyncing: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Modals state
  workoutPlayerWorkout: Workout | null;
  setWorkoutPlayerWorkout: (w: Workout | null) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  setShowOnboardingModal: (show: boolean) => void;
  showLogActivity: boolean;
  setShowLogActivity: (show: boolean) => void;
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  showWeeklySummaryModal: boolean;
  showBuildWorkoutModal: boolean;
  setShowBuildWorkoutModal: (show: boolean) => void;
  setShowWeeklySummaryModal: (show: boolean) => void;
  showWellnessModal: boolean;
  setShowWellnessModal: (show: boolean) => void;
  showGreenLegacyModal: boolean;
  setShowGreenLegacyModal: (show: boolean) => void;
  showLeaderboardModal: boolean;
  setShowLeaderboardModal: (show: boolean) => void;
  showNotificationsModal: boolean;
  setShowNotificationsModal: (show: boolean) => void;
  showTrainingPlansModal: boolean;
  setShowTrainingPlansModal: (show: boolean) => void;
  showOutdoorTracker: boolean;
  setShowOutdoorTracker: (show: boolean) => void;
  outdoorTrackerInitialMode: 'walk' | 'hike' | 'run' | 'cycle';
  setOutdoorTrackerInitialMode: (mode: 'walk' | 'hike' | 'run' | 'cycle') => void;

  // Premium Membership & Deep Analytics
  isPremium: boolean;
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  showDeepAnalysisModal: boolean;
  setShowDeepAnalysisModal: (show: boolean) => void;
  premiumFeatureLockedNotice: string | null;
  openPremiumUpgrade: (featureName?: string) => void;
  upgradeToPremium: (plan: 'monthly' | 'annual', paymentMethod: string) => Promise<void>;
  cancelPremium: () => void;
  selectedWorkoutForAnalysis: ActivityLog | null;
  setSelectedWorkoutForAnalysis: (log: ActivityLog | null) => void;

  // AI Video Form Biomechanics Analysis
  showFormAnalysisModal: boolean;
  setShowFormAnalysisModal: (show: boolean) => void;
  formAnalysisTargetExercise: { name: string; category?: string; targetMuscles?: string[]; subcategory?: string } | null;
  setFormAnalysisTargetExercise: (ex: { name: string; category?: string; targetMuscles?: string[]; subcategory?: string } | null) => void;
  openFormAnalysis: (exercise?: { name: string; category?: string; targetMuscles?: string[]; subcategory?: string }) => void;
  savedFormAnalyses: FormBiomechanicsAnalysis[];
  saveFormAnalysis: (analysis: FormBiomechanicsAnalysis) => void;

  // Brotherhood Circles & Custom Challenges
  brotherhoodCircles: BrotherhoodCircle[];
  activeCircleId: string | null;
  setActiveCircleId: (id: string | null) => void;
  createBrotherhoodCircle: (data: {
    name: string;
    tagline: string;
    description: string;
    crestIcon: 'Mountain' | 'Shield' | 'Flame' | 'Crown' | 'Swords' | 'TreePine' | 'Zap' | 'Footprints';
    themeColor: string;
    focusCategory: 'Trail & Altitude' | 'Strength & Calisthenics' | 'Dawn Discipline' | 'Hybrid Endurance' | 'General Brotherhood';
    inviteCode?: string;
  }) => BrotherhoodCircle;
  joinBrotherhoodCircleByCode: (code: string) => { success: boolean; message: string; circle?: BrotherhoodCircle };
  leaveBrotherhoodCircle: (circleId: string) => void;
  createCircleChallenge: (
    circleId: string,
    challengeData: {
      title: string;
      description: string;
      category: 'Strength' | 'Endurance' | 'Trail & Elevation' | 'Daily Discipline' | 'Metabolic Burn';
      metric: 'reps' | 'distance' | 'workouts' | 'elevation' | 'calories' | 'streak';
      metricUnit: string;
      targetValue: number;
      endDate: string;
      xpReward: number;
      badgeRewardName?: string;
    }
  ) => void;
  logCircleChallengeProgress: (
    circleId: string,
    challengeId: string,
    addedValue: number,
    note?: string
  ) => void;
  sendCircleCheerOrMessage: (circleId: string, messageText: string, type?: 'cheer' | 'chat') => void;

  // Actions
  updateUserProfile: (data: Partial<UserProfile>) => void;
  completeWorkout: (workout: Workout, durationMins: number, calories: number, xp: number, userRpe?: number) => void;
  logOutdoorSession: (session: {
    mode: 'walk' | 'hike' | 'run' | 'cycle';
    title: string;
    durationMinutes: number;
    distanceKm: number;
    elevationGainMeters: number;
    steps: number;
    caloriesBurned: number;
    avgPace: string;
    rpe?: number;
    routePoints?: { lat: number; lng: number; ele?: number }[];
    weatherConditions?: AtmosphericConditions;
    notes?: string;
  }) => void;
  toggleDisciplineTask: (taskId: string) => void;
  addCommunityPost: (content: string, imageUrl?: string, workoutHighlight?: string) => void;
  reactToPost: (postId: string, reactionType: 'panther' | 'strong' | 'respect' | 'greenLegacy' | 'wellDone') => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  toggleEventRegistration: (eventId: string) => void;
  plantTrees: (count: number) => void;
  addXP: (amount: number, reason: string) => void;
  logCustomActivity: (
    title: string,
    category: string,
    durationMins: number,
    calories: number,
    rpe?: number,
    totalVolumeKg?: number,
    totalSets?: number
  ) => void;
  substituteWorkoutExercise: (workoutId: string, oldExerciseId: string, newExerciseId: string) => void;
  toggleDailyHabit: (habitId: string) => void;
  editDailyHabit: (habitId: string, newLabel: string) => void;
  logWaterIntake: (amountMl: number) => void;
  markNotificationsAsRead: () => void;
  resetAllData: () => void;
  exportDataJSON: () => void;
  triggerCelebration: (type: 'workout' | 'habit' | 'badge' | 'level', payload?: string) => void;
  currentLevelInfo: PantherLevel;
  nextLevelInfo: PantherLevel | null;
  xpProgressPercent: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Admin Actions
  addWorkoutAdmin: (workout: Workout) => void;
  deleteWorkoutAdmin: (workoutId: string) => void;
  addEventAdmin: (event: BAEvent) => void;
  awardBadgeAdmin: (badgeId: string) => void;
  broadcastAnnouncementAdmin: (title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'panther_ba_app_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or fallback
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_USER;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}workouts`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_WORKOUTS;
  });

  const [exercises] = useState<Exercise[]>(INITIAL_EXERCISES);

  const [disciplineTasks, setDisciplineTasks] = useState<DailyDisciplineTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}discipline`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DISCIPLINE_TASKS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}badges`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BADGES;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}posts`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  const [events, setEvents] = useState<BAEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EVENTS;
  });

  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(INITIAL_TRAINING_PLANS);
  const [wellnessResources, setWellnessResources] = useState<WellnessResource[]>(INITIAL_WELLNESS_RESOURCES);
  const [environmentalChallenges, setEnvironmentalChallenges] = useState<EnvironmentalChallenge[]>(INITIAL_ENVIRONMENTAL_CHALLENGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'train' | 'challenges' | 'community' | 'profile'>('home');
  const [workoutPlayerWorkout, setWorkoutPlayerWorkout] = useState<Workout | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showLogActivity, setShowLogActivity] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showWeeklySummaryModal, setShowWeeklySummaryModal] = useState<boolean>(false);
  const [showBuildWorkoutModal, setShowBuildWorkoutModal] = useState<boolean>(false);
  const [showWellnessModal, setShowWellnessModal] = useState<boolean>(false);
  const [showGreenLegacyModal, setShowGreenLegacyModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showTrainingPlansModal, setShowTrainingPlansModal] = useState<boolean>(false);
  const [showOutdoorTracker, setShowOutdoorTracker] = useState<boolean>(false);
  const [outdoorTrackerInitialMode, setOutdoorTrackerInitialMode] = useState<'walk' | 'hike' | 'run' | 'cycle'>('walk');
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [showDeepAnalysisModal, setShowDeepAnalysisModal] = useState<boolean>(false);
  const [premiumFeatureLockedNotice, setPremiumFeatureLockedNotice] = useState<string | null>(null);
  const [selectedWorkoutForAnalysis, setSelectedWorkoutForAnalysis] = useState<ActivityLog | null>(null);

  // AI Video Form Biomechanics Analysis State
  const [showFormAnalysisModal, setShowFormAnalysisModal] = useState<boolean>(false);
  const [formAnalysisTargetExercise, setFormAnalysisTargetExercise] = useState<{
    name: string;
    category?: string;
    targetMuscles?: string[];
    subcategory?: string;
  } | null>(null);
  const [savedFormAnalyses, setSavedFormAnalyses] = useState<FormBiomechanicsAnalysis[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}form_analyses`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Brotherhood Circles State
  const [brotherhoodCircles, setBrotherhoodCircles] = useState<BrotherhoodCircle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}brotherhood_circles`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_BROTHERHOOD_CIRCLES;
  });
  const [activeCircleId, setActiveCircleId] = useState<string | null>(null);

  const openFormAnalysis = (exercise?: { name: string; category?: string; targetMuscles?: string[]; subcategory?: string }) => {
    if (exercise) {
      setFormAnalysisTargetExercise(exercise);
    }
    setShowFormAnalysisModal(true);
  };

  const saveFormAnalysis = (analysis: FormBiomechanicsAnalysis) => {
    setSavedFormAnalyses(prev => {
      const updated = [analysis, ...prev.filter(a => a.id !== analysis.id)];
      try {
        localStorage.setItem(`${STORAGE_PREFIX}form_analyses`, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {
        console.error('Failed to cache form analysis:', e);
      }
      return updated;
    });
    setToastMessage(`Biomechanics form analysis for ${analysis.exerciseName} saved.`);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ isVisible: boolean; type: 'workout' | 'habit' | 'badge' | 'level'; payload?: string }>({ isVisible: false, type: 'workout' });

  // Firebase Auth and Cloud Sync State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}activity_logs`);
    if (saved) {
      try {
        const parsed: ActivityLog[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge user's saved items with INITIAL_ACTIVITY_LOGS so trends are comprehensive
          const existingIds = new Set(parsed.map(p => p.id));
          const missingInitials = INITIAL_ACTIVITY_LOGS.filter(i => !existingIds.has(i.id));
          return [...parsed, ...missingInitials];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Verify Firestore connection on application startup
  useEffect(() => {
    testConnection();
  }, []);

  // Listen for Firebase Auth changes and sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthReady(true);

      if (!fbUser) {
        setAccessToken(null);
      }

      if (fbUser) {
        setIsSyncing(true);
        try {
          const remoteData = await UserService.getUserProfile(fbUser.uid);

          if (remoteData) {
            // Recalculate progression from raw Firestore activity logs to guarantee accuracy
            const progression = await UserService.recalculateProgression(fbUser.uid);

            // Check if daily habits and hydration need resetting
            let syncedHabits = remoteData.dailyHabits || DEFAULT_USER.dailyHabits;
            let syncedResetDate = remoteData.lastHabitResetDate || DEFAULT_USER.lastHabitResetDate;
            let syncedHydration = remoteData.hydration || DEFAULT_USER.hydration;

            const todayStr = new Date().toISOString().split('T')[0];
            let needsResetUpdate = false;

            if (syncedResetDate !== todayStr && syncedHabits) {
              syncedHabits = syncedHabits.map((h: any) => ({ ...h, completed: false }));
              syncedResetDate = todayStr;
              needsResetUpdate = true;
            }

            if (syncedHydration && syncedHydration.date !== todayStr) {
              syncedHydration = { ...syncedHydration, current: 0, date: todayStr };
              needsResetUpdate = true;
            }

            if (needsResetUpdate) {
              UserService.saveUserProfile(fbUser.uid, { 
                dailyHabits: syncedHabits, 
                lastHabitResetDate: todayStr,
                hydration: syncedHydration
              }).catch(console.warn);
            }

            setUser(prev => ({
              ...prev,
              ...remoteData,
              dailyHabits: syncedHabits,
              lastHabitResetDate: syncedResetDate,
              hydration: syncedHydration,
              xp: progression.xp,
              pantherLevel: progression.level as any,
              id: fbUser.uid,
              email: fbUser.email || prev.email || '',
              fullName: fbUser.displayName || prev.fullName,
              avatarUrl: fbUser.photoURL || prev.avatarUrl,
              role: (fbUser.email === 'madahanabrad@gmail.com') ? 'coach' : (remoteData.role || prev.role || 'member')
            }));
            showToast(`Welcome back, Brother ${fbUser.displayName?.split(' ')[0] || 'Panther'}`);
          } else {
            // Document not found in Firestore or client is offline
            if (user.id === fbUser.uid && user.fullName) {
              setUser(prev => ({
                ...prev,
                email: fbUser.email || prev.email || '',
                fullName: prev.fullName || fbUser.displayName || 'Brother Panther',
                avatarUrl: prev.avatarUrl || fbUser.photoURL || DEFAULT_USER.avatarUrl,
              }));
            } else {
              const initialDoc: UserProfile = {
                ...user,
                id: fbUser.uid,
                fullName: fbUser.displayName || user.fullName,
                email: fbUser.email || user.email || '',
                avatarUrl: fbUser.photoURL || user.avatarUrl,
                role: (fbUser.email === 'madahanabrad@gmail.com') ? 'coach' : (user.role || 'member')
              };
              UserService.saveUserProfile(fbUser.uid, initialDoc).catch(console.warn);
              setUser(initialDoc);
              showToast('Panther profile fortified & ready.');
              
              if (!user.fullName || user.fullName === 'Brother Panther') {
                setShowOnboarding(true);
              }
            }
          }
        } catch (err) {
          console.warn('Firestore user sync fallback:', err);
        } finally {
          setIsSyncing(false);
        }

        // Real-time listener for community posts feed
        try {
          const unsubPosts = onSnapshot(
            collection(db, 'posts'),
            (snapshot) => {
              if (!snapshot.empty) {
                const remotePosts: CommunityPost[] = [];
                snapshot.forEach(docSnap => {
                  remotePosts.push(docSnap.data() as CommunityPost);
                });
                setCommunityPosts(remotePosts);
              }
            },
            (err) => {
              console.warn('Real-time posts sync note:', err.message);
            }
          );
          return () => unsubPosts();
        } catch (err) {
          console.warn('Error attaching community posts listener:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}activity_logs`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}workouts`, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}discipline`, JSON.stringify(disciplineTasks));
  }, [disciplineTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}brotherhood_circles`, JSON.stringify(brotherhoodCircles));
  }, [brotherhoodCircles]);

  // Dynamically recalculate badge progress based on user stats
  useEffect(() => {
    let newlyUnlockedBadge: string | null = null;
    
    setBadges(prevBadges => {
      let changed = false;
      const newBadges = prevBadges.map(badge => {
        let currentProgress = badge.progress;
        
        switch (badge.id) {
          case 'b-7day':
            currentProgress = Math.max(currentProgress, user.streak.longest);
            break;
          case 'b-30day':
            currentProgress = Math.max(currentProgress, user.streak.longest);
            break;
          case 'b-trail':
            currentProgress = Math.max(currentProgress, user.hikesCompleted * 10);
            break;
          case 'b-green':
            currentProgress = Math.max(currentProgress, user.treesPlanted);
            break;
          case 'b-consistency':
          case 'b-100':
            currentProgress = Math.max(currentProgress, activityLogs.length);
            break;
          case 'b-mental':
            currentProgress = Math.max(currentProgress, user.streak.challengesCompletedTotal);
            break;
          case 'b-early':
            // Approximate based on days active
            currentProgress = Math.max(currentProgress, Math.floor(user.streak.daysActiveTotal * 0.7));
            break;
          case 'b-brotherhood':
            // Based on events and days active roughly
            currentProgress = Math.max(currentProgress, Math.floor(user.streak.daysActiveTotal * 1.5));
            break;
        }
        
        // Cap progress at maxProgress
        currentProgress = Math.min(currentProgress, badge.maxProgress);
        
        let unlockedAt = badge.unlockedAt;
        if (currentProgress >= badge.maxProgress && !unlockedAt) {
          unlockedAt = new Date().toISOString().split('T')[0];
          newlyUnlockedBadge = badge.title; // Safely get title
        }

        if (currentProgress !== badge.progress || unlockedAt !== badge.unlockedAt) {
          changed = true;
          return { ...badge, progress: currentProgress, unlockedAt };
        }
        return badge;
      });

      return changed ? newBadges : prevBadges;
    });

    if (newlyUnlockedBadge) {
      triggerCelebration('badge', newlyUnlockedBadge);
      showToast(`Badge Unlocked: ${newlyUnlockedBadge}`);
    }
  }, [
    user.streak.longest, 
    user.hikesCompleted, 
    user.treesPlanted, 
    activityLogs.length, 
    user.streak.challengesCompletedTotal, 
    user.streak.daysActiveTotal
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  const triggerCelebration = (type: 'workout' | 'habit' | 'badge' | 'level', payload?: string) => {
    setCelebration({ isVisible: true, type, payload });
  };

  // Helper calculation for Level
  const currentLevelInfo = PANTHER_LEVELS.find(l => l.id === user.pantherLevel) || PANTHER_LEVELS[0];
  const nextLevelIndex = PANTHER_LEVELS.findIndex(l => l.id === user.pantherLevel);
  const nextLevelInfo = nextLevelIndex < PANTHER_LEVELS.length - 1 ? PANTHER_LEVELS[nextLevelIndex + 1] : null;

  const xpProgressPercent = nextLevelInfo
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((user.xp - currentLevelInfo.minXp) / (currentLevelInfo.maxXp - currentLevelInfo.minXp)) * 100
          )
        )
      )
    : 100;

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'community') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString().split('T')[0], // Simplified timestamp
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`New Notification: ${title}`);
  };

  const addXP = (amount: number, reason: string) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      // Check if leveled up
      let newLevel = prev.pantherLevel;
      for (let i = PANTHER_LEVELS.length - 1; i >= 0; i--) {
        if (newXp >= PANTHER_LEVELS[i].minXp) {
          newLevel = PANTHER_LEVELS[i].id;
          break;
        }
      }

      if (newLevel > prev.pantherLevel) {
        const levelData = PANTHER_LEVELS.find(l => l.id === newLevel);
        triggerCelebration('level', levelData?.name || 'New Rank');
        showToast(`Level Up: You attained ${levelData?.name || 'New Rank'}`);
      } else {
        showToast(`+${amount} XP: ${reason}`);
      }

      const updatedUser = {
        ...prev,
        xp: newXp,
        pantherLevel: newLevel
      };
      
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updatedUser).catch(e => console.warn(e));
      }
      
      return updatedUser;
    });
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updated).catch(err => {
          console.warn('Failed to sync profile updates to Firestore:', err);
        });
      }
      return updated;
    });
    showToast('Profile updated successfully');
  };

  const loginWithGoogle = async () => {
    try {
      setIsSyncing(true);
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
      }
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      showToast('Google sign-in was cancelled or interrupted.');
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setFirebaseUser(null);
      setAccessToken(null);
      showToast('Logged out of Panther Cloud session.');
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  };

  const completeWorkout = (
    workout: Workout,
    durationMins: number,
    calories: number,
    xp: number,
    userRpe?: number
  ) => {
    triggerCelebration('workout');
    
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute volume metrics from workout exercises
    const totalSets = (workout.exercises || []).reduce((sum, e) => sum + (e.sets || 3), 0);
    const totalReps = (workout.exercises || []).reduce((sum, e) => {
      const repsNum = parseInt(e.reps) || 12;
      return sum + (e.sets || 3) * repsNum;
    }, 0);
    const multiplier = workout.category === 'Strength' ? 35 : workout.category === 'Bodyweight' ? 22 : 15;
    const estimatedVolume = totalReps * multiplier;
    const defaultRpe = workout.difficulty === 'Beginner' ? 6.5 : workout.difficulty === 'Intermediate' ? 7.8 : 8.8;

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title: workout.title,
      category: workout.category,
      durationMinutes: durationMins,
      caloriesBurned: calories,
      rpe: userRpe !== undefined ? userRpe : defaultRpe,
      totalVolumeKg: estimatedVolume,
      totalSets,
      totalReps,
      date: 'Today',
      isoDate: todayStr,
      timestamp: Date.now(),
      xpEarned: xp
    };
    setActivityLogs(prev => [newLog, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid, 'activities', newLog.id), newLog).catch(e => {
        console.warn('Subcollection write note:', e);
      });
    }

    // Update streak and activity
    setUser(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
      
      let newCurrentStreak = prev.streak.current;
      let newLongestStreak = prev.streak.longest;
      const isNewDay = prev.streak.lastActiveDate !== todayStr;
      
      if (isNewDay) {
        if (prev.streak.lastActiveDate === yesterdayStr) {
          newCurrentStreak += 1;
        } else {
          newCurrentStreak = 1;
        }
        newLongestStreak = Math.max(newCurrentStreak, newLongestStreak);
      }

      const updated: UserProfile = {
        ...prev,
        streak: {
          ...prev.streak,
          current: newCurrentStreak,
          longest: newLongestStreak,
          lastActiveDate: todayStr,
          workoutsThisMonth: prev.streak.workoutsThisMonth + 1,
          daysActiveTotal: isNewDay ? prev.streak.daysActiveTotal + 1 : prev.streak.daysActiveTotal
        }
      };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updated).catch(e => console.warn(e));
      }
      return updated;
    });

    addXP(xp, `Completed ${workout.title}`);
    showToast(`Workout Completed! +${xp} XP earned.`);

    // Add milestone notification if reached 15 days or 100 workouts
    if (user.streak.current + 1 === 15) {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: '15-Day Discipline Milestone',
        message: '“That’s not motivation. That’s character.” Keep holding the line, Panther.',
        timestamp: 'Just now',
        type: 'milestone',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const logOutdoorSession = (session: {
    mode: 'walk' | 'hike' | 'run' | 'cycle';
    title: string;
    durationMinutes: number;
    distanceKm: number;
    elevationGainMeters: number;
    steps: number;
    caloriesBurned: number;
    avgPace: string;
    rpe?: number;
    routePoints?: { lat: number; lng: number; ele?: number }[];
    weatherConditions?: AtmosphericConditions;
    notes?: string;
  }) => {
    triggerCelebration('workout');

    const todayStr = new Date().toISOString().split('T')[0];
    const category: ExerciseCategory = 'Cardio';
    const computedXp = Math.round(
      session.distanceKm * 45 + session.elevationGainMeters * 0.4 + session.durationMinutes * 3
    );
    const volumeKgEquivalent = Math.round(
      session.mode === 'cycle'
        ? session.distanceKm * 32
        : session.steps * (session.mode === 'hike' ? 0.8 : session.mode === 'run' ? 0.6 : 0.4)
    );
    const setsEquivalent = Math.max(4, Math.round(session.durationMinutes / 3));

    const newLog: ActivityLog = {
      id: `act-outdoor-${Date.now()}`,
      title: session.title,
      category,
      durationMinutes: session.durationMinutes,
      caloriesBurned: session.caloriesBurned,
      stepsRecorded: session.steps,
      distanceKm: session.distanceKm,
      elevationGainMeters: session.elevationGainMeters,
      avgPace: session.avgPace,
      activityType: session.mode,
      rpe: session.rpe || (session.mode === 'hike' ? 8.5 : session.mode === 'run' ? 8.0 : session.mode === 'cycle' ? 8.2 : 6.5),
      totalVolumeKg: volumeKgEquivalent,
      totalSets: setsEquivalent,
      routePoints: session.routePoints,
      weatherConditions: session.weatherConditions,
      notes: session.notes,
      date: 'Today',
      isoDate: todayStr,
      timestamp: Date.now(),
      xpEarned: computedXp
    };

    setActivityLogs(prev => [newLog, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid, 'activities', newLog.id), newLog).catch(e => {
        console.warn('Outdoor activity sync note:', e);
      });
    }

    // Update user streak & stats
    setUser(prev => {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      let newCurrentStreak = prev.streak.current;
      let newLongestStreak = prev.streak.longest;
      const isNewDay = prev.streak.lastActiveDate !== todayStr;

      if (isNewDay) {
        if (prev.streak.lastActiveDate === yesterdayStr) {
          newCurrentStreak += 1;
        } else {
          newCurrentStreak = 1;
        }
        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }
      }

      const updated: UserProfile = {
        ...prev,
        streak: {
          ...prev.streak,
          current: newCurrentStreak,
          longest: newLongestStreak,
          lastActiveDate: todayStr,
          daysActiveTotal: isNewDay ? prev.streak.daysActiveTotal + 1 : prev.streak.daysActiveTotal
        }
      };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updated).catch(e => console.warn(e));
      }
      return updated;
    });

    addXP(computedXp, `Conquered ${session.distanceKm}km ${session.mode.toUpperCase()}`);
    showToast(
      `${session.mode.toUpperCase()} Logged: +${session.distanceKm}km, +${session.elevationGainMeters}m climb, +${computedXp} XP`
    );
  };

  const isPremium = Boolean(user.isPremium || user.membershipTier === 'PANTHER ELITE');

  const openPremiumUpgrade = (featureName?: string) => {
    setPremiumFeatureLockedNotice(featureName || null);
    setShowPremiumModal(true);
  };

  const upgradeToPremium = async (plan: 'monthly' | 'annual', paymentMethod: string) => {
    const expiresDate = new Date();
    if (plan === 'monthly') {
      expiresDate.setMonth(expiresDate.getMonth() + 1);
    } else {
      expiresDate.setFullYear(expiresDate.getFullYear() + 1);
    }

    updateUserProfile({
      isPremium: true,
      membershipTier: 'PANTHER ELITE',
      premiumTier: 'apex',
      subscriptionPlan: plan,
      paymentMethod,
      premiumExpiresAt: expiresDate.toISOString()
    });

    triggerCelebration('badge', 'APEX PANTHER UNLOCKED');
    showToast(`Welcome to Panther Apex: All 3D Maps & Deep Analytics Unlocked.`);
    setShowPremiumModal(false);
  };

  const cancelPremium = () => {
    updateUserProfile({
      isPremium: false,
      membershipTier: 'FREE PANTHER',
      premiumTier: 'free'
    });
    showToast('Subscription canceled. Active on Free tier.');
  };

  const toggleDisciplineTask = (taskId: string) => {
    setDisciplineTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newStatus = !task.completed;
          if (newStatus) {
            addXP(task.xp, `Completed: ${task.title}`);
            setUser(u => ({
              ...u,
              streak: {
                ...u.streak,
                challengesCompletedTotal: u.streak.challengesCompletedTotal + 1
              }
            }));
          }
          return { ...task, completed: newStatus };
        }
        return task;
      })
    );
  };

  const addCommunityPost = (content: string, imageUrl?: string, workoutHighlight?: string) => {
    const levelName = PANTHER_LEVELS.find(l => l.id === user.pantherLevel)?.name || 'PANTHER';
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: firebaseUser ? firebaseUser.uid : user.id,
      authorName: user.fullName,
      authorAvatar: user.avatarUrl,
      authorLevel: levelName,
      createdAt: 'Just now',
      content,
      imageUrl,
      workoutHighlight,
      reactions: { panther: 1, strong: 1, respect: 1, greenLegacy: 0, wellDone: 1 },
      userReactions: ['panther'],
      comments: []
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    addXP(50, 'Brotherhood engagement post');
    showToast('Brotherhood post shared to the pride!');

    if (firebaseUser) {
      setDoc(doc(db, 'posts', newPost.id), newPost).catch(err => {
        console.warn('Cloud post sync note (saved locally):', err);
      });
    }
  };

  const reactToPost = (postId: string, reactionType: 'panther' | 'strong' | 'respect' | 'greenLegacy' | 'wellDone') => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const hasReacted = post.userReactions.includes(reactionType);
          const updatedUserReactions = hasReacted
            ? post.userReactions.filter(r => r !== reactionType)
            : [...post.userReactions, reactionType];

          const diff = hasReacted ? -1 : 1;
          const updatedReactions = {
            ...post.reactions,
            [reactionType]: Math.max(0, post.reactions[reactionType] + diff)
          };

          if (!hasReacted) {
            addXP(15, 'Encouraged a brother');
          }

          const updated = {
            ...post,
            reactions: updatedReactions,
            userReactions: updatedUserReactions
          };

          if (firebaseUser) {
            updateDoc(doc(db, 'posts', postId), {
              reactions: updatedReactions,
              userReactions: updatedUserReactions
            }).catch(e => console.warn('React sync note:', e));
          }

          return updated;
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComments = [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              authorName: user.fullName,
              authorAvatar: user.avatarUrl,
              content: commentText.trim(),
              createdAt: 'Just now'
            }
          ];
          if (firebaseUser) {
            updateDoc(doc(db, 'posts', postId), {
              comments: newComments
            }).catch(e => console.warn('Comment sync note:', e));
          }
          return {
            ...post,
            comments: newComments
          };
        }
        return post;
      })
    );
    addXP(25, 'Brotherhood comment added');
  };

  const toggleEventRegistration = (eventId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const newStatus = !ev.isRegistered;
          const countDiff = newStatus ? 1 : -1;
          if (newStatus) {
            addXP(100, `Registered for ${ev.title}`);
            showToast(`RSVP Confirmed: ${ev.title}`);
          } else {
            showToast(`Cancelled RSVP for ${ev.title}`);
          }
          return {
            ...ev,
            isRegistered: newStatus,
            registeredCount: ev.registeredCount + countDiff
          };
        }
        return ev;
      })
    );
  };

  const plantTrees = (count: number) => {
    setUser(prev => {
      const updated = {
        ...prev,
        treesPlanted: prev.treesPlanted + count
      };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updated).catch(e => console.warn(e));
      }
      return updated;
    });
    addXP(count * 50, `Planted ${count} trees for Green Legacy`);
    confetti({ particleCount: 75, spread: 60, colors: ['#1b5336', '#26794f', '#e2b955'] });
    showToast(`+${count} trees added to your Green Legacy.`);
  };

  const logCustomActivity = (
    title: string,
    category: string,
    durationMins: number,
    calories: number,
    rpe?: number,
    totalVolumeKg?: number,
    totalSets?: number
  ) => {
    const xp = Math.round(durationMins * 5);
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultRpe = category === 'Strength' ? 8.0 : category === 'Cardio' ? 7.5 : 6.0;
    const defaultVolume = totalVolumeKg !== undefined 
      ? totalVolumeKg 
      : category === 'Strength' ? durationMins * 100 : category === 'Bodyweight' ? durationMins * 85 : durationMins * 60;
    const defaultSets = totalSets !== undefined ? totalSets : Math.max(3, Math.round(durationMins / 2.5));

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title,
      category: category as any,
      durationMinutes: durationMins,
      caloriesBurned: calories,
      rpe: rpe !== undefined ? rpe : defaultRpe,
      totalVolumeKg: defaultVolume,
      totalSets: defaultSets,
      date: 'Today',
      isoDate: todayStr,
      timestamp: Date.now(),
      xpEarned: xp
    };
    setActivityLogs(prev => [newLog, ...prev]);
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid, 'activities', newLog.id), newLog).catch(e => {
        console.warn('Activity subcollection sync note:', e);
      });
    }

    setUser(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
      
      let newCurrentStreak = prev.streak.current;
      let newLongestStreak = prev.streak.longest;
      const isNewDay = prev.streak.lastActiveDate !== todayStr;
      
      if (isNewDay) {
        if (prev.streak.lastActiveDate === yesterdayStr) {
          newCurrentStreak += 1;
        } else {
          newCurrentStreak = 1;
        }
        newLongestStreak = Math.max(newCurrentStreak, newLongestStreak);
      }

      const updated = {
        ...prev,
        hikesCompleted: category.toLowerCase().includes('hike') ? prev.hikesCompleted + 1 : prev.hikesCompleted,
        streak: {
          ...prev.streak,
          current: newCurrentStreak,
          longest: newLongestStreak,
          lastActiveDate: todayStr,
          workoutsThisMonth: prev.streak.workoutsThisMonth + 1,
          daysActiveTotal: isNewDay ? prev.streak.daysActiveTotal + 1 : prev.streak.daysActiveTotal
        }
      };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, updated).catch(e => console.warn(e));
      }
      return updated;
    });
    addXP(xp, `Logged ${title}`);
    showToast(`Activity Logged: ${title} (+${xp} XP)`);
  };

  const substituteWorkoutExercise = (workoutId: string, oldExerciseId: string, newExerciseId: string) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id === workoutId) {
          return {
            ...w,
            exercises: w.exercises.map(ex => {
              if (ex.exerciseId === oldExerciseId) {
                return { ...ex, exerciseId: newExerciseId };
              }
              return ex;
            })
          };
        }
        return w;
      })
    );
    showToast('Exercise substitution updated.');
  };

  const logWaterIntake = (amountMl: number) => {
    setUser(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentHydration = prev.hydration || { current: 0, goal: 3000, date: todayStr };
      
      const isNewDay = currentHydration.date !== todayStr;
      const baseAmount = isNewDay ? 0 : currentHydration.current;
      
      const newHydration = {
        ...currentHydration,
        current: Math.max(0, baseAmount + amountMl),
        date: todayStr
      };

      const updated = {
        ...prev,
        hydration: newHydration
      };

      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, { hydration: newHydration }).catch(e => console.warn(e));
      }

      return updated;
    });
  };

  const toggleDailyHabit = (habitId: string) => {
    setUser(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let currentHabits = prev.dailyHabits || [];
      
      // Auto-reset if it's a new day and it somehow wasn't caught
      if (prev.lastHabitResetDate !== todayStr) {
        currentHabits = currentHabits.map(h => ({ ...h, completed: false }));
      }
      
      const updatedHabits = currentHabits.map(h => 
        h.id === habitId ? { ...h, completed: !h.completed } : h
      );
      
      const updated = { 
        ...prev, 
        dailyHabits: updatedHabits,
        lastHabitResetDate: todayStr
      };
      
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, { 
          dailyHabits: updatedHabits,
          lastHabitResetDate: todayStr
        }).catch(e => console.warn(e));
      }
      
      return updated;
    });
  };

  const editDailyHabit = (habitId: string, newLabel: string) => {
    setUser(prev => {
      const updatedHabits = (prev.dailyHabits || []).map(h => 
        h.id === habitId ? { ...h, label: newLabel } : h
      );
      const updated = { ...prev, dailyHabits: updatedHabits };
      if (firebaseUser) {
        UserService.saveUserProfile(firebaseUser.uid, { dailyHabits: updatedHabits }).catch(e => console.warn(e));
      }
      return updated;
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setWorkouts(INITIAL_WORKOUTS);
    setDisciplineTasks(INITIAL_DISCIPLINE_TASKS);
    setBadges(INITIAL_BADGES);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('All data restored to default pristine state.');
  };

  const exportDataJSON = () => {
    const exportPayload = {
      user,
      workouts,
      disciplineTasks,
      badges,
      communityPosts,
      events,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `panther_ba_challenge_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Your PANTHER profile and records exported.');
  };

  // Brotherhood Circles Functions
  const createBrotherhoodCircle = (data: {
    name: string;
    tagline: string;
    description: string;
    crestIcon: 'Mountain' | 'Shield' | 'Flame' | 'Crown' | 'Swords' | 'TreePine' | 'Zap' | 'Footprints';
    themeColor: string;
    focusCategory: 'Trail & Altitude' | 'Strength & Calisthenics' | 'Dawn Discipline' | 'Hybrid Endurance' | 'General Brotherhood';
    inviteCode?: string;
  }): BrotherhoodCircle => {
    const newId = `circle-${Date.now()}`;
    const cleanCode = data.inviteCode?.trim().toUpperCase() || `${data.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'CIRC'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCircle: BrotherhoodCircle = {
      id: newId,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      crestIcon: data.crestIcon,
      themeColor: data.themeColor || '#10b981',
      isPrivate: true,
      inviteCode: cleanCode,
      founderId: user.id || 'current-user',
      founderName: user.fullName,
      createdAt: new Date().toISOString().split('T')[0],
      focusCategory: data.focusCategory,
      members: [
        {
          id: user.id || 'current-user',
          name: user.fullName,
          avatar: user.avatarUrl,
          level: `LEVEL ${user.pantherLevel} — ${currentLevelInfo?.name?.split('—')[1]?.trim() || 'PANTHER'}`,
          role: 'Founder',
          joinedAt: new Date().toISOString().split('T')[0],
          isCurrentUser: true,
          stats: {
            totalPoints: 500,
            challengesCompleted: 0,
            currentStreak: user.streak.current,
            weeklyContribution: 0
          }
        }
      ],
      challenges: [],
      activityFeed: [
        {
          id: `act-${Date.now()}`,
          circleId: newId,
          authorName: user.fullName,
          authorAvatar: user.avatarUrl,
          text: `Forged the private Brotherhood Circle "${data.name}". Stand tall, brothers!`,
          timestamp: 'Just now',
          type: 'member_joined'
        }
      ]
    };

    setBrotherhoodCircles(prev => [newCircle, ...prev]);
    setActiveCircleId(newId);
    addNotification('Brotherhood Circle Forged 🛡️', `You founded "${data.name}". Share invite code ${cleanCode} with your trusted brothers.`, 'community');
    showToast(`Circle "${data.name}" created! Invite code: ${cleanCode}`);
    return newCircle;
  };

  const joinBrotherhoodCircleByCode = (code: string): { success: boolean; message: string; circle?: BrotherhoodCircle } => {
    const formattedCode = code.trim().toUpperCase();
    const circle = brotherhoodCircles.find(c => c.inviteCode.toUpperCase() === formattedCode);
    if (!circle) {
      return { success: false, message: 'Invalid or expired invite code. Confirm the code with your circle brothers.' };
    }
    const alreadyMember = circle.members.some(m => m.isCurrentUser || m.id === (user.id || 'current-user') || m.name === user.fullName);
    if (alreadyMember) {
      setActiveCircleId(circle.id);
      return { success: false, message: `You are already a member of "${circle.name}". Opening circle...`, circle };
    }

    const currentUserId = user.id || 'current-user';
    const newMember = {
      id: currentUserId,
      name: user.fullName,
      avatar: user.avatarUrl,
      level: `LEVEL ${user.pantherLevel} — ${currentLevelInfo?.name?.split('—')[1]?.trim() || 'PANTHER'}`,
      role: 'Brother' as const,
      joinedAt: new Date().toISOString().split('T')[0],
      isCurrentUser: true,
      stats: {
        totalPoints: 250,
        challengesCompleted: 0,
        currentStreak: user.streak.current,
        weeklyContribution: 0
      }
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      circleId: circle.id,
      authorName: user.fullName,
      authorAvatar: user.avatarUrl,
      text: `${user.fullName} unlocked the circle via invite code and stood in the brotherhood rank!`,
      timestamp: 'Just now',
      type: 'member_joined' as const
    };

    const updatedChallenges = circle.challenges.map(ch => {
      const hasParticipant = ch.participants.some(p => p.memberId === newMember.id);
      if (hasParticipant) return ch;
      return {
        ...ch,
        participants: [
          ...ch.participants,
          {
            memberId: newMember.id,
            memberName: newMember.name,
            avatar: newMember.avatar,
            currentValue: 0,
            completed: false,
            lastLogDate: 'Joined'
          }
        ]
      };
    });

    const updatedCircle: BrotherhoodCircle = {
      ...circle,
      members: [...circle.members, newMember],
      challenges: updatedChallenges,
      activityFeed: [newActivity, ...circle.activityFeed]
    };

    setBrotherhoodCircles(prev => prev.map(c => c.id === circle.id ? updatedCircle : c));
    setActiveCircleId(circle.id);
    addNotification('Brotherhood Circle Joined 👊', `Welcome to "${circle.name}". Stand tall with your circle brothers!`, 'community');
    showToast(`Joined "${circle.name}"!`);
    return { success: true, message: `Successfully joined "${circle.name}"!`, circle: updatedCircle };
  };

  const leaveBrotherhoodCircle = (circleId: string) => {
    setBrotherhoodCircles(prev => prev.map(c => {
      if (c.id !== circleId) return c;
      return {
        ...c,
        members: c.members.filter(m => !m.isCurrentUser && m.id !== (user.id || 'current-user'))
      };
    }));
    if (activeCircleId === circleId) {
      setActiveCircleId(null);
    }
    showToast('Left Brotherhood Circle.');
  };

  const createCircleChallenge = (
    circleId: string,
    challengeData: {
      title: string;
      description: string;
      category: 'Strength' | 'Endurance' | 'Trail & Elevation' | 'Daily Discipline' | 'Metabolic Burn';
      metric: 'reps' | 'distance' | 'workouts' | 'elevation' | 'calories' | 'streak';
      metricUnit: string;
      targetValue: number;
      endDate: string;
      xpReward: number;
      badgeRewardName?: string;
    }
  ) => {
    const newChallengeId = `ch-${Date.now()}`;
    setBrotherhoodCircles(prev => prev.map(c => {
      if (c.id !== circleId) return c;
      const participants = c.members.map(m => ({
        memberId: m.id,
        memberName: m.name,
        avatar: m.avatar,
        currentValue: 0,
        completed: false,
        lastLogDate: 'Just started'
      }));

      const newChallenge = {
        id: newChallengeId,
        circleId,
        title: challengeData.title,
        description: challengeData.description,
        category: challengeData.category,
        metric: challengeData.metric,
        metricUnit: challengeData.metricUnit,
        targetValue: challengeData.targetValue,
        startDate: new Date().toISOString().split('T')[0],
        endDate: challengeData.endDate,
        status: 'active' as const,
        xpReward: challengeData.xpReward || 500,
        badgeRewardName: challengeData.badgeRewardName || `${challengeData.title} Finisher`,
        createdBy: {
          id: user.id || 'current-user',
          name: user.fullName
        },
        participants
      };

      const activity = {
        id: `act-${Date.now()}`,
        circleId,
        authorName: user.fullName,
        authorAvatar: user.avatarUrl,
        text: `Forged new fitness challenge: "${challengeData.title}" (${challengeData.targetValue} ${challengeData.metricUnit}). Let's get to work!`,
        timestamp: 'Just now',
        type: 'challenge_created' as const
      };

      return {
        ...c,
        challenges: [newChallenge, ...c.challenges],
        activityFeed: [activity, ...c.activityFeed]
      };
    }));

    addNotification('New Circle Challenge Forged ⚔️', `Challenge "${challengeData.title}" is live for all circle members!`, 'challenge');
    showToast(`Challenge "${challengeData.title}" forged!`);
  };

  const logCircleChallengeProgress = (
    circleId: string,
    challengeId: string,
    addedValue: number,
    note?: string
  ) => {
    let completedNow = false;
    let challengeTitle = '';
    let xpGain = 0;

    setBrotherhoodCircles(prev => prev.map(c => {
      if (c.id !== circleId) return c;
      const targetChallenge = c.challenges.find(ch => ch.id === challengeId);
      if (!targetChallenge) return c;

      challengeTitle = targetChallenge.title;
      xpGain = targetChallenge.xpReward;

      const currentUserId = user.id || 'current-user';

      const updatedChallenges = c.challenges.map(ch => {
        if (ch.id !== challengeId) return ch;
        let userParticipant = ch.participants.find(p => p.memberId === currentUserId || p.memberName.includes('You'));

        if (!userParticipant) {
          userParticipant = {
            memberId: currentUserId,
            memberName: 'You (Athlete)',
            avatar: user.avatarUrl,
            currentValue: 0,
            completed: false,
            lastLogDate: 'Today'
          };
          ch.participants.push(userParticipant);
        }

        const nextVal = Math.round(((userParticipant?.currentValue || 0) + addedValue) * 10) / 10;
        const isNowComplete = nextVal >= ch.targetValue && !userParticipant?.completed;
        if (isNowComplete) {
          completedNow = true;
        }

        const updatedParticipants = ch.participants.map(p => {
          if (p.memberId === userParticipant!.memberId) {
            return {
              ...p,
              currentValue: nextVal,
              completed: nextVal >= ch.targetValue,
              lastLogDate: 'Today'
            };
          }
          return p;
        });

        return {
          ...ch,
          participants: updatedParticipants
        };
      });

      const updatedMembers = c.members.map(m => {
        if (m.isCurrentUser || m.id === currentUserId) {
          return {
            ...m,
            stats: {
              ...m.stats,
              totalPoints: m.stats.totalPoints + (completedNow ? xpGain + 100 : Math.round(addedValue * 10)),
              challengesCompleted: m.stats.challengesCompleted + (completedNow ? 1 : 0),
              weeklyContribution: Math.round((m.stats.weeklyContribution + addedValue) * 10) / 10
            }
          };
        }
        return m;
      });

      const activity: CircleActivityItem = {
        id: `act-${Date.now()}`,
        circleId,
        authorName: user.fullName,
        authorAvatar: user.avatarUrl,
        text: completedNow
          ? `🏆 CONQUERED THE CHALLENGE "${challengeTitle}"! Target of ${targetChallenge.targetValue} ${targetChallenge.metricUnit} crushed!`
          : `Logged +${addedValue} ${targetChallenge.metricUnit} on "${challengeTitle}". Total logged: ${targetChallenge.participants.find(p => p.memberId === currentUserId || p.memberName.includes('You'))?.currentValue || addedValue} / ${targetChallenge.targetValue} ${targetChallenge.metricUnit}.${note ? ` Note: "${note}"` : ''}`,
        timestamp: 'Just now',
        type: completedNow ? 'challenge_completed' : 'progress_logged'
      };

      return {
        ...c,
        members: updatedMembers,
        challenges: updatedChallenges,
        activityFeed: [activity, ...c.activityFeed]
      };
    }));

    if (completedNow) {
      addXP(xpGain, `Conquered Circle Challenge: ${challengeTitle}`);
      triggerCelebration('badge', challengeTitle);
      addNotification('Challenge Conquered! 🏆', `You completed "${challengeTitle}" and earned +${xpGain} XP for the brotherhood!`, 'challenge');
      showToast(`Challenge Conquered! +${xpGain} XP awarded!`);
    } else {
      showToast(`Logged +${addedValue} to challenge!`);
    }
  };

  const sendCircleCheerOrMessage = (circleId: string, messageText: string, type: 'cheer' | 'chat' = 'chat') => {
    if (!messageText.trim()) return;
    const newActivity: CircleActivityItem = {
      id: `act-${Date.now()}`,
      circleId,
      authorName: user.fullName,
      authorAvatar: user.avatarUrl,
      text: messageText.trim(),
      timestamp: 'Just now',
      type: type === 'cheer' ? 'cheer' : 'chat'
    };

    setBrotherhoodCircles(prev => prev.map(c => {
      if (c.id !== circleId) return c;
      return {
        ...c,
        activityFeed: [newActivity, ...c.activityFeed]
      };
    }));

    showToast(type === 'cheer' ? 'Fist bump sent to circle brothers! 👊' : 'Message posted to circle feed.');
  };

  // Coach/Admin Functions
  const addWorkoutAdmin = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
    showToast(`New workout created: ${workout.title}`);
  };

  const deleteWorkoutAdmin = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    showToast('Workout removed from library.');
  };

  const addEventAdmin = (event: BAEvent) => {
    setEvents(prev => [event, ...prev]);
    showToast(`New BA Event published: ${event.title}`);
  };

  const awardBadgeAdmin = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlockedAt: new Date().toISOString().split('T')[0], progress: b.maxProgress } : b))
    );
    showToast('Badge awarded to Panther profile.');
  };

  const broadcastAnnouncementAdmin = (title: string, message: string) => {
    const notif: AppNotification = {
      id: `notif-admin-${Date.now()}`,
      title: `Coach Announcement: ${title}`,
      message,
      timestamp: 'Just now',
      type: 'event',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
    showToast('Announcement broadcasted to all active Panthers.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        workouts,
        exercises,
        disciplineTasks,
        badges,
        communityPosts,
        events,
        trainingPlans,
        wellnessResources,
        environmentalChallenges,
        notifications,
        unreadNotificationCount,
        addNotification,
        activeTab,
        setActiveTab,
        workoutPlayerWorkout,
        setWorkoutPlayerWorkout,
        showOnboarding,
        setShowOnboarding,
        showLogActivity,
        setShowLogActivity,
        showAdminModal,
        setShowAdminModal,
        showWeeklySummaryModal,
        showBuildWorkoutModal,
        setShowBuildWorkoutModal,
        setShowWeeklySummaryModal,
        showWellnessModal,
        setShowWellnessModal,
        showGreenLegacyModal,
        setShowGreenLegacyModal,
        showLeaderboardModal,
        setShowLeaderboardModal,
        showNotificationsModal,
        setShowNotificationsModal,
        showTrainingPlansModal,
        setShowTrainingPlansModal,
        showOutdoorTracker,
        setShowOutdoorTracker,
        outdoorTrackerInitialMode,
        setOutdoorTrackerInitialMode,
        isPremium,
        showPremiumModal,
        setShowPremiumModal,
        showDeepAnalysisModal,
        setShowDeepAnalysisModal,
        premiumFeatureLockedNotice,
        openPremiumUpgrade,
        upgradeToPremium,
        cancelPremium,
        selectedWorkoutForAnalysis,
        setSelectedWorkoutForAnalysis,
        showFormAnalysisModal,
        setShowFormAnalysisModal,
        formAnalysisTargetExercise,
        setFormAnalysisTargetExercise,
        openFormAnalysis,
        savedFormAnalyses,
        saveFormAnalysis,
        brotherhoodCircles,
        activeCircleId,
        setActiveCircleId,
        createBrotherhoodCircle,
        joinBrotherhoodCircleByCode,
        leaveBrotherhoodCircle,
        createCircleChallenge,
        logCircleChallengeProgress,
        sendCircleCheerOrMessage,
        setShowOnboardingModal: setShowOnboarding,
        firebaseUser,
        isAuthReady,
        isSyncing,
        loginWithGoogle,
        logout,
        activityLogs,
        updateUserProfile,
        completeWorkout,
        logOutdoorSession,
        toggleDisciplineTask,
        addCommunityPost,
        reactToPost,
        addCommentToPost,
        toggleEventRegistration,
        plantTrees,
        addXP,
        logCustomActivity,
        substituteWorkoutExercise,
        toggleDailyHabit,
        editDailyHabit,
        logWaterIntake,
        markNotificationsAsRead,
        resetAllData,
        exportDataJSON,
        triggerCelebration,
        currentLevelInfo,
        nextLevelInfo,
        xpProgressPercent,
        toastMessage,
        showToast,
        addWorkoutAdmin,
        deleteWorkoutAdmin,
        addEventAdmin,
        awardBadgeAdmin,
        broadcastAnnouncementAdmin
      }}
    >
      {children}
      <CelebrationOverlay
        isVisible={celebration.isVisible}
        type={celebration.type}
        payload={celebration.payload}
        onComplete={() => setCelebration(prev => ({ ...prev, isVisible: false }))}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
