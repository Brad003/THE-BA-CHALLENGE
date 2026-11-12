import {
  Exercise,
  Workout,
  PantherLevel,
  Badge,
  DailyDisciplineTask,
  CommunityPost,
  BAEvent,
  TrainingPlan,
  WellnessResource,
  EnvironmentalChallenge,
  UserProfile,
  AppNotification,
  ActivityLog
} from '../types';

export const PANTHER_LEVELS: PantherLevel[] = [
  { id: 1, name: 'LEVEL 1 — CUB', minXp: 0, maxXp: 500, tagline: 'Entering the trail. Awakening discipline.', badgeIcon: 'claw' },
  { id: 2, name: 'LEVEL 2 — TRACKER', minXp: 501, maxXp: 1200, tagline: 'Reading the ground. Building silent consistency.', badgeIcon: 'compass' },
  { id: 3, name: 'LEVEL 3 — HUNTER', minXp: 1201, maxXp: 2500, tagline: 'Sharpening strength and physical endurance.', badgeIcon: 'zap' },
  { id: 4, name: 'LEVEL 4 — PANTHER', minXp: 2501, maxXp: 4500, tagline: 'Total embodiment of strength, courage & grace.', badgeIcon: 'panther' },
  { id: 5, name: 'LEVEL 5 — ALPHA', minXp: 4501, maxXp: 7500, tagline: 'Protecting brothers. Leading the charge on the trails.', badgeIcon: 'crown' },
  { id: 6, name: 'LEVEL 6 — PRIDE LEADER', minXp: 7501, maxXp: 12000, tagline: 'Anchor of the brotherhood. Wisdom in action.', badgeIcon: 'shield' },
  { id: 7, name: 'LEVEL 7 — LEGACY PANTHER', minXp: 12001, maxXp: 99999, tagline: 'Leaving an indelible mark on men and the earth.', badgeIcon: 'tree' },
];

export const INITIAL_EXERCISES: Exercise[] = [
  // Bodyweight & Push
  {
    id: 'ex-pushups',
    name: 'Panther Ground Push-Ups',
    category: 'Bodyweight',
    subcategory: 'Push',
    description: 'Strict, chest-to-deck push-ups with locked core and controlled eccentric lowering.',
    targetMuscles: ['Chest', 'Triceps', 'Anterior Deltoids', 'Core'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 4,
    defaultReps: '15-20 reps',
    defaultRestSec: 45,
    cueTips: [
      'Grip the floor with active fingers.',
      'Elbows tucked at 45 degrees, not flared out.',
      'Exhale forcefully as you press the ground away.'
    ],
    substitutes: ['ex-incline-pushups', 'ex-diamond-pushups', 'ex-db-bench']
  },
  {
    id: 'ex-diamond-pushups',
    name: 'Diamond Tricep Push-Ups',
    category: 'Bodyweight',
    subcategory: 'Push',
    description: 'Hands formed in a diamond underneath the sternum for intense triceps and inner pec recruitment.',
    targetMuscles: ['Triceps', 'Chest', 'Core'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 3,
    defaultReps: '12 reps',
    defaultRestSec: 45,
    cueTips: ['Keep hips level', 'Lower slowly until chest brushes hands'],
    substitutes: ['ex-pushups', 'ex-dips']
  },
  {
    id: 'ex-incline-pushups',
    name: 'Elevated Incline Push-Ups',
    category: 'Bodyweight',
    subcategory: 'Push',
    description: 'Hands elevated on a bench or tree trunk to reduce load, ideal for recovery or beginners.',
    targetMuscles: ['Lower Chest', 'Triceps', 'Shoulders'],
    equipmentNeeded: 'Bench or Log',
    defaultSets: 3,
    defaultReps: '15 reps',
    defaultRestSec: 45,
    cueTips: ['Maintain rigid plank line from head to heels'],
    substitutes: ['ex-pushups']
  },

  // Lower & Legs
  {
    id: 'ex-squats',
    name: 'Deep Bodyweight Squats',
    category: 'Bodyweight',
    subcategory: 'Legs',
    description: 'Full range of motion squats breaking parallel with active hip hinge and upright chest.',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 4,
    defaultReps: '20 reps',
    defaultRestSec: 60,
    cueTips: [
      'Screw feet into the earth.',
      'Knees track over second and third toes.',
      'Keep chest elevated and eyes on the horizon.'
    ],
    substitutes: ['ex-lunges', 'ex-jump-squats', 'ex-goblet-squat']
  },
  {
    id: 'ex-lunges',
    name: 'Walking Trail Lunges',
    category: 'Bodyweight',
    subcategory: 'Legs',
    description: 'Unilateral leg strength builder mimicking steep outdoor trail ascents.',
    targetMuscles: ['Glutes', 'Quads', 'Hamstrings', 'Balance'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 3,
    defaultReps: '12 each leg',
    defaultRestSec: 60,
    cueTips: ['90-degree bend at front and back knees', 'Drive through the front heel'],
    substitutes: ['ex-squats', 'ex-step-ups']
  },
  {
    id: 'ex-glute-bridges',
    name: 'Single-Leg Glute Bridges',
    category: 'Bodyweight',
    subcategory: 'Lower body',
    description: 'Posterior chain activator to protect lower back and power hill climbing strides.',
    targetMuscles: ['Glutes', 'Hamstrings', 'Spinal Erectors'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 3,
    defaultReps: '15 reps',
    defaultRestSec: 45,
    cueTips: ['Pause and squeeze glute at the peak for 2 seconds', 'Do not hyperextend lower back'],
    substitutes: ['ex-squats']
  },
  {
    id: 'ex-calf-raises',
    name: 'Ledge Calf Drives',
    category: 'Bodyweight',
    subcategory: 'Legs',
    description: 'Slow eccentric lowering and explosive elevation for durable ankles and trail stamina.',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles tendon'],
    equipmentNeeded: 'Stair or Rock ledge',
    defaultSets: 4,
    defaultReps: '25 reps',
    defaultRestSec: 30,
    cueTips: ['Full stretch at the bottom, 1-second pause at the crest'],
    substitutes: ['ex-jump-rope']
  },

  // Core & Endurance
  {
    id: 'ex-planks',
    name: 'Panther Shield Plank',
    category: 'Bodyweight',
    subcategory: 'Core',
    description: 'Forearm isometric hold with active abdominal vacuum and locked glutes.',
    targetMuscles: ['Transverse Abdominis', 'Obliques', 'Serratus', 'Glutes'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 3,
    defaultReps: '60 seconds',
    defaultRestSec: 45,
    cueTips: ['Pull elbows toward toes isometrically', 'Breathe through the nose into the belly'],
    substitutes: ['ex-mountain-climbers', 'ex-hollow-hold']
  },
  {
    id: 'ex-mountain-climbers',
    name: 'Trail Mountain Climbers',
    category: 'Bodyweight',
    subcategory: 'Core',
    description: 'Dynamic alternating knee drives from a push-up position building core stamina and cardio pace.',
    targetMuscles: ['Core', 'Hip Flexors', 'Shoulders', 'Cardio'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 4,
    defaultReps: '40 seconds',
    defaultRestSec: 45,
    cueTips: ['Keep hips low and stable', 'Drive knees directly toward chest'],
    substitutes: ['ex-burpees', 'ex-planks']
  },
  {
    id: 'ex-burpees',
    name: 'BA Combat Burpees',
    category: 'Bodyweight',
    subcategory: 'Full body',
    description: 'Chest-to-floor drop, quick snap to feet, and vertical jump with clap overhead.',
    targetMuscles: ['Full Body', 'Cardio', 'Lungs'],
    equipmentNeeded: 'None (Bodyweight)',
    defaultSets: 4,
    defaultReps: '15 reps',
    defaultRestSec: 60,
    cueTips: ['Pace your breathing', 'Land soft on the balls of your feet'],
    substitutes: ['ex-mountain-climbers', 'ex-jump-squats']
  },

  // Strength with Equipment / Gym
  {
    id: 'ex-pullups',
    name: 'Overhand Panther Pull-Ups',
    category: 'Strength',
    subcategory: 'Pull',
    description: 'Wide grip vertical pull from dead-hang to chin cleanly clearing the bar.',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps', 'Forearms'],
    equipmentNeeded: 'Pull-up Bar or Branch',
    defaultSets: 4,
    defaultReps: '8-10 reps',
    defaultRestSec: 90,
    cueTips: ['Engage lats before bending elbows', 'No swinging or kipping'],
    substitutes: ['ex-inverted-rows', 'ex-db-rows']
  },
  {
    id: 'ex-db-deadlift',
    name: 'Dumbbell Romanian Deadlift',
    category: 'Strength',
    subcategory: 'Lower body',
    description: 'Controlled hip hinge focusing on hamstring stretch and glute lock-out.',
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Grip'],
    equipmentNeeded: 'Dumbbells or Kettlebell',
    defaultSets: 4,
    defaultReps: '10-12 reps',
    defaultRestSec: 75,
    cueTips: ['Send hips back toward wall', 'Keep weights tight along shins'],
    substitutes: ['ex-glute-bridges']
  },
  {
    id: 'ex-db-overhead-press',
    name: 'Standing Overhead Military Press',
    category: 'Strength',
    subcategory: 'Upper body',
    description: 'Standing shoulder press emphasizing core brace and vertical lockout.',
    targetMuscles: ['Deltoids', 'Triceps', 'Upper Traps', 'Core'],
    equipmentNeeded: 'Dumbbells or Barbell',
    defaultSets: 4,
    defaultReps: '10 reps',
    defaultRestSec: 60,
    cueTips: ['Brace abs and glutes as if taking a punch', 'Lock arms fully overhead'],
    substitutes: ['ex-pushups', 'ex-pike-pushups']
  },

  // Mobility & Stretching
  {
    id: 'ex-morning-mobility',
    name: 'Panther Spine & Cat-Cow Wave',
    category: 'Mobility',
    subcategory: 'Morning mobility',
    description: 'Segmental spinal articulation combined with thoracic thread-the-needle rotations.',
    targetMuscles: ['Thoracic Spine', 'Lumbar Spine', 'Neck'],
    equipmentNeeded: 'None',
    defaultSets: 3,
    defaultReps: '10 flow cycles',
    defaultRestSec: 30,
    cueTips: ['Coordinate inhale with extension, exhale with flexion', 'Feel each vertebra move'],
    substitutes: ['ex-hip-openers']
  },
  {
    id: 'ex-hip-openers',
    name: 'Deep 90/90 Hip Flow',
    category: 'Mobility',
    subcategory: 'Hip mobility',
    description: 'Seated internal and external rotational transitions to unlock hips for trail rucking.',
    targetMuscles: ['Hip Rotators', 'Piriformis', 'IT Band'],
    equipmentNeeded: 'None',
    defaultSets: 3,
    defaultReps: '8 switches per side',
    defaultRestSec: 30,
    cueTips: ['Keep torso tall', 'Avoid rounding lower back during lean'],
    substitutes: ['ex-morning-mobility']
  },

  // Cardio / Outdoor
  {
    id: 'ex-trail-run',
    name: 'Rift Valley Hill Sprints & Ruck',
    category: 'Cardio',
    subcategory: 'Hiking',
    description: 'Incline trail pace interval or weighted pack hike building rugged leg resilience.',
    targetMuscles: ['Quads', 'Calves', 'Cardiovascular System', 'Mental Grit'],
    equipmentNeeded: 'Trail shoes / Backpack (optional)',
    defaultSets: 5,
    defaultReps: '90s hill charge / 90s walk',
    defaultRestSec: 90,
    cueTips: ['Shorten stride on incline', 'Drive arms forward with purpose'],
    substitutes: ['ex-burpees', 'ex-squats']
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-daily-panther',
    title: "Today's Signature: The Panther Foundation",
    category: 'Bodyweight',
    subcategory: 'Full body',
    difficulty: 'Intermediate',
    durationMinutes: 32,
    estimatedCalories: 340,
    xpReward: 250,
    description: 'Our core daily discipline session. Build functional armor using only your bodyweight, the floor, and unbreakable grit.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    equipmentRequired: 'No Equipment (Bodyweight Only)',
    exercises: [
      { exerciseId: 'ex-morning-mobility', sets: 2, reps: '8 cycles', restSec: 30 },
      { exerciseId: 'ex-pushups', sets: 4, reps: '15-20 reps', restSec: 45 },
      { exerciseId: 'ex-squats', sets: 4, reps: '20 reps', restSec: 45 },
      { exerciseId: 'ex-planks', sets: 3, reps: '60 seconds', restSec: 45 },
      { exerciseId: 'ex-lunges', sets: 3, reps: '12 each leg', restSec: 60 },
      { exerciseId: 'ex-burpees', sets: 3, reps: '12 reps', restSec: 60 }
    ]
  },
  {
    id: 'w-alpha-strength',
    title: 'Alpha Iron: Upper Body Armor',
    category: 'Strength',
    subcategory: 'Push',
    difficulty: 'Advanced',
    durationMinutes: 45,
    estimatedCalories: 420,
    xpReward: 300,
    description: 'Heavy compound push-and-shoulder development designed for functional power, posture, and chest armor.',
    equipmentRequired: 'Dumbbells / Barbell or Heavy Resistance',
    exercises: [
      { exerciseId: 'ex-pushups', sets: 3, reps: '20 reps', restSec: 45 },
      { exerciseId: 'ex-db-overhead-press', sets: 4, reps: '10-12 reps', restSec: 60 },
      { exerciseId: 'ex-diamond-pushups', sets: 3, reps: '12 reps', restSec: 45 },
      { exerciseId: 'ex-planks', sets: 3, reps: '60 seconds', restSec: 45 }
    ]
  },
  {
    id: 'w-trail-warrior-cardio',
    title: 'Trail Warrior: Mountain Conditioning',
    category: 'Cardio',
    subcategory: 'Hiking',
    difficulty: 'Intermediate',
    durationMinutes: 38,
    estimatedCalories: 460,
    xpReward: 280,
    description: 'Designed for the man preparing for the Ngong Hills and Mount Kenya BA expeditions. High cardiovascular stamina and leg endurance.',
    equipmentRequired: 'Trail / Open Space',
    exercises: [
      { exerciseId: 'ex-trail-run', sets: 4, reps: '2 mins tempo', restSec: 60 },
      { exerciseId: 'ex-squats', sets: 3, reps: '25 reps', restSec: 45 },
      { exerciseId: 'ex-mountain-climbers', sets: 4, reps: '45 seconds', restSec: 45 },
      { exerciseId: 'ex-calf-raises', sets: 4, reps: '25 reps', restSec: 30 }
    ]
  },
  {
    id: 'w-morning-mobility',
    title: 'Dawn Panther: Mobility & Spine Reset',
    category: 'Mobility',
    subcategory: 'Morning mobility',
    difficulty: 'Beginner',
    durationMinutes: 18,
    estimatedCalories: 110,
    xpReward: 160,
    description: 'Uncage tight hips, relieve stiff lower back from sitting or driving, and align your breath with the rising sun.',
    equipmentRequired: 'Mat or Floor',
    exercises: [
      { exerciseId: 'ex-morning-mobility', sets: 3, reps: '10 cycles', restSec: 20 },
      { exerciseId: 'ex-hip-openers', sets: 3, reps: '8 each side', restSec: 30 },
      { exerciseId: 'ex-glute-bridges', sets: 3, reps: '15 reps', restSec: 30 }
    ]
  },
  {
    id: 'w-zero-equipment',
    title: 'Zero Equipment: The Bushveld Burn',
    category: 'Bodyweight',
    subcategory: 'Full body',
    difficulty: 'Beginner',
    durationMinutes: 25,
    estimatedCalories: 260,
    xpReward: 200,
    description: 'No gym? No weights? No excuses. High-output calisthenics circuit you can perform in a hotel room or on your porch.',
    equipmentRequired: 'Zero Equipment Needed',
    exercises: [
      { exerciseId: 'ex-pushups', sets: 3, reps: '15 reps', restSec: 45 },
      { exerciseId: 'ex-squats', sets: 3, reps: '20 reps', restSec: 45 },
      { exerciseId: 'ex-lunges', sets: 3, reps: '10 each leg', restSec: 45 },
      { exerciseId: 'ex-planks', sets: 3, reps: '45 seconds', restSec: 45 }
    ]
  }
];

export const INITIAL_DISCIPLINE_TASKS: DailyDisciplineTask[] = [
  { id: 'd-pushups', title: '30 Strict Push-Ups', category: 'Physical', target: '30 reps', xp: 40, completed: false, iconName: 'Dumbbell' },
  { id: 'd-squats', title: '50 Deep Air Squats', category: 'Physical', target: '50 reps', xp: 40, completed: false, iconName: 'Flame' },
  { id: 'd-walk', title: '20-Minute Outdoor Walk', category: 'Nature', target: '20 mins', xp: 50, completed: false, iconName: 'Footprints' },
  { id: 'd-meditation', title: '10-Minute Breath & Stillness', category: 'Mind', target: '10 mins', xp: 50, completed: false, iconName: 'Brain' },
  { id: 'd-water', title: 'Drink 3 Litres of Water', category: 'Habit', target: '3.0 L', xp: 30, completed: true, iconName: 'Droplet' },
  { id: 'd-reading', title: 'Read for 15 Minutes', category: 'Mind', target: '15 mins', xp: 40, completed: false, iconName: 'BookOpen' },
  { id: 'd-no-alcohol', title: 'Zero Alcohol Today', category: 'Discipline', target: '24 hrs', xp: 50, completed: true, iconName: 'ShieldCheck' },
  { id: 'd-early-rise', title: 'Wake-Up Challenge (Before 6:00 AM)', category: 'Discipline', target: '5:30 AM', xp: 40, completed: true, iconName: 'Sun' },
  { id: 'd-encourage', title: 'Encourage Another Panther Brother', category: 'Brotherhood', target: '1 Brother', xp: 50, completed: false, iconName: 'HeartHandshake' }
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b-7day', title: '7-DAY DISCIPLINE', description: 'Maintained an unbroken 7-day streak of daily discipline.', icon: 'shield', category: 'Consistency', progress: 7, maxProgress: 7, unlockedAt: '2026-09-07' },
  { id: 'b-30day', title: '30-DAY PANTHER', description: '30 consecutive days of physical and mental training.', icon: 'panther', category: 'Consistency', progress: 14, maxProgress: 30 },
  { id: 'b-early', title: 'EARLY RISER', description: 'Conquered the dawn trail 15 times before 6:00 AM.', icon: 'sun', category: 'Discipline', progress: 11, maxProgress: 15 },
  { id: 'b-trail', title: 'TRAIL WARRIOR', description: 'Hiked over 50 kilometers in the rugged wilderness.', icon: 'mountain', category: 'Trail', progress: 38, maxProgress: 50 },
  { id: 'b-consistency', title: 'CONSISTENCY KING', description: 'Completed 60 total workouts without quitting.', icon: 'crown', category: 'Consistency', progress: 42, maxProgress: 60 },
  { id: 'b-brotherhood', title: 'BROTHERHOOD BUILDER', description: 'Gave 50 respect cheers and comments to elevate other men.', icon: 'users', category: 'Brotherhood', progress: 29, maxProgress: 50 },
  { id: 'b-green', title: 'GREEN LEGACY', description: 'Planted 25+ indigenous trees with THE BA CHALLENGE.', icon: 'tree', category: 'Green Legacy', progress: 28, maxProgress: 25, unlockedAt: '2026-08-22' },
  { id: 'b-mental', title: 'MENTAL STRENGTH', description: 'Logged 20 reflection journals and breathwork resets.', icon: 'brain', category: 'Mental', progress: 16, maxProgress: 20 },
  { id: 'b-100', title: '100 WORKOUTS', description: 'That is not motivation. That is character.', icon: 'zap', category: 'Consistency', progress: 42, maxProgress: 100 }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'coach-kwame',
    authorName: 'Coach Kwame Osei',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    authorLevel: 'LEVEL 6 — PRIDE LEADER',
    createdAt: '2 hours ago',
    content: 'Brothers, yesterday 42 Panthers braved the steep ridges of the Ngong Hills at 5:30 AM in the rain. Not a single man complained. When one brother cramped at kilometer 8, three men held his pack and paced him to the crest. This is THE BA CHALLENGE. We do not leave any man behind.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    workoutHighlight: 'Ngong Hills 14km Ridge Ruck completed',
    reactions: { panther: 42, strong: 38, respect: 56, greenLegacy: 18, wellDone: 35 },
    userReactions: ['respect', 'strong'],
    comments: [
      { id: 'c-1', authorName: 'Tendai Mutasa', authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', content: 'Honor to walk beside you, Coach. My quads are sore today but my spirit is high.', createdAt: '1 hour ago' },
      { id: 'c-2', authorName: 'David Kimani', authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', content: 'No man left behind! See everyone at the tree planting this Saturday.', createdAt: '35 mins ago' }
    ]
  },
  {
    id: 'post-2',
    authorId: 'bro-marcus',
    authorName: 'Marcus Adebayo',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    authorLevel: 'LEVEL 4 — PANTHER',
    createdAt: '4 hours ago',
    content: 'Hit Day 14 of zero alcohol and completed the 50-squat daily discipline before sunrise. Six months ago I could barely look in the mirror after late nights. The discipline of the pride has given me my self-respect back.',
    reactions: { panther: 28, strong: 31, respect: 44, greenLegacy: 5, wellDone: 39 },
    userReactions: ['respect'],
    comments: [
      { id: 'c-3', authorName: 'Samuel Okon', authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop', content: 'Silent consistency, brother Marcus. The trail gets clearer every sunrise.', createdAt: '2 hours ago' }
    ]
  },
  {
    id: 'post-3',
    authorId: 'bro-jabari',
    authorName: 'Jabari Mensah',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    authorLevel: 'LEVEL 3 — HUNTER',
    createdAt: 'Yesterday',
    content: 'Planted 10 seedlings at Karura with my son this morning. Teaching the next generation what Green Legacy means. Build the man, leave a forest.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    workoutHighlight: 'Green Legacy: 10 Indigenous Cedar & Acacia Planted',
    reactions: { panther: 35, strong: 19, respect: 52, greenLegacy: 64, wellDone: 40 },
    userReactions: ['greenLegacy', 'respect'],
    comments: [
      { id: 'c-4', authorName: 'Kwame Osei', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', content: 'Fatherhood and conservation in action. A true Panther legacy.', createdAt: 'Yesterday' }
    ]
  }
];

export const INITIAL_EVENTS: BAEvent[] = [
  {
    id: 'event-ngong',
    title: 'Ngong Hills 7-Peaks Sunrise Brotherhood Ruck',
    type: 'Hike',
    date: 'Saturday, Sep 19, 2026',
    time: '05:30 AM - 11:30 AM EAT',
    location: 'Ngong Hills Forest Reserve, Kajiado / Nairobi',
    coordinates: '-1.4089, 36.6543',
    description: 'Traverse all seven peaks together. A test of endurance, mental fortitude, and true brotherhood pacing. Pack 10kg minimum ruck, 3L water, and trail snacks.',
    capacity: 60,
    registeredCount: 47,
    isRegistered: true,
    leadCoach: 'Coach Kwame Osei',
    xpReward: 350,
    gearRequired: ['Trail boots', '10kg Rucksack or Pack', 'Hydration bladder', 'Windbreaker', 'Whistle']
  },
  {
    id: 'event-karura-green',
    title: 'Panthers For The Planet: 1,000 Tree Planting & Trail 10K',
    type: 'Tree Planting',
    date: 'Saturday, Sep 26, 2026',
    time: '07:00 AM - 12:30 PM EAT',
    location: 'Karura Forest Gate C, Nairobi',
    description: 'Direct contribution to the BA Challenge Green Legacy. We plant 1,000 indigenous trees followed by a 10km brotherhood forest run and hydration circle.',
    capacity: 100,
    registeredCount: 82,
    isRegistered: false,
    leadCoach: 'Jabari Mensah & BA Forest Guild',
    xpReward: 400,
    gearRequired: ['Outdoor work gloves', 'Running shoes', 'Hat', 'Reusable bottle'],
    environmentalPillar: true
  },
  {
    id: 'event-firepit-wellness',
    title: 'The Firepit Circle: Men’s Wellness & Mental Grounding',
    type: 'Social',
    date: 'Friday, Oct 2, 2026',
    time: '06:30 PM - 09:30 PM EAT',
    location: 'Tigoni Tea Highlands Outpost',
    description: 'No masks, no pretenses. “Strong men speak.” An open evening around the cedar fire discussing purpose, emotional resilience, fatherhood, and navigating life pressure.',
    capacity: 35,
    registeredCount: 29,
    isRegistered: false,
    leadCoach: 'Dr. Joseph Mwangi & Coach Kwame',
    xpReward: 300,
    gearRequired: ['Warm fleece jacket', 'Open mind', 'Notebook/Journal']
  },
  {
    id: 'event-mt-kenya-bootcamp',
    title: 'Mount Kenya High-Altitude Wilderness Bootcamp',
    type: 'Bootcamp',
    date: 'Oct 16 - Oct 18, 2026',
    time: '3-Day Expedition',
    location: 'Naro Moru Trailhead, Mount Kenya National Park',
    description: 'Our annual pinnacle challenge. 3 days of high-altitude bodyweight conditioning, navigation, cold-river plunge, and wilderness resilience.',
    capacity: 25,
    registeredCount: 23,
    isRegistered: false,
    leadCoach: 'Lead Expedition Team',
    xpReward: 750,
    gearRequired: ['Sub-zero sleeping bag', 'Trekking poles', 'Water purification', 'First aid']
  }
];

export const INITIAL_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'plan-beginner-panther',
    title: '4-WEEK BEGINNER PANTHER',
    tagline: 'Establish the foundation. Build discipline from zero.',
    durationWeeks: 4,
    workoutsPerWeek: 3,
    fitnessLevel: 'Beginner',
    goal: 'General fitness',
    description: 'Perfect for the man rebooting his body. Focuses on proper push-up mechanics, air squat depth, core bracing, and daily morning mobility without risking injury.',
    currentWeek: 2,
    isEnrolled: true
  },
  {
    id: 'plan-strength-build',
    title: '8-WEEK STRENGTH BUILD',
    tagline: 'Forge dense muscle and uncompromising physical power.',
    durationWeeks: 8,
    workoutsPerWeek: 4,
    fitnessLevel: 'Intermediate',
    goal: 'Strength',
    description: 'Progressive overload protocol balancing compound calisthenics, weighted push-pull routines, and explosive leg power.',
    currentWeek: 1,
    isEnrolled: false
  },
  {
    id: 'plan-30day-consistency',
    title: '30-DAY CONSISTENCY CHALLENGE',
    tagline: 'Silent consistency over raw intensity.',
    durationWeeks: 4,
    workoutsPerWeek: 6,
    fitnessLevel: 'Intermediate',
    goal: 'Discipline',
    description: '30 days straight of structured physical movement, daily reading, cold showers, and brotherhood check-ins. Rewires your default habits.',
    currentWeek: 1,
    isEnrolled: false
  },
  {
    id: 'plan-trail-panther',
    title: 'TRAIL PANTHER ENDURANCE',
    tagline: 'Prepare your lungs and legs for mountain terrain.',
    durationWeeks: 6,
    workoutsPerWeek: 4,
    fitnessLevel: 'Advanced',
    goal: 'Endurance',
    description: 'Incline rucking, high-volume unilateral leg work, hill sprint intervals, and breathing endurance for high-altitude ascents.',
    currentWeek: 1,
    isEnrolled: false
  },
  {
    id: 'plan-bodyweight-alpha',
    title: 'BODYWEIGHT PANTHER: CALISTHENICS ALPHA',
    tagline: 'Master your own mass with zero equipment.',
    durationWeeks: 6,
    workoutsPerWeek: 4,
    fitnessLevel: 'Intermediate',
    goal: 'Muscle building',
    description: 'Strict push-up variations, isometric plank holds, deep lunges, and pull-up progressions you can execute in any hotel, yard, or park.',
    currentWeek: 1,
    isEnrolled: false
  }
];

export const INITIAL_WELLNESS_RESOURCES: WellnessResource[] = [
  {
    id: 'well-box-breathing',
    title: 'Panther Box Breathing (4-4-4-4)',
    type: 'Breathing',
    duration: '5 Mins',
    description: 'De-escalate high nervous system stress and regain tactical composure under pressure.',
    content: 'Inhale through the nose for 4 seconds. Hold lungs full for 4 seconds. Exhale slowly through the mouth for 4 seconds. Hold empty for 4 seconds. Repeat for 5 cycles.'
  },
  {
    id: 'well-morning-grounding',
    title: 'The Silent Dawn: 10-Minute Focus Meditation',
    type: 'Meditation',
    duration: '10 Mins',
    description: 'Ground your spirit before looking at notifications or client demands.',
    content: 'Sit with an erect spine. Place your palms on your knees. Fix your attention on the cool air touching your nostrils. Notice when the mind races; acknowledge it without judgment and bring focus back to the breath.'
  },
  {
    id: 'well-daily-reflection',
    title: 'The Evening Brotherhood Reflection',
    type: 'Reflection',
    duration: '5 Mins',
    description: 'Three questions for daily character alignment.',
    content: '1. What did you endure today with dignity?\n2. Which brother did you reach out to or lift up?\n3. What burden are you holding onto that you need to set down before you sleep?'
  },
  {
    id: 'well-crisis-directory',
    title: 'Professional Support & Crisis Helplines',
    type: 'Directory',
    description: '“Strong men speak.” Immediate confidential assistance when life becomes overwhelming.',
    content: 'PANTHER and THE BA CHALLENGE emphasize that seeking professional counsel is an act of courage and leadership, not weakness.\n\n• Kenya Red Cross Psychological Hotline: 1199 (Toll-Free, 24/7)\n• Befrienders Kenya Helpline: +254 722 178 177\n• South Africa Men\'s Helpline / Lifeline: 0861 322 322\n• Global Crisis Text Line: Text HOME to 741741\n• UK CALM (Campaign Against Living Miserably for Men): 0800 58 58 58\n• US 988 Suicide & Crisis Lifeline: Call or Text 988\n\nRemember: If you or a brother is in immediate physical danger, contact local emergency services immediately.'
  }
];

export const INITIAL_ENVIRONMENTAL_CHALLENGES: EnvironmentalChallenge[] = [
  {
    id: 'env-rift-valley',
    title: '10,000 Indigenous Trees for the Great Rift Valley',
    targetTrees: 10000,
    currentTrees: 7420,
    location: 'Rift Valley Escarpment & Mau Forest Edge',
    deadline: 'December 2026',
    participants: 412
  },
  {
    id: 'env-karura-canopy',
    title: 'Karura Urban Forest Indigenous Canopy Restoration',
    targetTrees: 2500,
    currentTrees: 2150,
    location: 'Karura Forest Nairobi',
    deadline: 'October 2026',
    participants: 184
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Good morning, Panther.',
    message: 'Your trail starts today. The dawn belongs to the disciplined.',
    timestamp: 'Today, 05:30 AM',
    type: 'morning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Streak Fortified',
    message: 'You have conquered 14 consecutive days on the path.',
    timestamp: 'Yesterday, 07:15 PM',
    type: 'milestone',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Trail Alert: Ngong Hills Hike',
    message: 'The trail is calling. Your next BA brotherhood hike is in 8 days. 47 brothers registered.',
    timestamp: 'Sep 10, 11:00 AM',
    type: 'event',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Brotherhood Update',
    message: 'Brother Marcus Adebayo celebrated a 14-day zero-alcohol milestone.',
    timestamp: 'Sep 9, 04:20 PM',
    type: 'community',
    read: true
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-2026-09-10',
    title: 'Dawn Trail Ruck & Hills',
    category: 'Cardio',
    durationMinutes: 52,
    caloriesBurned: 480,
    stepsRecorded: 7800,
    rpe: 7.5,
    totalVolumeKg: 3600,
    totalSets: 16,
    totalReps: 180,
    notes: 'Ngong foot-trail with 12kg pack. Brotherly pace.',
    date: 'Yesterday',
    isoDate: '2026-09-10',
    timestamp: new Date('2026-09-10T06:00:00Z').getTime(),
    xpEarned: 260
  },
  {
    id: 'act-2026-09-09',
    title: 'Obsidian Functional Hypertrophy',
    category: 'Strength',
    durationMinutes: 48,
    caloriesBurned: 420,
    rpe: 8.5,
    totalVolumeKg: 5850,
    totalSets: 20,
    totalReps: 210,
    notes: 'Push and pull supersets. Focused tempo.',
    date: '2 days ago',
    isoDate: '2026-09-09',
    timestamp: new Date('2026-09-09T07:15:00Z').getTime(),
    xpEarned: 240
  },
  {
    id: 'act-2026-09-08',
    title: 'Morning Joint & Hip Liberation',
    category: 'Mobility',
    durationMinutes: 22,
    caloriesBurned: 110,
    rpe: 3.5,
    totalVolumeKg: 800,
    totalSets: 8,
    totalReps: 95,
    notes: 'Pre-sunrise flow and deep diaphragmatic breathwork.',
    date: '3 days ago',
    isoDate: '2026-09-08',
    timestamp: new Date('2026-09-08T05:45:00Z').getTime(),
    xpEarned: 100
  },
  {
    id: 'act-2026-09-07',
    title: 'Calisthenics Alpha & Core',
    category: 'Bodyweight',
    durationMinutes: 40,
    caloriesBurned: 360,
    rpe: 7.0,
    totalVolumeKg: 4200,
    totalSets: 18,
    totalReps: 190,
    notes: 'Strict pull-ups and ring dips. Solid rhythm.',
    date: '4 days ago',
    isoDate: '2026-09-07',
    timestamp: new Date('2026-09-07T06:30:00Z').getTime(),
    xpEarned: 210
  },
  {
    id: 'act-2026-09-05',
    title: 'Iron Panther Heavy Push',
    category: 'Strength',
    durationMinutes: 50,
    caloriesBurned: 460,
    rpe: 8.8,
    totalVolumeKg: 6800,
    totalSets: 22,
    totalReps: 175,
    notes: 'Weighted dips and heavy overhead presses. Near failure on last set.',
    date: '6 days ago',
    isoDate: '2026-09-05',
    timestamp: new Date('2026-09-05T07:00:00Z').getTime(),
    xpEarned: 260
  },
  {
    id: 'act-2026-09-04',
    title: 'Ngong Trail Interval Run',
    category: 'Cardio',
    durationMinutes: 45,
    caloriesBurned: 490,
    stepsRecorded: 6900,
    rpe: 8.0,
    totalVolumeKg: 3100,
    totalSets: 14,
    totalReps: 140,
    notes: 'High cadence hill ascents. Heart rate locked in zone 4.',
    date: '7 days ago',
    isoDate: '2026-09-04',
    timestamp: new Date('2026-09-04T05:30:00Z').getTime(),
    xpEarned: 250
  },
  {
    id: 'act-2026-09-03',
    title: 'Deep Stretch & Breathwork',
    category: 'Mobility',
    durationMinutes: 25,
    caloriesBurned: 95,
    rpe: 3.0,
    totalVolumeKg: 600,
    totalSets: 6,
    totalReps: 60,
    notes: 'Diaphragmatic decompression and spine recovery.',
    date: '8 days ago',
    isoDate: '2026-09-03',
    timestamp: new Date('2026-09-03T20:00:00Z').getTime(),
    xpEarned: 110
  },
  {
    id: 'act-2026-09-02',
    title: 'Obsidian Functional Hypertrophy (Pull Focus)',
    category: 'Strength',
    durationMinutes: 46,
    caloriesBurned: 410,
    rpe: 8.2,
    totalVolumeKg: 5600,
    totalSets: 19,
    totalReps: 190,
    notes: 'Barbell rows and single-arm gorilla rows. Back pump.',
    date: '9 days ago',
    isoDate: '2026-09-02',
    timestamp: new Date('2026-09-02T06:45:00Z').getTime(),
    xpEarned: 230
  },
  {
    id: 'act-2026-08-31',
    title: 'Heavy Ruck & Ridge Ascents',
    category: 'Cardio',
    durationMinutes: 60,
    caloriesBurned: 560,
    stepsRecorded: 9200,
    rpe: 8.5,
    totalVolumeKg: 4400,
    totalSets: 16,
    totalReps: 160,
    notes: '15kg weighted vest. Constant cadence up steep terrain.',
    date: 'Aug 31',
    isoDate: '2026-08-31',
    timestamp: new Date('2026-08-31T05:30:00Z').getTime(),
    xpEarned: 300
  },
  {
    id: 'act-2026-08-30',
    title: 'Full Body Panther Armor',
    category: 'Bodyweight',
    durationMinutes: 42,
    caloriesBurned: 380,
    rpe: 7.5,
    totalVolumeKg: 4600,
    totalSets: 20,
    totalReps: 220,
    notes: 'Bodyweight tempo reps with pause at bottom.',
    date: 'Aug 30',
    isoDate: '2026-08-30',
    timestamp: new Date('2026-08-30T06:15:00Z').getTime(),
    xpEarned: 215
  },
  {
    id: 'act-2026-08-28',
    title: 'Heavy Squat & Hamstring Engine',
    category: 'Strength',
    durationMinutes: 52,
    caloriesBurned: 510,
    rpe: 9.0,
    totalVolumeKg: 7400,
    totalSets: 22,
    totalReps: 160,
    notes: 'Heavy back squats and Romanian deadlifts. High mechanical tension.',
    date: 'Aug 28',
    isoDate: '2026-08-28',
    timestamp: new Date('2026-08-28T07:00:00Z').getTime(),
    xpEarned: 280
  },
  {
    id: 'act-2026-08-26',
    title: 'Recovery Yoga & Spine Flow',
    category: 'Mobility',
    durationMinutes: 30,
    caloriesBurned: 120,
    rpe: 4.0,
    totalVolumeKg: 900,
    totalSets: 8,
    totalReps: 80,
    notes: 'Post-heavy day restoration and nervous system down-regulation.',
    date: 'Aug 26',
    isoDate: '2026-08-26',
    timestamp: new Date('2026-08-26T06:00:00Z').getTime(),
    xpEarned: 120
  },
  {
    id: 'act-2026-08-25',
    title: 'Upper Body Hypertrophy',
    category: 'Strength',
    durationMinutes: 45,
    caloriesBurned: 400,
    rpe: 8.0,
    totalVolumeKg: 5200,
    totalSets: 18,
    totalReps: 180,
    notes: 'Incline dumbbell presses and weighted chin-ups.',
    date: 'Aug 25',
    isoDate: '2026-08-25',
    timestamp: new Date('2026-08-25T06:30:00Z').getTime(),
    xpEarned: 225
  },
  {
    id: 'act-2026-08-23',
    title: 'Sunrise 10K Paced Ruck',
    category: 'Cardio',
    durationMinutes: 58,
    caloriesBurned: 530,
    stepsRecorded: 8500,
    rpe: 7.8,
    totalVolumeKg: 3800,
    totalSets: 15,
    totalReps: 150,
    notes: 'Karura trail loop with brothers.',
    date: 'Aug 23',
    isoDate: '2026-08-23',
    timestamp: new Date('2026-08-23T05:45:00Z').getTime(),
    xpEarned: 275
  },
  {
    id: 'act-2026-08-21',
    title: 'Deload Mobility & Core Stabilizers',
    category: 'Mobility',
    durationMinutes: 25,
    caloriesBurned: 115,
    rpe: 4.5,
    totalVolumeKg: 1200,
    totalSets: 10,
    totalReps: 110,
    notes: 'Scheduled microcycle deload. Active blood flow.',
    date: 'Aug 21',
    isoDate: '2026-08-21',
    timestamp: new Date('2026-08-21T06:00:00Z').getTime(),
    xpEarned: 115
  },
  {
    id: 'act-2026-08-19',
    title: 'Obsidian Functional Hypertrophy',
    category: 'Strength',
    durationMinutes: 44,
    caloriesBurned: 390,
    rpe: 7.8,
    totalVolumeKg: 5100,
    totalSets: 18,
    totalReps: 175,
    notes: 'Full body supersets.',
    date: 'Aug 19',
    isoDate: '2026-08-19',
    timestamp: new Date('2026-08-19T06:45:00Z').getTime(),
    xpEarned: 220
  },
  {
    id: 'act-2026-08-17',
    title: 'Alpha Push & Pull Volume',
    category: 'Strength',
    durationMinutes: 48,
    caloriesBurned: 430,
    rpe: 8.2,
    totalVolumeKg: 5900,
    totalSets: 21,
    totalReps: 200,
    notes: 'Overload progression on chest and lats.',
    date: 'Aug 17',
    isoDate: '2026-08-17',
    timestamp: new Date('2026-08-17T06:30:00Z').getTime(),
    xpEarned: 245
  },
  {
    id: 'act-2026-08-15',
    title: 'Karura Forest Ridge Run',
    category: 'Cardio',
    durationMinutes: 40,
    caloriesBurned: 420,
    stepsRecorded: 6200,
    rpe: 7.2,
    totalVolumeKg: 2800,
    totalSets: 12,
    totalReps: 120,
    notes: 'Paced trail tempo.',
    date: 'Aug 15',
    isoDate: '2026-08-15',
    timestamp: new Date('2026-08-15T05:30:00Z').getTime(),
    xpEarned: 200
  },
  {
    id: 'act-2026-08-13',
    title: 'Foundation Calisthenics',
    category: 'Bodyweight',
    durationMinutes: 35,
    caloriesBurned: 310,
    rpe: 6.8,
    totalVolumeKg: 3600,
    totalSets: 16,
    totalReps: 160,
    notes: 'Clean reps, full range of motion.',
    date: 'Aug 13',
    isoDate: '2026-08-13',
    timestamp: new Date('2026-08-13T06:00:00Z').getTime(),
    xpEarned: 180
  }
];

export const DEFAULT_USER: UserProfile = {
  id: 'user-panther-current',
  fullName: 'Brad Madahana',
  email: 'madahanabrad@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  ageBracket: '25-34',
  fitnessLevel: 'Intermediate',
  primaryGoal: 'Strength',
  trainingFrequency: 5,
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
  preferredEnvironment: 'Mixed',
  injuries: 'Right knee slight stiffness under heavy load',
  emergencyContact: {
    name: 'Sarah Madahana',
    phone: '+254 712 345 678'
  },
  baMembershipStatus: 'Active BA Challenger',
  joinedDate: 'August 2026',
  pantherLevel: 4, // Panther
  xp: 3150,
  streak: {
    current: 14,
    longest: 21,
    lastActiveDate: new Date().toISOString().split('T')[0],
    workoutsThisMonth: 12,
    daysActiveTotal: 44,
    challengesCompletedTotal: 38
  },
  treesPlanted: 28,
  hikesCompleted: 6,
  isPublicRanking: true,
  role: 'member',
  membershipTier: 'BA PANTHER',
  isPremium: false,
  premiumTier: 'free',
  dailyHabits: [
    { id: 'habit-1', label: 'Read 10 pages of a book', completed: false },
    { id: 'habit-2', label: 'Take a cold shower', completed: false }
  ],
  lastHabitResetDate: new Date().toISOString().split('T')[0],
  hydration: {
    current: 0,
    goal: 3000,
    date: new Date().toISOString().split('T')[0]
  }
};
